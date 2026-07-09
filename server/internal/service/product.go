package service

import (
	"context"
	"fmt"
	"io"
	"log/slog"
	"mime/multipart"
	"os"
	"path/filepath"
	"time"

	"github.com/SerenaaaaRN/juicy/internal/dto"
	"github.com/SerenaaaaRN/juicy/internal/model"
	"github.com/google/uuid"
)

type productService struct {
	repo              ProductRepository
	cloudinaryService *CloudinaryService
}

func NewProductService(repo ProductRepository, cloudinaryService *CloudinaryService) *productService {
	return &productService{
		repo:              repo,
		cloudinaryService: cloudinaryService,
	}
}

func (s *productService) ListProducts(
	ctx context.Context,
	filter dto.ProductFilter,
) ([]dto.ProductResponse, int64, error) {
	products, total, err := s.repo.FindAll(ctx, filter)
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
		slog.Warn("Failed to fetch review statistics", "error", err)
		statsMap = make(map[uuid.UUID]dto.ProductReviewStat)
	}

	res := make([]dto.ProductResponse, len(products))
	for i, p := range products {
		primaryImg := getPrimaryImageURL(p.Images)

		pStats := statsMap[p.ID]

		variantsRes := toVariantResponses(p.Variants)
		imagesRes := toImageResponses(p.Images)

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
			slog.Warn("Failed to delete cloudinary image", "error", err)
		}
	}

	return s.repo.Delete(ctx, id)
}

func (s *productService) AddProductImages(ctx context.Context, id uuid.UUID, files []*multipart.FileHeader) error {
	product, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return ErrProductNotFound
	}

	tempDir, err := os.MkdirTemp("", "juicy-uploads-*")
	if err != nil {
		return fmt.Errorf("failed to create temp directory: %w", err)
	}
	defer os.RemoveAll(tempDir)

	var tempPaths []string
	var uploadedIDs []string
	defer func() {
		for _, p := range tempPaths {
			os.Remove(p)
		}
	}()

	for _, file := range files {
		tempPath := filepath.Join(tempDir, uuid.New().String()+filepath.Ext(file.Filename))
		src, err := file.Open()
		if err != nil {
			return fmt.Errorf("failed to open uploaded file: %w", err)
		}

		dst, err := os.Create(tempPath)
		if err != nil {
			src.Close()
			return fmt.Errorf("failed to create temp file: %w", err)
		}

		_, err = io.Copy(dst, src)
		src.Close()
		dst.Close()
		if err != nil {
			return fmt.Errorf("failed to save temp file: %w", err)
		}

		tempPaths = append(tempPaths, tempPath)
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

	for _, path := range tempPaths {
		maxOrder++

		secureURL, publicID, err := s.cloudinaryService.UploadImage(ctx, path)
		if err != nil {
			s.rollbackCloudinaryUploads(ctx, uploadedIDs)
			return fmt.Errorf("failed to upload image: %w", err)
		}
		uploadedIDs = append(uploadedIDs, publicID)

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
			s.rollbackCloudinaryUploads(ctx, uploadedIDs)
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
		slog.Warn("Failed to delete cloudinary image", "public_id", cldID, "error", err)
	}

	err = s.repo.DeleteImage(ctx, imageID, id)
	if err != nil {
		return err
	}

	if image.IsPrimary {
		remain, err := s.repo.FindImagesByProductID(ctx, id)
		if err == nil && len(remain) > 0 {
			if err := s.repo.SetPrimaryImage(ctx, remain[0].ID, id); err != nil {
			slog.Warn("Failed to promote primary image", "error", err)
		}
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

func (s *productService) rollbackCloudinaryUploads(ctx context.Context, publicIDs []string) {
	for _, id := range publicIDs {
		if err := s.cloudinaryService.DeleteImage(ctx, id); err != nil {
			slog.Warn("Failed to rollback Cloudinary upload", "public_id", id, "error", err)
		}
	}
}

func (s *productService) mapToDetailResponse(ctx context.Context, p *model.Product) (*dto.ProductDetailResponse, error) {

	stat, err := s.repo.GetReviewStat(ctx, p.ID)
	if err != nil {
		slog.Warn("Failed to query product detail stats", "error", err)
		stat = &dto.ProductReviewStat{}
	}

	imagesRes := toImageResponses(p.Images)
	variantsRes := toVariantResponses(p.Variants)
	primaryImage := getPrimaryImageURL(p.Images)

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
