package model

import (
	"time"

	"github.com/google/uuid"
)

type Order struct {
	ID            uuid.UUID  `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	CustomerID    uuid.UUID  `gorm:"type:uuid;not null;index" json:"customer_id"`
	AddressID     *uuid.UUID `gorm:"type:uuid" json:"address_id"`
	OrderNumber   string     `gorm:"type:varchar(20);uniqueIndex;not null" json:"order_number"`
	Status        string     `gorm:"type:order_status;not null;default:'pending'" json:"status"`
	Subtotal      float64    `gorm:"type:numeric(12,2);not null" json:"subtotal"`
	ShippingFee   float64    `gorm:"type:numeric(12,2);not null;default:0" json:"shipping_fee"`
	Total         float64    `gorm:"type:numeric(12,2);not null" json:"total"`
	PaymentStatus string     `gorm:"type:payment_status;not null;default:'unpaid'" json:"payment_status"`
	PaymentMethod *string    `gorm:"type:varchar(100)" json:"payment_method"`
	Notes         *string    `gorm:"type:text" json:"notes"`
	ShippedAt     *time.Time `gorm:"type:timestamptz" json:"shipped_at"`
	DeliveredAt   *time.Time `gorm:"type:timestamptz" json:"delivered_at"`
	CreatedAt     time.Time  `gorm:"not null;default:now()" json:"created_at"`
	UpdatedAt     time.Time  `gorm:"not null;default:now()" json:"updated_at"`

	Customer Customer    `gorm:"foreignKey:CustomerID" json:"customer,omitempty"`
	Address  *Address    `gorm:"foreignKey:AddressID" json:"address,omitempty"`
	Items    []OrderItem `gorm:"foreignKey:OrderID" json:"items,omitempty"`
}

func (Order) TableName() string {
	return "orders"
}

type OrderItem struct {
	ID           uuid.UUID  `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	OrderID      uuid.UUID  `gorm:"type:uuid;not null;index" json:"order_id"`
	VariantID    *uuid.UUID `gorm:"type:uuid" json:"variant_id"`
	ProductName  string     `gorm:"type:varchar(255);not null" json:"product_name"`
	VariantSize  string     `gorm:"type:varchar(20);not null" json:"variant_size"`
	VariantColor string     `gorm:"type:varchar(50);not null" json:"variant_color"`
	ImageURL     *string    `gorm:"type:text" json:"image_url"`
	Quantity     int        `gorm:"not null" json:"quantity"`
	UnitPrice    float64    `gorm:"type:numeric(12,2);not null" json:"unit_price"`
	CreatedAt    time.Time  `gorm:"not null;default:now()" json:"created_at"`
}

func (OrderItem) TableName() string {
	return "order_items"
}
