package service

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/SerenaaaaRN/juicy/internal/dto"
	"github.com/SerenaaaaRN/juicy/internal/model"
)

var (
	ErrAddressNotFound = errors.New("ADDRESS_NOT_FOUND")
)

type addressService struct {
	repo AddressRepository
}

func NewAddressService(repo AddressRepository) *addressService {
	return &addressService{repo: repo}
}

func (s *addressService) GetAddresses(ctx context.Context, customerID uuid.UUID) ([]model.Address, error) {
	return s.repo.FindByCustomerID(ctx, customerID)
}

func (s *addressService) GetAddressByID(ctx context.Context, id uuid.UUID, customerID uuid.UUID) (*model.Address, error) {
	addr, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, ErrAddressNotFound
	}
	if addr.CustomerID != customerID {
		return nil, ErrAddressNotFound
	}
	return addr, nil
}

func (s *addressService) CreateAddress(ctx context.Context, customerID uuid.UUID, req dto.AddressRequest) (*model.Address, error) {
	address := &model.Address{
		CustomerID:    customerID,
		Label:         req.Label,
		RecipientName: req.RecipientName,
		Phone:         req.Phone,
		AddressLine:   req.AddressLine,
		City:          req.City,
		Province:      req.Province,
		PostalCode:    req.PostalCode,
		IsDefault:     req.IsDefault,
	}

	err := s.repo.Create(ctx, address)
	if err != nil {
		return nil, err
	}
	return address, nil
}

func (s *addressService) UpdateAddress(ctx context.Context, id uuid.UUID, customerID uuid.UUID, req dto.AddressRequest) (*model.Address, error) {
	addr, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, ErrAddressNotFound
	}
	if addr.CustomerID != customerID {
		return nil, ErrAddressNotFound
	}

	addr.Label = req.Label
	addr.RecipientName = req.RecipientName
	addr.Phone = req.Phone
	addr.AddressLine = req.AddressLine
	addr.City = req.City
	addr.Province = req.Province
	addr.PostalCode = req.PostalCode
	addr.IsDefault = req.IsDefault
	addr.UpdatedAt = time.Now()

	err = s.repo.Update(ctx, addr)
	if err != nil {
		return nil, err
	}
	return addr, nil
}

func (s *addressService) DeleteAddress(ctx context.Context, id uuid.UUID, customerID uuid.UUID) error {
	_, err := s.GetAddressByID(ctx, id, customerID)
	if err != nil {
		return err
	}
	return s.repo.Delete(ctx, id, customerID)
}

func (s *addressService) SetDefaultAddress(ctx context.Context, id uuid.UUID, customerID uuid.UUID) error {
	_, err := s.GetAddressByID(ctx, id, customerID)
	if err != nil {
		return err
	}
	return s.repo.SetDefault(ctx, id, customerID)
}
