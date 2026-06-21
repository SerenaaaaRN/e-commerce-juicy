package repository

import (
	"context"
	"strings"

	"github.com/SerenaaaaRN/juicy/internal/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type productRepo struct {
	db *gorm.DB
}

func NewProductRepository(db *gorm.DB) *productRepo {
	return &productRepo{db: db}
}

func (r *productRepo) FindAll(
	ctx context.Context,
	categorySlug string,
	featuredOnly bool,
	tag string,
	sort string,
	page, perPage int,
	includeUnavailable bool,
	sizes []string,
	search string,
) ([]model.Product, int64, error) {
	var products []model.Product
	var total int64

	query := r.db.WithContext(ctx).Model(&model.Product{})

	if !includeUnavailable {
		query = query.Where("is_available = ?", true)
	}

	if categorySlug != "" {
		var cat model.Category
		if err := r.db.WithContext(ctx).Where("slug = ?", categorySlug).First(&cat).Error; err == nil {
			var descendants []uuid.UUID
			err = r.db.WithContext(ctx).Raw(`
				WITH RECURSIVE cat_tree AS (
					SELECT id FROM categories WHERE id = ?
					UNION ALL
					SELECT c.id FROM categories c
					JOIN cat_tree ct ON c.parent_id = ct.id
				)
				SELECT id FROM cat_tree
			`, cat.ID).Scan(&descendants).Error

			if err == nil && len(descendants) > 0 {
				query = query.Where("category_id IN ?", descendants)
			} else {
				query = query.Where("category_id = ?", cat.ID)
			}
		} else {
			query = query.Joins("JOIN categories ON categories.id = products.category_id").
				Where("categories.slug = ?", categorySlug)
		}
	}

	if len(sizes) > 0 {
		query = query.Where("EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = products.id AND pv.is_active = ? AND pv.size IN ?)", true, sizes)
	}

	if search != "" {
		searchTerm := "%" + strings.ToLower(search) + "%"
		query = query.Where("LOWER(products.name) LIKE ? OR LOWER(products.description) LIKE ?", searchTerm, searchTerm)
	}

	if featuredOnly {
		query = query.Where("is_featured = ?", true)
	}

	if tag != "" {
		query = query.Where("tags @> ?", `["`+tag+`"]`)
	}

	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}
	query = query.Preload("Category").Preload("Images", func(db *gorm.DB) *gorm.DB {
		return db.Order("display_order ASC")
	}).Preload("Variants", func(db *gorm.DB) *gorm.DB {
		return db.Where("is_active = ?", true)
	})

	switch strings.ToLower(sort) {
	case "price_asc":
		query = query.Order("price ASC")
	case "price_desc":
		query = query.Order("price DESC")
	case "newest":
		query = query.Order("created_at DESC")
	case "popular":
		query = query.Order("is_featured DESC, display_order ASC, created_at DESC")
	default:
		query = query.Order("display_order ASC, created_at DESC")
	}

	offset := (page - 1) * perPage
	err = query.Offset(offset).Limit(perPage).Find(&products).Error
	if err != nil {
		return nil, 0, err
	}

	return products, total, nil
}

func (r *productRepo) FindBySlug(ctx context.Context, slug string) (*model.Product, error) {
	var product model.Product
	err := r.db.WithContext(ctx).
		Preload("Category").
		Preload("Images", func(db *gorm.DB) *gorm.DB {
			return db.Order("display_order ASC")
		}).
		Preload("Variants", func(db *gorm.DB) *gorm.DB {
			return db.Where("is_active = ?", true).Order("size ASC, color ASC")
		}).
		Where("slug = ?", slug).
		First(&product).Error
	if err != nil {
		return nil, err
	}
	return &product, nil
}

func (r *productRepo) FindByID(ctx context.Context, id uuid.UUID) (*model.Product, error) {
	var product model.Product
	err := r.db.WithContext(ctx).
		Preload("Category").
		Preload("Images", func(db *gorm.DB) *gorm.DB {
			return db.Order("display_order ASC")
		}).
		Preload("Variants", func(db *gorm.DB) *gorm.DB {
			return db.Where("is_active = ?", true).Order("size ASC, color ASC")
		}).
		Where("id = ?", id).
		First(&product).Error
	if err != nil {
		return nil, err
	}
	return &product, nil
}

func (r *productRepo) Create(ctx context.Context, product *model.Product) error {
	return r.db.WithContext(ctx).Create(product).Error
}

func (r *productRepo) Update(ctx context.Context, product *model.Product) error {
	return r.db.WithContext(ctx).Save(product).Error
}

func (r *productRepo) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Where("id = ?", id).Delete(&model.Product{}).Error
}

func (r *productRepo) CreateImage(ctx context.Context, image *model.ProductImage) error {
	return r.db.WithContext(ctx).Create(image).Error
}

func (r *productRepo) DeleteImage(ctx context.Context, id uuid.UUID, productID uuid.UUID) error {
	return r.db.WithContext(ctx).Where("id = ? AND product_id = ?", id, productID).Delete(&model.ProductImage{}).Error
}

func (r *productRepo) FindImageByID(ctx context.Context, id uuid.UUID) (*model.ProductImage, error) {
	var image model.ProductImage
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&image).Error
	if err != nil {
		return nil, err
	}
	return &image, nil
}

func (r *productRepo) SetPrimaryImage(ctx context.Context, id uuid.UUID, productID uuid.UUID) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		err := tx.Model(&model.ProductImage{}).Where("product_id = ?", productID).Update("is_primary", false).Error
		if err != nil {
			return err
		}
		return tx.Model(&model.ProductImage{}).Where("id = ? AND product_id = ?", id, productID).Update("is_primary", true).Error
	})
}

func (r *productRepo) FindVariantsByProductID(ctx context.Context, productID uuid.UUID) ([]model.ProductVariant, error) {
	var variants []model.ProductVariant
	err := r.db.WithContext(ctx).Where("product_id = ? AND is_active = ?", productID, true).Order("size ASC, color ASC").Find(&variants).Error
	return variants, err
}

func (r *productRepo) FindVariantByID(ctx context.Context, id uuid.UUID) (*model.ProductVariant, error) {
	var variant model.ProductVariant
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&variant).Error
	if err != nil {
		return nil, err
	}
	return &variant, nil
}

func (r *productRepo) CreateVariant(ctx context.Context, variant *model.ProductVariant) error {
	return r.db.WithContext(ctx).Create(variant).Error
}

func (r *productRepo) UpdateVariant(ctx context.Context, variant *model.ProductVariant) error {
	return r.db.WithContext(ctx).Save(variant).Error
}

func (r *productRepo) DeactivateVariant(ctx context.Context, id uuid.UUID, productID uuid.UUID) error {
	return r.db.WithContext(ctx).Model(&model.ProductVariant{}).Where("id = ? AND product_id = ?", id, productID).Update("is_active", false).Error
}
