package service

import (
	"context"
	"errors"
	"fmt"
	"log"
	"time"

	"github.com/SerenaaaaRN/juicy/internal/dto"
	"github.com/SerenaaaaRN/juicy/internal/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

var (
	ErrProductNotFound = errors.New("PRODUCT_NOT_FOUND")
	ErrVariantNotFound = errors.New("VARIANT_NOT_FOUND")
	ErrImageNotFound   = errors.New("IMAGE_NOT_FOUND")
)

type productService struct {
	repo              ProductRepository
	cloudinaryService *CloudinaryService
	db                *gorm.DB
}

func NewProductService(repo ProductRepository, cloudinaryService *CloudinaryService, db *gorm.DB) *productService {
	return &productService{
		repo:              repo,
		cloudinaryService: cloudinaryService,
		db:                db,
	}
}

func (s *productService) ListProducts(
	ctx context.Context,
	categorySlug string,
	featuredOnly bool,
	tag string,
	sort string,
	page, perPage int,
	includeUnavailable bool,
	sizes []string,
	search string,
) ([]dto.ProductResponse, int64, error) {
	products, total, err := s.repo.FindAll(ctx, categorySlug, featuredOnly, tag, sort, page, perPage, includeUnavailable, sizes, search)
	if err != nil {
		return nil, 0, err
	}

	if len(products) == 0 {
		return []dto.ProductResponse{}, total, nil
	}

	productIDs := make([]uuid.UUID, len(products))
	for i, p := range products {
		productIDs[i] = p.ID
	}

	statsMap, err := s.repo.GetReviewStats(ctx, productIDs)
	if err != nil {
		log.Printf("Warning: failed to fetch review statistics: %v", err)
		statsMap = make(map[uuid.UUID]dto.ProductReviewStat)
	}

	res := make([]dto.ProductResponse, len(products))
	for i, p := range products {
		primaryImg := ""
		for _, img := range p.Images {
			if img.IsPrimary {
				primaryImg = img.ImageURL
				break
			}
		}

		if primaryImg == "" && len(p.Images) > 0 {
			primaryImg = p.Images[0].ImageURL
		}

		pStats := statsMap[p.ID]

		variantsRes := make([]dto.ProductVariantResponse, len(p.Variants))
		for j, v := range p.Variants {
			variantsRes[j] = dto.ProductVariantResponse{
				ID:              v.ID,
				Size:            v.Size,
				Color:           v.Color,
				Stock:           v.Stock,
				AdditionalPrice: v.AdditionalPrice,
				IsActive:        v.IsActive,
			}
		}

		imagesRes := make([]dto.ProductImageResponse, len(p.Images))
		for k, img := range p.Images {
			imagesRes[k] = dto.ProductImageResponse{
				ID:           img.ID,
				ImageURL:     img.ImageURL,
				AltText:      img.AltText,
				IsPrimary:    img.IsPrimary,
				DisplayOrder: img.DisplayOrder,
			}
		}

		res[i] = dto.ProductResponse{
			ID:             p.ID,
			CategoryID:     p.CategoryID,
			Name:           p.Name,
			Slug:           p.Slug,
			Description:    p.Description,
			Price:          p.Price,
			CompareAtPrice: p.CompareAtPrice,
			IsAvailable:    p.IsAvailable,
			IsFeatured:     p.IsFeatured,
			Tags:           p.Tags,
			DisplayOrder:   p.DisplayOrder,
			PrimaryImage:   primaryImg,
			CategoryName:   p.Category.Name,
			Images:         imagesRes,
			AvgRating:      pStats.AvgRating,
			ReviewCount:    pStats.ReviewCount,
			Variants:       variantsRes,
		}
	}

	return res, total, nil
}

func (s *productService) GetProductBySlug(ctx context.Context, slug string) (*dto.ProductDetailResponse, error) {
	product, err := s.repo.FindBySlug(ctx, slug)
	if err != nil {
		return nil, ErrProductNotFound
	}

	return s.mapToDetailResponse(ctx, product)
}

func (s *productService) GetProductByID(ctx context.Context, id uuid.UUID) (*dto.ProductDetailResponse, error) {
	product, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, ErrProductNotFound
	}

	return s.mapToDetailResponse(ctx, product)
}

func (s *productService) CreateProduct(ctx context.Context, product *model.Product) (*model.Product, error) {
	err := s.repo.Create(ctx, product)
	return product, err
}

