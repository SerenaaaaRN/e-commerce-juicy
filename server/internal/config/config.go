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

	ResendAPIKey       string
	ResendFromEmail    string
	AdminAlertEmail    string
	AllowedOrigins            string
	DefaultShippingFee        float64
	BackgroundWorkerPoolSize  int
	BackgroundWorkerQueueSize int
}

func Load() (*Config, error) {
	_ = godotenv.Load()

	cfg := &Config{
		AppPort:                     getEnv("APP_PORT", getEnv("PORT", "8080")),
		AppEnv:                      getEnv("APP_ENV", "development"),
		DBHost:                      os.Getenv("DB_HOST"),
		DBPort:                      getEnv("DB_PORT", "5432"),
		DBName:                      os.Getenv("DB_NAME"),
		DBUser:                      os.Getenv("DB_USER"),
		DBPassword:                  os.Getenv("DB_PASSWORD"),
		DBSSLMode:                   getEnv("DB_SSLMODE", "disable"),
		DatabaseURL:                 os.Getenv("DATABASE_URL"),
		JWTAdminSecret:              os.Getenv("JWT_ADMIN_SECRET"),
		JWTCustomerSecret:           os.Getenv("JWT_CUSTOMER_SECRET"),
		CloudinaryCloudName:         os.Getenv("CLOUDINARY_CLOUD_NAME"),
		CloudinaryAPIKey:            os.Getenv("CLOUDINARY_API_KEY"),
		CloudinaryAPISecret:         os.Getenv("CLOUDINARY_API_SECRET"),
		CloudinaryUploadFolder:      getEnv("CLOUDINARY_UPLOAD_FOLDER", "juicy"),
		ResendAPIKey:                os.Getenv("RESEND_API_KEY"),
		ResendFromEmail:             getEnv("RESEND_FROM_EMAIL", "noreply@juicy.com"),
		AdminAlertEmail:             getEnv("ADMIN_ALERT_EMAIL", "admin@juicy.com"),
		AllowedOrigins:              getEnv("ALLOWED_ORIGINS", "http://localhost:5173"),
		JWTAdminAccessExpiryMinutes: getEnvInt("JWT_ADMIN_ACCESS_EXPIRY_MINUTES", 15),
		JWTAdminRefreshExpiryDays:   getEnvInt("JWT_ADMIN_REFRESH_EXPIRY_DAYS", 1),
		JWTCustomerExpiryDays:       getEnvInt("JWT_CUSTOMER_EXPIRY_DAYS", 7),
		DefaultShippingFee:          getEnvFloat("DEFAULT_SHIPPING_FEE", 25000.0),
		BackgroundWorkerPoolSize:   getEnvInt("BACKGROUND_WORKER_POOL_SIZE", 5),
		BackgroundWorkerQueueSize:  getEnvInt("BACKGROUND_WORKER_QUEUE_SIZE", 100),
	}

	required := map[string]string{
		"JWT_ADMIN_SECRET":   cfg.JWTAdminSecret,
		"JWT_CUSTOMER_SECRET": cfg.JWTCustomerSecret,
	}

	for name, val := range required {
		if val == "" {
			return nil, fmt.Errorf("%s is required", name)
		}
	}

	if cfg.DatabaseURL == "" && cfg.DBHost == "" {
		return nil, fmt.Errorf("DATABASE_URL or DB_HOST is required")
	}

	return cfg, nil
}

func (c *Config) DSN() string {
	if c.DatabaseURL != "" {
		return c.DatabaseURL
	}
	return fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s", c.DBHost, c.DBPort, c.DBUser, c.DBPassword, c.DBName, c.DBSSLMode)
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

func getEnvFloat(key string, fallback float64) float64 {
	val := os.Getenv(key)
	if val == "" {
		return fallback
	}
	f, err := strconv.ParseFloat(val, 64)
	if err != nil {
		return fallback
	}
	return f
}
