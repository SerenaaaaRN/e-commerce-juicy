package model

import (
	"time"

	"github.com/google/uuid"
)

type Customer struct {
	ID           uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	FullName     string    `gorm:"type:varchar(255);not null" json:"full_name"`
	Email        string    `gorm:"type:varchar(255);uniqueIndex;not null" json:"email"`
	PasswordHash string    `gorm:"type:text;not null" json:"-"`
	Phone        *string   `gorm:"type:varchar(30)" json:"phone"`
	IsActive     bool      `gorm:"not null;default:true" json:"is_active"`
	CreatedAt    time.Time `gorm:"not null;default:now()" json:"created_at"`
	UpdatedAt    time.Time `gorm:"not null;default:now()" json:"updated_at"`

	Addresses []Address `gorm:"foreignKey:CustomerID" json:"addresses,omitempty"`
}

func (Customer) TableName() string {
	return "customers"
}

type CustomerStats struct {
	CustomerID uuid.UUID
	OrderCount int
	TotalSpent float64
}
