package repository

import (
	"context"
	"errors"

	"github.com/SerenaaaaRN/juicy/internal/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type wishlistRepo struct {
	db *gorm.DB
}

func NewWishlistRepository(db *gorm.DB) *wishlistRepo {
	return &wishlistRepo{db: db}
}

func (r *wishlistRepo) FindByCustomerID(ctx context.Context, customerID uuid.UUID) ([]model.WishlistItem, error) {
	var items []model.WishlistItem
	err := r.db.WithContext(ctx).
		Preload("Variant").
		Preload("Variant.Product").
		Preload("Variant.Product.Images", "is_primary = ?", true).
		Where("customer_id = ?", customerID).
		Order("created_at DESC").
		Find(&items).Error
	return items, err
}

func (r *wishlistRepo) Exists(ctx context.Context, customerID uuid.UUID, variantID uuid.UUID) (bool, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&model.WishlistItem{}).
		Where("customer_id = ? AND variant_id = ?", customerID, variantID).
		Count(&count).Error
	return count > 0, err
}

func (r *wishlistRepo) Add(ctx context.Context, item *model.WishlistItem) error {
	return r.db.WithContext(ctx).Create(item).Error
}

func (r *wishlistRepo) Remove(ctx context.Context, customerID uuid.UUID, variantID uuid.UUID) error {
	result := r.db.WithContext(ctx).
		Where("customer_id = ? AND variant_id = ?", customerID, variantID).
		Delete(&model.WishlistItem{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("wishlist item not found")
	}
	return nil
}
