package service

import (
	"context"

	"github.com/SerenaaaaRN/juicy/internal/dto"
	"github.com/SerenaaaaRN/juicy/internal/model"
	"github.com/google/uuid"
)



type cartService struct {
	repo        CartRepository
	productRepo ProductRepository
}

func NewCartService(repo CartRepository, productRepo ProductRepository) *cartService {
	return &cartService{
		repo:        repo,
		productRepo: productRepo,
	}
}

func (s *cartService) GetCart(ctx context.Context, customerID uuid.UUID) (*dto.CartResponse, error) {
	items, err := s.repo.FindByCustomerID(ctx, customerID)
	if err != nil {
		return nil, err
	}

	var itemDTOs []dto.CartItemResponse
	var total float64 = 0

	for _, item := range items {

		product, err := s.productRepo.FindByID(ctx, item.Variant.ProductID)
		if err != nil {
			continue
		}

		primaryImg := getPrimaryImageURL(product.Images)

		unitPrice := product.Price + item.Variant.AdditionalPrice
		subtotal := unitPrice * float64(item.Quantity)
		total += subtotal

		imgURL := &primaryImg
		if primaryImg == "" {
			imgURL = nil
		}

		itemDTOs = append(itemDTOs, dto.CartItemResponse{
			ID:           item.ID,
			VariantID:    item.VariantID,
			ProductName:  product.Name,
			VariantSize:  item.Variant.Size,
			VariantColor: item.Variant.Color,
			ImageURL:     imgURL,
			UnitPrice:    unitPrice,
			Quantity:     item.Quantity,
			Subtotal:     subtotal,
		})
	}

	if itemDTOs == nil {
		itemDTOs = []dto.CartItemResponse{}
	}

	return &dto.CartResponse{
		Items: itemDTOs,
		Total: total,
	}, nil
}

func (s *cartService) AddCartItem(ctx context.Context, customerID uuid.UUID, req dto.AddCartItemRequest) error {
	variant, err := s.productRepo.FindVariantByID(ctx, req.VariantID)
	if err != nil {
		return ErrVariantNotFound
	}

	if !variant.IsActive {
		return ErrVariantNotFound
	}

	items, err := s.repo.FindByCustomerID(ctx, customerID)
	if err != nil {
		return err
	}

	currentQty := 0
	for _, item := range items {
		if item.VariantID == req.VariantID {
			currentQty = item.Quantity
			break
		}
	}

	if currentQty+req.Quantity > variant.Stock {
		return ErrInsufficientStock
	}

	cartItem := &model.CartItem{
		CustomerID: customerID,
		VariantID:  req.VariantID,
		Quantity:   req.Quantity,
	}

	return s.repo.UpsertItem(ctx, cartItem)
}

func (s *cartService) UpdateCartItemQuantity(ctx context.Context, id uuid.UUID, customerID uuid.UUID, req dto.UpdateCartItemQuantityRequest) error {
	item, err := s.repo.FindItemByID(ctx, id)
	if err != nil {
		return ErrCartItemNotFound
	}

	if item.CustomerID != customerID {
		return ErrCartUnauthorized
	}

	variant, err := s.productRepo.FindVariantByID(ctx, item.VariantID)
	if err != nil {
		return ErrVariantNotFound
	}

	if req.Quantity > variant.Stock {
		return ErrInsufficientStock
	}

	return s.repo.UpdateItemQuantity(ctx, id, customerID, req.Quantity)
}

func (s *cartService) RemoveCartItem(ctx context.Context, id uuid.UUID, customerID uuid.UUID) error {
	return s.repo.RemoveItem(ctx, id, customerID)
}

func (s *cartService) ClearCart(ctx context.Context, customerID uuid.UUID) error {
	return s.repo.ClearCart(ctx, customerID)
}
