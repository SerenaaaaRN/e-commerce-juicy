package dto

import "time"

type CustomerRegisterRequest struct {
	FullName string  `json:"full_name" binding:"required,min=2,max=100"`
	Email    string  `json:"email" binding:"required,email"`
	Password string  `json:"password" binding:"required,min=8"`
	Phone    *string `json:"phone" binding:"omitempty"`
}

type CustomerLoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type CustomerResponse struct {
	ID       string `json:"id"`
	FullName string `json:"full_name"`
	Email    string `json:"email"`
}

type CustomerLoginResponse struct {
	Token    string           `json:"token"`
	Customer CustomerResponse `json:"customer"`
}

type CustomerProfileResponse struct {
	ID           string               `json:"id"`
	FullName     string               `json:"full_name"`
	Email        string               `json:"email"`
	Phone        *string              `json:"phone"`
	IsActive     bool                 `json:"is_active"`
	OrderCount   int                  `json:"order_count"`
	TotalSpent   float64              `json:"total_spent"`
	CreatedAt    time.Time            `json:"created_at"`
	OrderHistory []AdminOrderResponse `json:"order_history,omitempty"`
}

type UpdateProfileRequest struct {
	FullName string  `json:"full_name" binding:"required,min=2,max=100"`
	Phone    *string `json:"phone" binding:"omitempty"`
}

type ChangePasswordRequest struct {
	CurrentPassword string `json:"current_password" binding:"required"`
	NewPassword     string `json:"new_password" binding:"required,min=8"`
}

type AddressRequest struct {
	Label         *string `json:"label" binding:"omitempty"`
	RecipientName string  `json:"recipient_name" binding:"required"`
	Phone         string  `json:"phone" binding:"required"`
	AddressLine   string  `json:"address_line" binding:"required"`
	City          string  `json:"city" binding:"required"`
	Province      string  `json:"province" binding:"required"`
	PostalCode    string  `json:"postal_code" binding:"required"`
	IsDefault     bool    `json:"is_default"`
}

type UpdateCustomerStatusRequest struct {
	IsActive bool `json:"is_active" binding:"required"`
}
