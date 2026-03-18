package repository

import (
	"context"

	"github.com/google/uuid"
	"gorm.io/gorm"
	"github.com/SerenaaaaRN/juicy/internal/model"
)

type addressRepo struct {
	db *gorm.DB
}

func NewAddressRepository(db *gorm.DB) *addressRepo {
	return &addressRepo{db: db}
}

func (r *addressRepo) FindByID(ctx context.Context, id uuid.UUID) (*model.Address, error) {
	var address model.Address
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&address).Error
	if err != nil {
		return nil, err
	}
	return &address, nil
}

func (r *addressRepo) FindByCustomerID(ctx context.Context, customerID uuid.UUID) ([]model.Address, error) {
	var addresses []model.Address
	err := r.db.WithContext(ctx).Where("customer_id = ?", customerID).Order("is_default desc, created_at desc").Find(&addresses).Error
	if err != nil {
		return nil, err
	}
	return addresses, nil
}

func (r *addressRepo) Create(ctx context.Context, address *model.Address) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if address.IsDefault {
			err := tx.Model(&model.Address{}).Where("customer_id = ?", address.CustomerID).Update("is_default", false).Error
			if err != nil {
				return err
			}
		}
		return tx.Create(address).Error
	})
}

func (r *addressRepo) Update(ctx context.Context, address *model.Address) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if address.IsDefault {
			err := tx.Model(&model.Address{}).Where("customer_id = ? AND id != ?", address.CustomerID, address.ID).Update("is_default", false).Error
			if err != nil {
				return err
			}
		}
		return tx.Save(address).Error
	})
}

func (r *addressRepo) Delete(ctx context.Context, id uuid.UUID, customerID uuid.UUID) error {
	return r.db.WithContext(ctx).Where("id = ? AND customer_id = ?", id, customerID).Delete(&model.Address{}).Error
}

func (r *addressRepo) SetDefault(ctx context.Context, id uuid.UUID, customerID uuid.UUID) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		err := tx.Model(&model.Address{}).Where("customer_id = ?", customerID).Update("is_default", false).Error
		if err != nil {
			return err
		}
		return tx.Model(&model.Address{}).Where("id = ? AND customer_id = ?", id, customerID).Update("is_default", true).Error
	})
}
