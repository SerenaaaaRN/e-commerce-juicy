package repository

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/google/uuid"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
	"github.com/SerenaaaaRN/juicy/internal/model"
)

var (
	ErrOutOfStock = errors.New("out of stock")
)

type orderRepo struct {
	db *gorm.DB
}

func NewOrderRepository(db *gorm.DB) *orderRepo {
	return &orderRepo{db: db}
}

func (r *orderRepo) Create(ctx context.Context, order *model.Order, items []model.OrderItem) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		for i := range items {
			item := &items[i]
			if item.VariantID == nil {
				return fmt.Errorf("variant_id is required for checkout")
			}

			var variant model.ProductVariant
			err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).
				Where("id = ? AND is_active = ?", *item.VariantID, true).
				First(&variant).Error
			if err != nil {
				if errors.Is(err, gorm.ErrRecordNotFound) {
					return fmt.Errorf("product variant %s not found or inactive", *item.VariantID)
				}
				return err
			}

			if variant.Stock < item.Quantity {
				return ErrOutOfStock
			}

			variant.Stock -= item.Quantity
			if err := tx.Save(&variant).Error; err != nil {
				return err
			}
		}

		if err := tx.Create(order).Error; err != nil {
			return err
		}

		for i := range items {
			items[i].OrderID = order.ID
			if err := tx.Create(&items[i]).Error; err != nil {
				return err
			}
		}

		if err := tx.Where("customer_id = ?", order.CustomerID).Delete(&model.CartItem{}).Error; err != nil {
			return err
		}

		return nil
	})
}

func (r *orderRepo) FindByCustomerID(ctx context.Context, customerID uuid.UUID, page, perPage int) ([]model.Order, int64, error) {
	var orders []model.Order
	var total int64

	query := r.db.WithContext(ctx).Model(&model.Order{}).Where("customer_id = ?", customerID)

	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * perPage
	err = query.Offset(offset).Limit(perPage).Order("created_at DESC").Find(&orders).Error
	if err != nil {
		return nil, 0, err
	}

	return orders, total, nil
}

func (r *orderRepo) FindByOrderNumberAndCustomerID(ctx context.Context, orderNumber string, customerID uuid.UUID) (*model.Order, error) {
	var order model.Order
	err := r.db.WithContext(ctx).
		Preload("Items").
		Where("order_number = ? AND customer_id = ?", orderNumber, customerID).
		First(&order).Error
	if err != nil {
		return nil, err
	}
	return &order, nil
}

func (r *orderRepo) FindAll(
	ctx context.Context,
	status string,
	paymentStatus string,
	search string,
	page, perPage int,
) ([]model.Order, int64, error) {
	var orders []model.Order
	var total int64

	query := r.db.WithContext(ctx).Model(&model.Order{}).
		Preload("Customer")

	if status != "" {
		query = query.Where("status = ?", status)
	}

	if paymentStatus != "" {
		query = query.Where("payment_status = ?", paymentStatus)
	}

	if search != "" {
		s := "%" + strings.ToLower(search) + "%"
		query = query.Joins("JOIN customers ON customers.id = orders.customer_id").
			Where("orders.order_number LIKE ? OR LOWER(customers.full_name) LIKE ? OR LOWER(customers.email) LIKE ?", s, s, s)
	}

	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * perPage
	err = query.Offset(offset).Limit(perPage).Order("created_at DESC").Find(&orders).Error
	if err != nil {
		return nil, 0, err
	}

	return orders, total, nil
}

func (r *orderRepo) FindByID(ctx context.Context, id uuid.UUID) (*model.Order, error) {
	var order model.Order
	err := r.db.WithContext(ctx).
		Preload("Customer").
		Preload("Address").
		Preload("Items").
		Where("id = ?", id).
		First(&order).Error
	if err != nil {
		return nil, err
	}
	return &order, nil
}

func (r *orderRepo) UpdateStatus(ctx context.Context, id uuid.UUID, status string) error {
	updates := map[string]interface{}{
		"status":     status,
		"updated_at": gorm.Expr("NOW()"),
	}
	if status == "shipped" {
		updates["shipped_at"] = gorm.Expr("NOW()")
	} else if status == "delivered" {
		updates["delivered_at"] = gorm.Expr("NOW()")
	}

	return r.db.WithContext(ctx).Model(&model.Order{}).Where("id = ?", id).Updates(updates).Error
}

func (r *orderRepo) UpdatePaymentStatus(ctx context.Context, id uuid.UUID, paymentStatus string) error {
	return r.db.WithContext(ctx).Model(&model.Order{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"payment_status": paymentStatus,
			"updated_at":     gorm.Expr("NOW()"),
		}).Error
}

func (r *orderRepo) HasCustomerPurchasedProduct(ctx context.Context, customerID uuid.UUID, productID uuid.UUID) (bool, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&model.Order{}).
		Joins("JOIN order_items ON order_items.order_id = orders.id").
		Joins("JOIN product_variants ON product_variants.id = order_items.variant_id").
		Where("orders.customer_id = ? AND product_variants.product_id = ? AND orders.status = ?", customerID, productID, "delivered").
		Count(&count).Error
	return count > 0, err
}

func (r *orderRepo) IsProductReviewable(ctx context.Context, customerID uuid.UUID, productID uuid.UUID, orderID uuid.UUID) (bool, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&model.Order{}).
		Joins("JOIN order_items ON order_items.order_id = orders.id").
		Joins("JOIN product_variants ON product_variants.id = order_items.variant_id").
		Where("orders.customer_id = ? AND orders.id = ? AND product_variants.product_id = ? AND orders.status = ?", customerID, orderID, productID, "delivered").
		Count(&count).Error
	return count > 0, err
}