func (s *productService) UpdateProduct(ctx context.Context, id uuid.UUID, product *model.Product) (*model.Product, error) {
	existing, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, ErrProductNotFound
	}

	existing.Name = product.Name
	existing.Slug = product.Slug
	existing.CategoryID = product.CategoryID
	existing.Category = model.Category{}
	existing.Description = product.Description
	existing.Price = product.Price
	existing.CompareAtPrice = product.CompareAtPrice
	existing.IsAvailable = product.IsAvailable
	existing.IsFeatured = product.IsFeatured
	existing.Tags = product.Tags
	existing.DisplayOrder = product.DisplayOrder
	existing.UpdatedAt = time.Now()

	err = s.repo.Update(ctx, existing)
	if err != nil {
		return nil, err
	}
	return existing, nil
}

func (s *productService) DeleteProduct(ctx context.Context, id uuid.UUID) error {
	product, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return ErrProductNotFound
	}

	for _, img := range product.Images {
		cldID := ""
		if img.CloudinaryPublicID != nil {
			cldID = *img.CloudinaryPublicID
		}
		if err := s.cloudinaryService.DeleteImage(ctx, cldID); err != nil {
			log.Printf("Warning: failed to delete cloudinary image: %v", err)
		}
	}

	return s.repo.Delete(ctx, id)
}

func (s *productService) AddProductImages(ctx context.Context, id uuid.UUID, filePaths []string) error {
	product, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return ErrProductNotFound
	}

	maxOrder := -1
	hasPrimary := false
	for _, img := range product.Images {
		if img.DisplayOrder > maxOrder {
			maxOrder = img.DisplayOrder
		}
		if img.IsPrimary {
			hasPrimary = true
		}
	}

	for _, path := range filePaths {
		maxOrder++

		secureURL, publicID, err := s.cloudinaryService.UploadImage(ctx, path)
		if err != nil {
			return fmt.Errorf("failed to upload image: %w", err)
		}

		isPrimary := false
		if !hasPrimary {
			isPrimary = true
			hasPrimary = true
		}

		newImage := &model.ProductImage{
			ProductID:          product.ID,
			ImageURL:           secureURL,
			CloudinaryPublicID: &publicID,
			DisplayOrder:       maxOrder,
			IsPrimary:          isPrimary,
		}

		if err := s.repo.CreateImage(ctx, newImage); err != nil {
			return err
		}
	}

	return nil
}

func (s *productService) AddProductImageUrl(ctx context.Context, id uuid.UUID, imageUrl string) error {
	product, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return ErrProductNotFound
	}

	maxOrder := -1
	hasPrimary := false
	for _, img := range product.Images {
		if img.DisplayOrder > maxOrder {
			maxOrder = img.DisplayOrder
		}
		if img.IsPrimary {
			hasPrimary = true
		}
	}

	maxOrder++
	isPrimary := false
	if !hasPrimary {
		isPrimary = true
	}

	newImage := &model.ProductImage{
		ProductID:          product.ID,
		ImageURL:           imageUrl,
		CloudinaryPublicID: nil,
		DisplayOrder:       maxOrder,
		IsPrimary:          isPrimary,
	}

	return s.repo.CreateImage(ctx, newImage)
}

func (s *productService) DeleteProductImage(ctx context.Context, id uuid.UUID, imageID uuid.UUID) error {
	image, err := s.repo.FindImageByID(ctx, imageID)
	if err != nil {
		return ErrImageNotFound
	}

	if image.ProductID != id {
		return ErrImageNotFound
	}

	cldID := ""
	if image.CloudinaryPublicID != nil {
		cldID = *image.CloudinaryPublicID
	}
	if err := s.cloudinaryService.DeleteImage(ctx, cldID); err != nil {
		log.Printf("Warning: failed to delete cloudinary image %s: %v", cldID, err)
	}

	err = s.repo.DeleteImage(ctx, imageID, id)
	if err != nil {
		return err
	}

	if image.IsPrimary {
		var remain []model.ProductImage
		err := s.db.WithContext(ctx).Where("product_id = ?", id).Order("display_order ASC").Find(&remain).Error
		if err == nil && len(remain) > 0 {
			s.repo.SetPrimaryImage(ctx, remain[0].ID, id)
		}
	}

	return nil
}

func (s *productService) SetPrimaryProductImage(ctx context.Context, id uuid.UUID, imageID uuid.UUID) error {
	image, err := s.repo.FindImageByID(ctx, imageID)
	if err != nil {
		return ErrImageNotFound
	}

	if image.ProductID != id {
		return ErrImageNotFound
	}

	return s.repo.SetPrimaryImage(ctx, imageID, id)
}

