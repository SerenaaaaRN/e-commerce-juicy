package repository

import (
	"context"

	"github.com/SerenaaaaRN/juicy/internal/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type categoryRepo struct {
	db *gorm.DB
}

func NewCategoryRepository(db *gorm.DB) *categoryRepo {
	return &categoryRepo{db: db}
}

func (r *categoryRepo) FindAllActive(ctx context.Context) ([]model.Category, error) {
	var categories []model.Category
	err := r.db.WithContext(ctx).Where("is_active = ?", true).Order("display_order asc, name asc").Find(&categories).Error
	return categories, err
}

func (r *categoryRepo) FindAll(ctx context.Context) ([]model.Category, error) {
	var categories []model.Category
	err := r.db.WithContext(ctx).Order("display_order asc, name asc").Find(&categories).Error
	return categories, err
}

func (r *categoryRepo) FindByID(ctx context.Context, id uuid.UUID) (*model.Category, error) {
	var category model.Category
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&category).Error
	if err != nil {
		return nil, err
	}
	return &category, nil
}

func (r *categoryRepo) FindBySlug(ctx context.Context, slug string) (*model.Category, error) {
	var category model.Category
	err := r.db.WithContext(ctx).Where("slug = ?", slug).First(&category).Error
	if err != nil {
		return nil, err
	}
	return &category, nil
}

func (r *categoryRepo) Create(ctx context.Context, category *model.Category) error {
	return r.db.WithContext(ctx).Create(category).Error
}

func (r *categoryRepo) Update(ctx context.Context, category *model.Category) error {
	return r.db.WithContext(ctx).Save(category).Error
}

func (r *categoryRepo) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Where("id = ?", id).Delete(&model.Category{}).Error
}

func (r *categoryRepo) GetProductCounts(ctx context.Context) (map[uuid.UUID]int64, error) {
	type Result struct {
		CategoryID uuid.UUID
		Count      int64
	}
	var results []Result
	err := r.db.WithContext(ctx).Model(&model.Product{}).
		Where("is_available = ?", true).
		Select("category_id, COUNT(*) as count").
		Group("category_id").
		Scan(&results).Error
	if err != nil {
		return nil, err
	}

	counts := make(map[uuid.UUID]int64)
	for _, res := range results {
		counts[res.CategoryID] = res.Count
	}
	return counts, nil
}
