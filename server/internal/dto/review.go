package dto

import (
	"time"

	"github.com/google/uuid"
)

type CreateReviewRequest struct {
	ProductID uuid.UUID `json:"product_id" binding:"required"`
	OrderID   uuid.UUID `json:"order_id" binding:"required"`
	Rating    int       `json:"rating" binding:"required,min=1,max=5"`
	Body      *string   `json:"body" binding:"omitempty"`
}

type ReviewResponse struct {
	ID        uuid.UUID `json:"id"`
	Rating    int       `json:"rating"`
	Body      *string   `json:"body"`
	CreatedAt time.Time `json:"created_at"`
}

type ReviewPublishRequest struct {
	IsPublished bool `json:"is_published"`
}

type AdminReviewResponse struct {
	ID            uuid.UUID `json:"id"`
	ProductID     uuid.UUID `json:"product_id"`
	ProductName   string    `json:"product_name"`
	CustomerID    uuid.UUID `json:"customer_id"`
	CustomerName  string    `json:"customer_name"`
	CustomerEmail string    `json:"customer_email"`
	Rating        int       `json:"rating"`
	Body          *string   `json:"body"`
	IsPublished   bool      `json:"is_published"`
	CreatedAt     time.Time `json:"created_at"`
}
