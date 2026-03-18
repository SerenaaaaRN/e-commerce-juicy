package repository

import (
	"context"
	"strings"

	"github.com/google/uuid"
	"gorm.io/gorm"
	"github.com/SerenaaaaRN/juicy/internal/model"
)

type customerRepo struct {
	db *gorm.DB
}

func NewCustomerRepository(db *gorm.DB) *customerRepo {
	return &customerRepo{db: db}
}

func (r *customerRepo) FindByEmail(ctx context.Context, email string) (*model.Customer, error) {
	var customer model.Customer
	err := r.db.WithContext(ctx).Where("email = ?", email).First(&customer).Error
	if err != nil {
		return nil, err
	}
	return &customer, nil
}

func (r *customerRepo) FindByID(ctx context.Context, id uuid.UUID) (*model.Customer, error) {
	var customer model.Customer
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&customer).Error
	if err != nil {
		return nil, err
	}
	return &customer, nil
}

func (r *customerRepo) Create(ctx context.Context, customer *model.Customer) error {
	return r.db.WithContext(ctx).Create(customer).Error
}

func (r *customerRepo) Update(ctx context.Context, customer *model.Customer) error {
	return r.db.WithContext(ctx).Save(customer).Error
}

func (r *customerRepo) FindAll(ctx context.Context, page, perPage int, search string) ([]model.Customer, int64, error) {
	var customers []model.Customer
	var total int64

	query := r.db.WithContext(ctx).Model(&model.Customer{})
	if search != "" {
		s := "%" + strings.ToLower(search) + "%"
		query = query.Where("LOWER(full_name) LIKE ? OR LOWER(email) LIKE ?", s, s)
	}

	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * perPage
	err = query.Offset(offset).Limit(perPage).Order("created_at desc").Find(&customers).Error
	if err != nil {
		return nil, 0, err
	}

	return customers, total, nil
}

func (r *customerRepo) UpdateStatus(ctx context.Context, id uuid.UUID, isActive bool) error {
	return r.db.WithContext(ctx).Model(&model.Customer{}).Where("id = ?", id).Update("is_active", isActive).Error
}
