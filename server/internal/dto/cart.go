package dto

import "github.com/google/uuid"

type AddCartItemRequest struct {
	VariantID uuid.UUID `json:"variant_id" binding:"required"`
	Quantity  int       `json:"quantity" binding:"required,min=1"`
}

type UpdateCartItemQuantityRequest struct {
	Quantity int `json:"quantity" binding:"required,min=1"`
}

type CartItemResponse struct {
	ID           uuid.UUID `json:"id"`
	VariantID    uuid.UUID `json:"variant_id"`
	ProductName  string    `json:"product_name"`
	VariantSize  string    `json:"variant_size"`
	VariantColor string    `json:"variant_color"`
	ImageURL     *string   `json:"image_url"`
	UnitPrice    float64   `json:"unit_price"`
	Quantity     int       `json:"quantity"`
	Subtotal     float64   `json:"subtotal"`
}

type CartResponse struct {
	Items []CartItemResponse `json:"items"`
	Total float64            `json:"total"`
}
