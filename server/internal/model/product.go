package model

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
)

type JSONStringArray []string

func (j *JSONStringArray) Scan(value interface{}) error {
	if value == nil {
		*j = JSONStringArray{}
		return nil
	}
	bytes, ok := value.([]byte)
	if !ok {
		return fmt.Errorf("failed to scan JSONStringArray: expected []byte, got %T", value)
	}
	return json.Unmarshal(bytes, j)
}

func (j JSONStringArray) Value() (driver.Value, error) {
	if j == nil {
		return "[]", nil
	}
	bytes, err := json.Marshal(j)
	if err != nil {
		return nil, err
	}
	return string(bytes), nil
}

type Product struct {
	ID             uuid.UUID       `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	CategoryID     uuid.UUID       `gorm:"type:uuid;not null;index" json:"category_id"`
	Name           string          `gorm:"type:varchar(255);not null" json:"name"`
	Slug           string          `gorm:"type:varchar(255);uniqueIndex;not null" json:"slug"`
	Description    *string         `gorm:"type:text" json:"description"`
	Price          float64         `gorm:"type:numeric(12,2);not null" json:"price"`
	CompareAtPrice *float64        `gorm:"type:numeric(12,2)" json:"compare_at_price"`
	IsAvailable    bool            `gorm:"not null;default:true" json:"is_available"`
	IsFeatured     bool            `gorm:"not null;default:false" json:"is_featured"`
	Tags           JSONStringArray `gorm:"type:jsonb;not null;default:'[]'" json:"tags"`
	DisplayOrder   int             `gorm:"not null;default:0" json:"display_order"`
	CreatedAt      time.Time       `gorm:"not null;default:now()" json:"created_at"`
	UpdatedAt      time.Time       `gorm:"not null;default:now()" json:"updated_at"`

	Category Category         `gorm:"foreignKey:CategoryID" json:"category,omitempty"`
	Images   []ProductImage   `gorm:"foreignKey:ProductID" json:"images,omitempty"`
	Variants []ProductVariant `gorm:"foreignKey:ProductID" json:"variants,omitempty"`
}

func (Product) TableName() string {
	return "products"
}

type ProductImage struct {
	ID                 uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	ProductID          uuid.UUID `gorm:"type:uuid;not null;index" json:"product_id"`
	ImageURL           string    `gorm:"type:text;not null" json:"image_url"`
	CloudinaryPublicID *string   `gorm:"type:text" json:"cloudinary_public_id"`
	AltText            *string   `gorm:"type:varchar(255)" json:"alt_text"`
	DisplayOrder       int       `gorm:"not null;default:0" json:"display_order"`
	IsPrimary          bool      `gorm:"not null;default:false" json:"is_primary"`
	CreatedAt          time.Time `gorm:"not null;default:now()" json:"created_at"`
}

func (ProductImage) TableName() string {
	return "product_images"
}

type ProductVariant struct {
	ID              uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	ProductID       uuid.UUID `gorm:"type:uuid;not null;index" json:"product_id"`
	Size            string    `gorm:"type:varchar(20);not null" json:"size"`
	Color           string    `gorm:"type:varchar(50);not null" json:"color"`
	ColorHex        *string   `gorm:"type:varchar(7)" json:"color_hex"`
	SKU             string    `gorm:"type:varchar(100);uniqueIndex;not null" json:"sku"`
	Stock           int       `gorm:"not null;default:0" json:"stock"`
	AdditionalPrice float64   `gorm:"type:numeric(12,2);not null;default:0" json:"additional_price"`
	IsActive        bool      `gorm:"not null;default:true" json:"is_active"`
	CreatedAt       time.Time `gorm:"not null;default:now()" json:"created_at"`
	UpdatedAt       time.Time `gorm:"not null;default:now()" json:"updated_at"`

	Product *Product `gorm:"foreignKey:ProductID" json:"product,omitempty"`
}

func (ProductVariant) TableName() string {
	return "product_variants"
}
