package model

import (
	"time"

	"github.com/google/uuid"
)

type CartItem struct {
	ID         uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	CustomerID uuid.UUID `gorm:"type:uuid;not null;index" json:"customer_id"`
	VariantID  uuid.UUID `gorm:"type:uuid;not null" json:"variant_id"`
	Quantity   int       `gorm:"not null;default:1" json:"quantity"`
	CreatedAt  time.Time `gorm:"not null;default:now()" json:"created_at"`
	UpdatedAt  time.Time `gorm:"not null;default:now()" json:"updated_at"`

	Variant ProductVariant `gorm:"foreignKey:VariantID" json:"variant,omitempty"`
}

func (CartItem) TableName() string {
	return "cart_items"
}
