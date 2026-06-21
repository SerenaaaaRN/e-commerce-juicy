package dto

import (
	"time"

	"github.com/google/uuid"
)

type CategoryRequest struct {
	Name         string     `json:"name" binding:"required"`
	Slug         string     `json:"slug" binding:"required"`
	Description  *string    `json:"description" binding:"omitempty"`
	DisplayOrder int        `json:"display_order"`
	IsActive     *bool      `json:"is_active,omitempty"`
	ParentID     *uuid.UUID `json:"parent_id" binding:"omitempty"`
}

type CategoryTreeResponse struct {
	ID           uuid.UUID              `json:"id"`
	Name         string                 `json:"name"`
	Slug         string                 `json:"slug"`
	Description  *string                `json:"description,omitempty"`
	DisplayOrder int                    `json:"display_order"`
	IsActive     bool                   `json:"is_active"`
	ParentID     *uuid.UUID             `json:"parent_id"`
	ProductCount int64                  `json:"product_count"`
	Children     []CategoryTreeResponse `json:"children,omitempty"`
}

type ProductVariantRequest struct {
	Size            string  `json:"size" binding:"required"`
	Color           string  `json:"color" binding:"omitempty"`
	Stock           int     `json:"stock"`
	AdditionalPrice float64 `json:"additional_price"`
	IsActive        bool    `json:"is_active"`
}

type ProductResponse struct {
	ID             uuid.UUID                `json:"id"`
	CategoryID     uuid.UUID                `json:"category_id"`
	Name           string                   `json:"name"`
	Slug           string                   `json:"slug"`
	Description    *string                  `json:"description"`
	Price          float64                  `json:"price"`
	CompareAtPrice *float64                 `json:"compare_at_price"`
	IsAvailable    bool                     `json:"is_available"`
	IsFeatured     bool                     `json:"is_featured"`
	Tags           []string                 `json:"tags"`
	DisplayOrder   int                      `json:"display_order"`
	PrimaryImage   string                   `json:"primary_image"`
	CategoryName   string                   `json:"category_name"`
	AvgRating      float64                  `json:"avg_rating"`
	ReviewCount    int                      `json:"review_count"`
	Variants       []ProductVariantResponse `json:"variants,omitempty"`
}

type ProductDetailResponse struct {
	ID             uuid.UUID                `json:"id"`
	CategoryID     uuid.UUID                `json:"category_id"`
	Name           string                   `json:"name"`
	Slug           string                   `json:"slug"`
	Description    *string                  `json:"description"`
	Price          float64                  `json:"price"`
	CompareAtPrice *float64                 `json:"compare_at_price"`
	IsAvailable    bool                     `json:"is_available"`
	IsFeatured     bool                     `json:"is_featured"`
	Tags           []string                 `json:"tags"`
	DisplayOrder   int                      `json:"display_order"`
	PrimaryImage   string                   `json:"primary_image"`
	Category       CategoryDetailInfo       `json:"category"`
	CategoryName   string                   `json:"category_name"`
	Images         []ProductImageResponse   `json:"images"`
	Variants       []ProductVariantResponse `json:"variants"`
	AvgRating      float64                  `json:"avg_rating"`
	ReviewCount    int                      `json:"review_count"`
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

type ProductVariantResponse struct {
	ID              uuid.UUID `json:"id"`
	Size            string    `json:"size"`
	Color           string    `json:"color"`
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

type AddProductImageUrlRequest struct {
	ImageURL string `json:"image_url" binding:"required,url"`
}
