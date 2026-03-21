package model

import (
	"time"

	"github.com/google/uuid"
)

type Address struct {
	ID            uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	CustomerID    uuid.UUID `gorm:"type:uuid;not null;index" json:"customer_id"`
	Label         *string   `gorm:"type:varchar(100)" json:"label"`
	RecipientName string    `gorm:"type:varchar(255);not null" json:"recipient_name"`
	Phone         string    `gorm:"type:varchar(30);not null" json:"phone"`
	AddressLine   string    `gorm:"type:text;not null" json:"address_line"`
	City          string    `gorm:"type:varchar(100);not null" json:"city"`
	Province      string    `gorm:"type:varchar(100);not null" json:"province"`
	PostalCode    string    `gorm:"type:varchar(20);not null" json:"postal_code"`
	IsDefault     bool      `gorm:"not null;default:false" json:"is_default"`
	CreatedAt     time.Time `gorm:"not null;default:now()" json:"created_at"`
	UpdatedAt     time.Time `gorm:"not null;default:now()" json:"updated_at"`
}

func (Address) TableName() string {
	return "addresses"
}
