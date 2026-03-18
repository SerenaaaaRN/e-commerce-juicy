package repository

import (
	"context"

	"github.com/google/uuid"
	"gorm.io/gorm"
	"github.com/SerenaaaaRN/juicy/internal/model"
)

type adminRepo struct {
	db *gorm.DB
}

func NewAdminRepository(db *gorm.DB) *adminRepo {
	return &adminRepo{db: db}
}

func (r *adminRepo) FindByEmail(ctx context.Context, email string) (*model.Admin, error) {
	var admin model.Admin
	err := r.db.WithContext(ctx).Where("email = ?", email).First(&admin).Error
	if err != nil {
		return nil, err
	}
	return &admin, nil
}

func (r *adminRepo) FindByID(ctx context.Context, id uuid.UUID) (*model.Admin, error) {
	var admin model.Admin
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&admin).Error
	if err != nil {
		return nil, err
	}
	return &admin, nil
}
