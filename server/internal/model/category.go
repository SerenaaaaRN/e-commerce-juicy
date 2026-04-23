package model

import (
	"time"

	"github.com/google/uuid"
)

type Category struct {
	ID           uuid.UUID  `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Name         string     `gorm:"type:varchar(100);not null" json:"name"`
	Slug         string     `gorm:"type:varchar(100);uniqueIndex;not null" json:"slug"`
	Description  *string    `gorm:"type:text" json:"description"`
	DisplayOrder int        `gorm:"not null;default:0" json:"display_order"`
	IsActive     bool       `gorm:"not null;default:true" json:"is_active"`
	ParentID     *uuid.UUID `gorm:"type:uuid" json:"parent_id"`
	Children     []Category `gorm:"foreignKey:ParentID" json:"children,omitempty"`
	CreatedAt    time.Time  `gorm:"not null;default:now()" json:"created_at"`
	UpdatedAt    time.Time  `gorm:"not null;default:now()" json:"updated_at"`
}

func (Category) TableName() string {
	return "categories"
}
