package service

import (
	"context"
	"errors"

	"github.com/SerenaaaaRN/juicy/internal/dto"
	"github.com/SerenaaaaRN/juicy/internal/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

var (
	ErrWishlistItemExists = errors.New("WISHLIST_ITEM_EXISTS")
)

type wishlistService struct {
	repo WishlistRepository
	db   *gorm.DB
}

func NewWishlistService(repo WishlistRepository, db *gorm.DB) *wishlistService {
	return &wishlistService{repo: repo, db: db}
}

func (s *wishlistService) GetWishlist(ctx context.Context, customerID uuid.UUID) ([]dto.WishlistItemResponse, error) {
	items, err := s.repo.FindByCustomerID(ctx, customerID)
	if err != nil {
		return nil, err
	}

	res := make([]dto.WishlistItemResponse, 0, len(items))
	for _, item := range items {
		imgURL := ""
		if len(item.Variant.Product.Images) > 0 {
			imgURL = item.Variant.Product.Images[0].ImageURL
		}

		res = append(res, dto.WishlistItemResponse{
			ID:              item.ID,
			VariantID:       item.VariantID,
			ProductID:       item.Variant.ProductID,
			ProductName:     item.Variant.Product.Name,
			ProductSlug:     item.Variant.Product.Slug,
			VariantSize:     item.Variant.Size,
			VariantColor:    item.Variant.Color,
			ImageURL:        imgURL,
			Price:           item.Variant.Product.Price,
			AdditionalPrice: item.Variant.AdditionalPrice,
			Stock:           item.Variant.Stock,
			CreatedAt:       item.CreatedAt,
		})
	}

	return res, nil
}

func (s *wishlistService) CheckWishlist(ctx context.Context, customerID uuid.UUID, variantID uuid.UUID) (bool, error) {
	return s.repo.Exists(ctx, customerID, variantID)
}

func (s *wishlistService) AddToWishlist(ctx context.Context, customerID uuid.UUID, variantID uuid.UUID) error {
	exists, err := s.repo.Exists(ctx, customerID, variantID)
	if err != nil {
		return err
	}
	if exists {
		return ErrWishlistItemExists
	}

	item := &model.WishlistItem{
		CustomerID: customerID,
		VariantID:  variantID,
	}
	return s.repo.Add(ctx, item)
}

func (s *wishlistService) RemoveFromWishlist(ctx context.Context, customerID uuid.UUID, variantID uuid.UUID) error {
	return s.repo.Remove(ctx, customerID, variantID)
}
