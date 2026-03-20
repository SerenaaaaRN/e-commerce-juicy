package config

import (
	"fmt"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	AppPort string
	AppEnv  string

	DBHost      string
	DBPort      string
	DBName      string
	DBUser      string
	DBPassword  string
	DBSSLMode   string
	DatabaseURL string

	JWTAdminSecret              string
	JWTAdminAccessExpiryMinutes int
	JWTAdminRefreshExpiryDays   int
	JWTCustomerSecret           string
	JWTCustomerExpiryDays       int

	CloudinaryCloudName    string
	CloudinaryAPIKey       string
	CloudinaryAPISecret    string
	CloudinaryUploadFolder string

	ResendAPIKey    string
	ResendFromEmail string
	AdminAlertEmail string
	AllowedOrigins  string
}

func Load() (*Config, error) {
	_ = godotenv.Load()

	cfg := &Config{
		AppPort:                getEnv("APP_PORT", "8080"),
		AppEnv:                 getEnv("APP_ENV", "development"),
		DBHost:                 getEnv("DB_HOST", "localhost"),
		DBPort:                 getEnv("DB_PORT", "5432"),
		DBName:                 getEnv("DB_NAME", "juicy"),
		DBUser:                 getEnv("DB_USER", "postgres"),
		DBPassword:             getEnv("DB_PASSWORD", "postgres"),
		DBSSLMode:              getEnv("DB_SSLMODE", "disable"),
		DatabaseURL:            os.Getenv("DATABASE_URL"),
		JWTAdminSecret:         getEnv("JWT_ADMIN_SECRET", ""),
		JWTCustomerSecret:      getEnv("JWT_CUSTOMER_SECRET", ""),
		CloudinaryCloudName:    os.Getenv("CLOUDINARY_CLOUD_NAME"),
		CloudinaryAPIKey:       os.Getenv("CLOUDINARY_API_KEY"),
		CloudinaryAPISecret:    os.Getenv("CLOUDINARY_API_SECRET"),
		CloudinaryUploadFolder: getEnv("CLOUDINARY_UPLOAD_FOLDER", "juicy"),
		ResendAPIKey:           os.Getenv("RESEND_API_KEY"),
		ResendFromEmail:        getEnv("RESEND_FROM_EMAIL", "noreply@juicy.com"),
		AdminAlertEmail:        getEnv("ADMIN_ALERT_EMAIL", "admin@juicy.com"),
		AllowedOrigins:         getEnv("ALLOWED_ORIGINS", "http://localhost:5173"),
	}

	cfg.JWTAdminAccessExpiryMinutes = getEnvInt("JWT_ADMIN_ACCESS_EXPIRY_MINUTES", 15)
	cfg.JWTAdminRefreshExpiryDays = getEnvInt("JWT_ADMIN_REFRESH_EXPIRY_DAYS", 7)
	cfg.JWTCustomerExpiryDays = getEnvInt("JWT_CUSTOMER_EXPIRY_DAYS", 7)

	if cfg.JWTAdminSecret == "" {
		return nil, fmt.Errorf("JWT_ADMIN_SECRET is required")
	}
	if cfg.JWTCustomerSecret == "" {
		return nil, fmt.Errorf("JWT_CUSTOMER_SECRET is required")
	}

	return cfg, nil
}

func (c *Config) DSN() string {
	if c.DatabaseURL != "" {
		return c.DatabaseURL
	}
	return fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		c.DBHost, c.DBPort, c.DBUser, c.DBPassword, c.DBName, c.DBSSLMode,
	)
}

func (c *Config) IsDevelopment() bool {
	return c.AppEnv == "development"
}

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}

func getEnvInt(key string, fallback int) int {
	val := os.Getenv(key)
	if val == "" {
		return fallback
	}
	n, err := strconv.Atoi(val)
	if err != nil {
		return fallback
	}
	return n
}
