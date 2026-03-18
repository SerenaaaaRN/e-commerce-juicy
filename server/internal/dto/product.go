package dto

import (
	"time"

	"github.com/google/uuid"
)

type CategoryRequest struct {
	Name         string  `json:"name" binding:"required"`
	Slug         string  `json:"slug" binding:"required"`
	Description  *string `json:"description" binding:"omitempty"`
	DisplayOrder int     `json:"display_order"`
	IsActive     bool    `json:"is_active"`
}

type ProductVariantRequest struct {
	Size            string  `json:"size" binding:"required"`
	Color           string  `json:"color" binding:"required"`
	ColorHex        *string `json:"color_hex" binding:"omitempty"`
	SKU             string  `json:"sku" binding:"required"`
	Stock           int     `json:"stock"`
	AdditionalPrice float64 `json:"additional_price"`
	IsActive        bool    `json:"is_active"`
}

type ProductResponse struct {
	ID             uuid.UUID `json:"id"`
	Name           string    `json:"name"`
	Slug           string    `json:"slug"`
	Price          float64   `json:"price"`
	CompareAtPrice *float64  `json:"compare_at_price"`
	IsFeatured     bool      `json:"is_featured"`
	Tags           []string  `json:"tags"`
	PrimaryImage   string    `json:"primary_image"`
	CategoryName   string    `json:"category_name"`
	AvgRating      float64   `json:"avg_rating"`
	ReviewCount    int       `json:"review_count"`
}

type ProductDetailResponse struct {
	ID             uuid.UUID               `json:"id"`
	Name           string                  `json:"name"`
	Slug           string                  `json:"slug"`
	Description    *string                 `json:"description"`
	Price          float64                 `json:"price"`
	CompareAtPrice *float64                `json:"compare_at_price"`
	Tags           []string                `json:"tags"`
	Category       CategoryDetailInfo      `json:"category"`
	Images         []ProductImageResponse  `json:"images"`
	Variants       []ProductVariantRes     `json:"variants"`
	AvgRating      float64                 `json:"avg_rating"`
	ReviewCount    int                     `json:"review_count"`
}

type CategoryDetailInfo struct {
	ID   uuid.UUID `json:"id"`
	Name string    `json:"name"`
	Slug string    `json:"slug"`
}

type ProductImageResponse struct {
	ID           uuid.UUID `json:"id"`
	ImageURL     string    `json:"image_url"`
	AltText      *string   `json:"alt_text"`
	IsPrimary    bool      `json:"is_primary"`
	DisplayOrder int       `json:"display_order"`
}

type ProductVariantRes struct {
	ID              uuid.UUID `json:"id"`
	Size            string    `json:"size"`
	Color           string    `json:"color"`
	ColorHex        *string   `json:"color_hex"`
	SKU             string    `json:"sku"`
	Stock           int       `json:"stock"`
	AdditionalPrice float64   `json:"additional_price"`
	IsActive        bool      `json:"is_active"`
}

type ProductReviewResponse struct {
	ID           uuid.UUID `json:"id"`
	Rating       int       `json:"rating"`
	Body         *string   `json:"body"`
	CustomerName string    `json:"customer_name"`
	CreatedAt    time.Time `json:"created_at"`
}
