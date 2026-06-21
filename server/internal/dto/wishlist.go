package dto

import (
	"time"

	"github.com/google/uuid"
)

type WishlistItemResponse struct {
	ID              uuid.UUID `json:"id"`
	VariantID       uuid.UUID `json:"variant_id"`
	ProductID       uuid.UUID `json:"product_id"`
	ProductName     string    `json:"product_name"`
	ProductSlug     string    `json:"product_slug"`
	VariantSize     string    `json:"variant_size"`
	VariantColor    string    `json:"variant_color"`
	ImageURL        string    `json:"image_url"`
	Price           float64   `json:"price"`
	AdditionalPrice float64   `json:"additional_price"`
	Stock           int       `json:"stock"`
	CreatedAt       time.Time `json:"created_at"`
}

type WishlistCheckResponse struct {
	InWishlist bool `json:"in_wishlist"`
}

type AddWishlistItemRequest struct {
	VariantID uuid.UUID `json:"variant_id" binding:"required"`
}
