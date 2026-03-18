package model

import (
	"time"

	"github.com/google/uuid"
)

type Admin struct {
	ID           uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Username     string    `gorm:"type:varchar(50);uniqueIndex;not null" json:"username"`
	Email        string    `gorm:"type:varchar(255);uniqueIndex;not null" json:"email"`
	PasswordHash string    `gorm:"type:text;not null" json:"-"`
	CreatedAt    time.Time `gorm:"not null;default:now()" json:"created_at"`
	UpdatedAt    time.Time `gorm:"not null;default:now()" json:"updated_at"`
}

func (Admin) TableName() string {
	return "admins"
}