func (s *productService) GetProductVariants(ctx context.Context, productID uuid.UUID) ([]dto.ProductVariantResponse, error) {
	variants, err := s.repo.FindVariantsByProductID(ctx, productID)
	if err != nil {
		return nil, err
	}

	res := make([]dto.ProductVariantResponse, len(variants))
	for i, v := range variants {
		res[i] = dto.ProductVariantResponse{
			ID:              v.ID,
			Size:            v.Size,
			Color:           v.Color,
			Stock:           v.Stock,
			AdditionalPrice: v.AdditionalPrice,
			IsActive:        v.IsActive,
		}
	}
	return res, nil
}

func (s *productService) AddProductVariant(ctx context.Context, productID uuid.UUID, req dto.ProductVariantRequest) (*model.ProductVariant, error) {
	_, err := s.repo.FindByID(ctx, productID)
	if err != nil {
		return nil, ErrProductNotFound
	}

	variant := &model.ProductVariant{
		ProductID:       productID,
		Size:            req.Size,
		Color:           req.Color,
		Stock:           req.Stock,
		AdditionalPrice: req.AdditionalPrice,
		IsActive:        true,
	}

	err = s.repo.CreateVariant(ctx, variant)
	if err != nil {
		return nil, err
	}
	return variant, nil
}

func (s *productService) UpdateProductVariant(
	ctx context.Context,
	productID uuid.UUID,
	variantID uuid.UUID,
	req dto.ProductVariantRequest,
) (*model.ProductVariant, error) {
	variant, err := s.repo.FindVariantByID(ctx, variantID)
	if err != nil {
		return nil, ErrVariantNotFound
	}

	if variant.ProductID != productID {
		return nil, ErrVariantNotFound
	}

	variant.Size = req.Size
	variant.Color = req.Color
	variant.Stock = req.Stock
	variant.AdditionalPrice = req.AdditionalPrice
	variant.IsActive = req.IsActive
	variant.UpdatedAt = time.Now()

	err = s.repo.UpdateVariant(ctx, variant)
	if err != nil {
		return nil, err
	}
	return variant, nil
}

func (s *productService) DeleteProductVariant(ctx context.Context, productID uuid.UUID, variantID uuid.UUID) error {
	variant, err := s.repo.FindVariantByID(ctx, variantID)
	if err != nil {
		return ErrVariantNotFound
	}

	if variant.ProductID != productID {
		return ErrVariantNotFound
	}

	return s.repo.DeactivateVariant(ctx, variantID, productID)
}

func (s *productService) mapToDetailResponse(ctx context.Context, p *model.Product) (*dto.ProductDetailResponse, error) {

	stat, err := s.repo.GetReviewStat(ctx, p.ID)
	if err != nil {
		log.Printf("Warning: failed to query product detail stats: %v", err)
		stat = &dto.ProductReviewStat{}
	}

	imagesRes := make([]dto.ProductImageResponse, len(p.Images))
	for i, img := range p.Images {
		imagesRes[i] = dto.ProductImageResponse{
			ID:           img.ID,
			ImageURL:     img.ImageURL,
			AltText:      img.AltText,
			IsPrimary:    img.IsPrimary,
			DisplayOrder: img.DisplayOrder,
		}
	}

	variantsRes := make([]dto.ProductVariantResponse, len(p.Variants))
	for i, v := range p.Variants {
		variantsRes[i] = dto.ProductVariantResponse{
			ID:              v.ID,
			Size:            v.Size,
			Color:           v.Color,
			Stock:           v.Stock,
			AdditionalPrice: v.AdditionalPrice,
			IsActive:        v.IsActive,
		}
	}

	var primaryImage string
	for _, img := range p.Images {
		if img.IsPrimary {
			primaryImage = img.ImageURL
			break
		}
	}

	return &dto.ProductDetailResponse{
		ID:             p.ID,
		CategoryID:     p.CategoryID,
		Name:           p.Name,
		Slug:           p.Slug,
		Description:    p.Description,
		Price:          p.Price,
		CompareAtPrice: p.CompareAtPrice,
		IsAvailable:    p.IsAvailable,
		IsFeatured:     p.IsFeatured,
		Tags:           p.Tags,
		DisplayOrder:   p.DisplayOrder,
		PrimaryImage:   primaryImage,
		Category: dto.CategoryDetailInfo{
			ID:   p.Category.ID,
			Name: p.Category.Name,
			Slug: p.Category.Slug,
		},
		CategoryName: p.Category.Name,
		Images:       imagesRes,
		Variants:     variantsRes,
		AvgRating:    stat.AvgRating,
		ReviewCount:  stat.ReviewCount,
	}, nil
}
