package service

import (
	"context"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"github.com/SerenaaaaRN/juicy/internal/config"
	"github.com/SerenaaaaRN/juicy/internal/dto"
	"github.com/SerenaaaaRN/juicy/internal/model"
)

var (
	ErrEmailTaken    = errors.New("EMAIL_TAKEN")
	ErrWrongPassword = errors.New("WRONG_PASSWORD")
	ErrInactiveUser  = errors.New("USER_INACTIVE")
)

type customerService struct {
	repo   CustomerRepository
	config *config.Config
}

type CustomerClaims struct {
	CustomerID string `json:"customer_id"`
	jwt.RegisteredClaims
}

func NewCustomerService(repo CustomerRepository, cfg *config.Config) *customerService {
	return &customerService{
		repo:   repo,
		config: cfg,
	}
}

func (s *customerService) Register(ctx context.Context, req dto.CustomerRegisterRequest) (*dto.CustomerLoginResponse, error) {
	// Check if email already registered
	existing, err := s.repo.FindByEmail(ctx, req.Email)
	if err == nil && existing != nil {
		return nil, ErrEmailTaken
	}

	// Hash password
	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	customer := &model.Customer{
		FullName:     req.FullName,
		Email:        req.Email,
		PasswordHash: string(hashedBytes),
		Phone:        req.Phone,
		IsActive:     true,
	}

	err = s.repo.Create(ctx, customer)
	if err != nil {
		if stringsContains(err.Error(), "unique") || stringsContains(err.Error(), "duplicate") {
			return nil, ErrEmailTaken
		}
		return nil, err
	}

	// Generate customer token (7 days)
	token, err := s.generateToken(customer.ID.String(), time.Duration(s.config.JWTCustomerExpiryDays)*24*time.Hour)
	if err != nil {
		return nil, err
	}

	return &dto.CustomerLoginResponse{
		Token: token,
		Customer: dto.CustomerResponse{
			ID:       customer.ID.String(),
			FullName: customer.FullName,
			Email:    customer.Email,
		},
	}, nil
}

func (s *customerService) Login(ctx context.Context, req dto.CustomerLoginRequest) (*dto.CustomerLoginResponse, error) {
	customer, err := s.repo.FindByEmail(ctx, req.Email)
	if err != nil {
		return nil, ErrInvalidCredentials
	}

	if !customer.IsActive {
		return nil, ErrInactiveUser
	}

	// Compare password
	err = bcrypt.CompareHashAndPassword([]byte(customer.PasswordHash), []byte(req.Password))
	if err != nil {
		return nil, ErrInvalidCredentials
	}

	// Generate token
	token, err := s.generateToken(customer.ID.String(), time.Duration(s.config.JWTCustomerExpiryDays)*24*time.Hour)
	if err != nil {
		return nil, err
	}

	return &dto.CustomerLoginResponse{
		Token: token,
		Customer: dto.CustomerResponse{
			ID:       customer.ID.String(),
			FullName: customer.FullName,
			Email:    customer.Email,
		},
	}, nil
}

func (s *customerService) GetProfile(ctx context.Context, id uuid.UUID) (*dto.CustomerProfileResponse, error) {
	customer, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}

	return &dto.CustomerProfileResponse{
		ID:        customer.ID.String(),
		FullName:  customer.FullName,
		Email:     customer.Email,
		Phone:     customer.Phone,
		CreatedAt: customer.CreatedAt,
	}, nil
}

func (s *customerService) UpdateProfile(ctx context.Context, id uuid.UUID, req dto.UpdateProfileRequest) (*dto.CustomerProfileResponse, error) {
	customer, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}

	customer.FullName = req.FullName
	customer.Phone = req.Phone
	customer.UpdatedAt = time.Now()

	err = s.repo.Update(ctx, customer)
	if err != nil {
		return nil, err
	}

	return &dto.CustomerProfileResponse{
		ID:        customer.ID.String(),
		FullName:  customer.FullName,
		Email:     customer.Email,
		Phone:     customer.Phone,
		CreatedAt: customer.CreatedAt,
	}, nil
}

func (s *customerService) ChangePassword(ctx context.Context, id uuid.UUID, req dto.ChangePasswordRequest) error {
	customer, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return err
	}

	// Verify current password
	err = bcrypt.CompareHashAndPassword([]byte(customer.PasswordHash), []byte(req.CurrentPassword))
	if err != nil {
		return ErrWrongPassword
	}

	// Hash new password
	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	customer.PasswordHash = string(hashedBytes)
	customer.UpdatedAt = time.Now()

	return s.repo.Update(ctx, customer)
}

func (s *customerService) ListCustomers(ctx context.Context, page, perPage int, search string) ([]dto.CustomerProfileResponse, int64, error) {
	customers, total, err := s.repo.FindAll(ctx, page, perPage, search)
	if err != nil {
		return nil, 0, err
	}

	res := make([]dto.CustomerProfileResponse, len(customers))
	for i, c := range customers {
		res[i] = dto.CustomerProfileResponse{
			ID:        c.ID.String(),
			FullName:  c.FullName,
			Email:     c.Email,
			Phone:     c.Phone,
			CreatedAt: c.CreatedAt,
		}
	}

	return res, total, nil
}

func (s *customerService) UpdateCustomerStatus(ctx context.Context, id uuid.UUID, isActive bool) error {
	return s.repo.UpdateStatus(ctx, id, isActive)
}

func (s *customerService) GetCustomerDetail(ctx context.Context, id uuid.UUID) (*dto.CustomerProfileResponse, error) {
	return s.GetProfile(ctx, id)
}

func (s *customerService) generateToken(customerID string, expiry time.Duration) (string, error) {
	claims := &CustomerClaims{
		CustomerID: customerID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(expiry)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.config.JWTCustomerSecret))
}

func stringsContains(s, substr string) bool {
	return len(s) >= len(substr) && (s == substr || (len(substr) > 0 && (s[0:len(substr)] == substr || stringsContains(s[1:], substr))))
}
