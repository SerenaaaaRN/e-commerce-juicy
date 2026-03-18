package model

import (
	"time"

	"github.com/google/uuid"
)

type Review struct {
	ID          uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	ProductID   uuid.UUID `gorm:"type:uuid;not null;index" json:"product_id"`
	CustomerID  uuid.UUID `gorm:"type:uuid;not null;index" json:"customer_id"`
	OrderID     uuid.UUID `gorm:"type:uuid;not null" json:"order_id"`
	Rating      int       `gorm:"type:smallint;not null" json:"rating"`
	Body        *string   `gorm:"type:text" json:"body"`
	IsPublished bool      `gorm:"not null;default:true" json:"is_published"`
	CreatedAt   time.Time `gorm:"not null;default:now()" json:"created_at"`
	UpdatedAt   time.Time `gorm:"not null;default:now()" json:"updated_at"`

	Product  Product  `gorm:"foreignKey:ProductID" json:"product,omitempty"`
	Customer Customer `gorm:"foreignKey:CustomerID" json:"customer,omitempty"`
	Order    Order    `gorm:"foreignKey:OrderID" json:"order,omitempty"`
}

func (Review) TableName() string {
	return "reviews"
}
