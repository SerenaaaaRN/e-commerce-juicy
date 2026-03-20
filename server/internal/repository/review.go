package repository

import (
	"context"

	"github.com/SerenaaaaRN/juicy/internal/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type reviewRepo struct {
	db *gorm.DB
}

func NewReviewRepository(db *gorm.DB) *reviewRepo {
	return &reviewRepo{db: db}
}

func (r *reviewRepo) Create(ctx context.Context, review *model.Review) error {
	return r.db.WithContext(ctx).Create(review).Error
}

func (r *reviewRepo) FindByProductID(ctx context.Context, productID uuid.UUID, page, perPage int) ([]model.Review, int64, error) {
	var reviews []model.Review
	var total int64

	query := r.db.WithContext(ctx).Model(&model.Review{}).
		Preload("Customer").
		Where("product_id = ? AND is_published = ?", productID, true)

	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * perPage
	err = query.Offset(offset).Limit(perPage).Order("created_at DESC").Find(&reviews).Error
	if err != nil {
		return nil, 0, err
	}

	return reviews, total, nil
}

func (r *reviewRepo) FindAll(ctx context.Context, productID *uuid.UUID, published *bool, page, perPage int) ([]model.Review, int64, error) {
	var reviews []model.Review
	var total int64

	query := r.db.WithContext(ctx).Model(&model.Review{}).
		Preload("Customer").
		Preload("Product")

	if productID != nil {
		query = query.Where("product_id = ?", *productID)
	}

	if published != nil {
		query = query.Where("is_published = ?", *published)
	}

	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * perPage
	err = query.Offset(offset).Limit(perPage).Order("created_at DESC").Find(&reviews).Error
	if err != nil {
		return nil, 0, err
	}

	return reviews, total, nil
}

func (r *reviewRepo) FindByID(ctx context.Context, id uuid.UUID) (*model.Review, error) {
	var review model.Review
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&review).Error
	if err != nil {
		return nil, err
	}
	return &review, nil
}

func (r *reviewRepo) UpdatePublishStatus(ctx context.Context, id uuid.UUID, isPublished bool) error {
	return r.db.WithContext(ctx).Model(&model.Review{}).
		Where("id = ?", id).
		Update("is_published", isPublished).Error
}

func (r *reviewRepo) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Where("id = ?", id).Delete(&model.Review{}).Error
}

func (r *reviewRepo) Exists(ctx context.Context, customerID uuid.UUID, productID uuid.UUID, orderID uuid.UUID) (bool, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&model.Review{}).
		Where("customer_id = ? AND product_id = ? AND order_id = ?", customerID, productID, orderID).
		Count(&count).Error
	return count > 0, err
}
