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
)

var (
	ErrInvalidCredentials = errors.New("INVALID_CREDENTIALS")
	ErrUnauthorized       = errors.New("UNAUTHORIZED")
)

type adminService struct {
	repo   AdminRepository
	config *config.Config
}

type AdminClaims struct {
	AdminID string `json:"admin_id"`
	jwt.RegisteredClaims
}

func NewAdminService(repo AdminRepository, cfg *config.Config) *adminService {
	return &adminService{
		repo:   repo,
		config: cfg,
	}
}

func (s *adminService) Login(ctx context.Context, req dto.AdminLoginRequest) (*dto.AdminLoginResponse, string, error) {
	admin, err := s.repo.FindByEmail(ctx, req.Email)
	if err != nil {
		return nil, "", ErrInvalidCredentials
	}

	// Compare password hash
	err = bcrypt.CompareHashAndPassword([]byte(admin.PasswordHash), []byte(req.Password))
	if err != nil {
		return nil, "", ErrInvalidCredentials
	}

	// Generate access token (15 mins)
	accessToken, err := s.generateToken(admin.ID.String(), time.Duration(s.config.JWTAdminAccessExpiryMinutes)*time.Minute)
	if err != nil {
		return nil, "", err
	}

	// Generate refresh token (7 days)
	refreshToken, err := s.generateToken(admin.ID.String(), time.Duration(s.config.JWTAdminRefreshExpiryDays)*24*time.Hour)
	if err != nil {
		return nil, "", err
	}

	return &dto.AdminLoginResponse{
		Token: accessToken,
		Admin: dto.AdminResponse{
			ID:       admin.ID.String(),
			Username: admin.Username,
			Email:    admin.Email,
		},
	}, refreshToken, nil
}

func (s *adminService) Refresh(ctx context.Context, refreshToken string) (*dto.AdminLoginResponse, string, error) {
	// Parse refresh token
	token, err := jwt.ParseWithClaims(refreshToken, &AdminClaims{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(s.config.JWTAdminSecret), nil
	})
	if err != nil || !token.Valid {
		return nil, "", ErrUnauthorized
	}

	claims, ok := token.Claims.(*AdminClaims)
	if !ok {
		return nil, "", ErrUnauthorized
	}

	adminUUID, err := uuid.Parse(claims.AdminID)
	if err != nil {
		return nil, "", ErrUnauthorized
	}

	admin, err := s.repo.FindByID(ctx, adminUUID)
	if err != nil {
		return nil, "", ErrUnauthorized
	}

	// Generate new access token
	newAccessToken, err := s.generateToken(admin.ID.String(), time.Duration(s.config.JWTAdminAccessExpiryMinutes)*time.Minute)
	if err != nil {
		return nil, "", err
	}

	// Generate new refresh token
	newRefreshToken, err := s.generateToken(admin.ID.String(), time.Duration(s.config.JWTAdminRefreshExpiryDays)*24*time.Hour)
	if err != nil {
		return nil, "", err
	}

	return &dto.AdminLoginResponse{
		Token: newAccessToken,
		Admin: dto.AdminResponse{
			ID:       admin.ID.String(),
			Username: admin.Username,
			Email:    admin.Email,
		},
	}, newRefreshToken, nil
}

func (s *adminService) GetAdminByID(ctx context.Context, id uuid.UUID) (*dto.AdminResponse, error) {
	admin, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}

	return &dto.AdminResponse{
		ID:       admin.ID.String(),
		Username: admin.Username,
		Email:    admin.Email,
	}, nil
}

func (s *adminService) generateToken(adminID string, expiry time.Duration) (string, error) {
	claims := &AdminClaims{
		AdminID: adminID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(expiry)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.config.JWTAdminSecret))
}
