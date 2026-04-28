package model

import (
	"time"

	"github.com/google/uuid"
)

type WishlistItem struct {
	ID         uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	CustomerID uuid.UUID `gorm:"type:uuid;not null;uniqueIndex:idx_wishlist_customer_variant" json:"customer_id"`
	VariantID  uuid.UUID `gorm:"type:uuid;not null;uniqueIndex:idx_wishlist_customer_variant" json:"variant_id"`
	CreatedAt  time.Time `gorm:"not null;default:now()" json:"created_at"`

	Variant ProductVariant `gorm:"foreignKey:VariantID" json:"variant,omitempty"`
}

func (WishlistItem) TableName() string {
	return "wishlist_items"
}
