package dto

import (
	"time"

	"github.com/google/uuid"
)

type CheckoutRequest struct {
	AddressID     uuid.UUID `json:"address_id" binding:"required"`
	Notes         *string   `json:"notes" binding:"omitempty"`
	PaymentMethod string    `json:"payment_method" binding:"required"`
}

type OrderCheckoutResponse struct {
	ID          uuid.UUID `json:"id"`
	OrderNumber string    `json:"order_number"`
	Status      string    `json:"status"`
	Total       float64   `json:"total"`
}

type OrderResponse struct {
	ID          uuid.UUID `json:"id"`
	OrderNumber string    `json:"order_number"`
	Status      string    `json:"status"`
	Total       float64   `json:"total"`
	ItemCount   int       `json:"item_count"`
	CreatedAt   time.Time `json:"created_at"`
}

type OrderItemResponse struct {
	ProductID    *uuid.UUID `json:"product_id,omitempty"`
	ProductName  string     `json:"product_name"`
	VariantSize  string     `json:"variant_size"`
	VariantColor string     `json:"variant_color"`
	ImageURL     *string    `json:"image_url"`
	Quantity     int        `json:"quantity"`
	UnitPrice    float64    `json:"unit_price"`
}

type OrderDetailResponse struct {
	ID            uuid.UUID           `json:"id"`
	OrderNumber   string              `json:"order_number"`
	Status        string              `json:"status"`
	PaymentStatus string              `json:"payment_status"`
	Subtotal      float64             `json:"subtotal"`
	ShippingFee   float64             `json:"shipping_fee"`
	Total         float64             `json:"total"`
	ShippedAt     *time.Time          `json:"shipped_at"`
	Address       OrderAddressInfo    `json:"address"`
	Items         []OrderItemResponse `json:"items"`
	CreatedAt     time.Time           `json:"created_at"`
}

type OrderAddressInfo struct {
	RecipientName string `json:"recipient_name"`
	Phone         string `json:"phone"`
	AddressLine   string `json:"address_line"`
	City          string `json:"city"`
	Province      string `json:"province"`
	PostalCode    string `json:"postal_code"`
}

type OrderStatusUpdateRequest struct {
	Status string `json:"status" binding:"required"`
}

type OrderPaymentUpdateRequest struct {
	PaymentStatus string `json:"payment_status" binding:"required"`
}

type AdminOrderResponse struct {
	ID            uuid.UUID `json:"id"`
	OrderNumber   string    `json:"order_number"`
	CustomerName  string    `json:"customer_name"`
	CustomerEmail string    `json:"customer_email"`
	Status        string    `json:"status"`
	PaymentStatus string    `json:"payment_status"`
	Total         float64   `json:"total"`
	ItemCount     int       `json:"item_count"`
	CreatedAt     time.Time `json:"created_at"`
}
