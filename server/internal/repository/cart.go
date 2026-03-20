package repository

import (
	"context"

	"github.com/SerenaaaaRN/juicy/internal/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type cartRepo struct {
	db *gorm.DB
}

func NewCartRepository(db *gorm.DB) *cartRepo {
	return &cartRepo{db: db}
}

func (r *cartRepo) FindByCustomerID(ctx context.Context, customerID uuid.UUID) ([]model.CartItem, error) {
	var items []model.CartItem
	err := r.db.WithContext(ctx).
		Preload("Variant").
		Preload("Variant.ProductID").
		Where("customer_id = ?", customerID).
		Order("created_at DESC").
		Find(&items).Error
	return items, err
}

func (r *cartRepo) FindItemByID(ctx context.Context, id uuid.UUID) (*model.CartItem, error) {
	var item model.CartItem
	err := r.db.WithContext(ctx).Preload("Variant").Where("id = ?", id).First(&item).Error
	if err != nil {
		return nil, err
	}
	return &item, nil
}

func (r *cartRepo) UpsertItem(ctx context.Context, item *model.CartItem) error {

	return r.db.WithContext(ctx).Clauses(clause.OnConflict{
		Columns: []clause.Column{{Name: "customer_id"}, {Name: "variant_id"}},
		DoUpdates: clause.Assignments(map[string]interface{}{
			"quantity":   gorm.Expr("cart_items.quantity + EXCLUDED.quantity"),
			"updated_at": gorm.Expr("NOW()"),
		}),
	}).Create(item).Error
}

func (r *cartRepo) UpdateItemQuantity(ctx context.Context, id uuid.UUID, customerID uuid.UUID, quantity int) error {
	return r.db.WithContext(ctx).Model(&model.CartItem{}).
		Where("id = ? AND customer_id = ?", id, customerID).
		Update("quantity", quantity).Error
}

func (r *cartRepo) RemoveItem(ctx context.Context, id uuid.UUID, customerID uuid.UUID) error {
	return r.db.WithContext(ctx).
		Where("id = ? AND customer_id = ?", id, customerID).
		Delete(&model.CartItem{}).Error
}

func (r *cartRepo) ClearCart(ctx context.Context, customerID uuid.UUID) error {
	return r.db.WithContext(ctx).
		Where("customer_id = ?", customerID).
		Delete(&model.CartItem{}).Error
}
