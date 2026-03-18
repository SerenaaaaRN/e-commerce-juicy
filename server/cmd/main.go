package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/SerenaaaaRN/juicy/internal/config"
	"github.com/SerenaaaaRN/juicy/internal/database"
	"github.com/SerenaaaaRN/juicy/internal/handler"
	"github.com/SerenaaaaRN/juicy/internal/repository"
	"github.com/SerenaaaaRN/juicy/internal/router"
	"github.com/SerenaaaaRN/juicy/internal/service"
)

func main() {
	log.Println("Starting Juicy Backend Initialization...")

	// 1. Load config
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Fatal: Failed to load configuration: %v", err)
	}

	// Set Gin mode
	if cfg.AppEnv == "production" {
		gin.SetMode(gin.ReleaseMode)
	} else {
		gin.SetMode(gin.DebugMode)
	}

	// 2. Connect to database
	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatalf("Fatal: Database connection failed: %v", err)
	}

	// 3. Initialize Repositories
	adminRepo := repository.NewAdminRepository(db)
	customerRepo := repository.NewCustomerRepository(db)
	addressRepo := repository.NewAddressRepository(db)
	categoryRepo := repository.NewCategoryRepository(db)
	productRepo := repository.NewProductRepository(db)
	cartRepo := repository.NewCartRepository(db)
	orderRepo := repository.NewOrderRepository(db)
	reviewRepo := repository.NewReviewRepository(db)

	// 4. Initialize Core Helpers & Background worker
	worker := service.NewBackgroundWorker()
	cldService := service.NewCloudinaryService(cfg)
	emailService := service.NewEmailService(cfg)

	// 5. Initialize Services
	adminService := service.NewAdminService(adminRepo, cfg)
	customerService := service.NewCustomerService(customerRepo, cfg)
	addressService := service.NewAddressService(addressRepo)
	categoryService := service.NewCategoryService(categoryRepo)
	productService := service.NewProductService(productRepo, cldService, db)
	cartService := service.NewCartService(cartRepo, productRepo)
	orderService := service.NewOrderService(orderRepo, cartRepo, addressRepo, productRepo, customerRepo, emailService, worker, db)
	reviewService := service.NewReviewService(reviewRepo, orderRepo, productRepo, customerRepo)
	analyticsService := service.NewAnalyticsService(db)

	// 6. Initialize Handlers
	adminHandler := handler.NewAdminHandler(adminService, cfg)
	customerHandler := handler.NewCustomerHandler(customerService)
	addressHandler := handler.NewAddressHandler(addressService)
	categoryHandler := handler.NewCategoryHandler(categoryService)
	productHandler := handler.NewProductHandler(productService)
	cartHandler := handler.NewCartHandler(cartService)
	orderHandler := handler.NewOrderHandler(orderService)
	reviewHandler := handler.NewReviewHandler(reviewService)
	analyticsHandler := handler.NewAnalyticsHandler(analyticsService)

	// 7. Initialize Router
	ginEngine := gin.Default()
	r := router.NewRouter(
		adminHandler,
		customerHandler,
		addressHandler,
		categoryHandler,
		productHandler,
		cartHandler,
		orderHandler,
		reviewHandler,
		analyticsHandler,
		cfg,
	)
	r.Setup(ginEngine)

	// 8. Graceful HTTP Server setup
	srv := &http.Server{
		Addr:    ":" + cfg.AppPort,
		Handler: ginEngine,
	}

	go func() {
		log.Printf("Juicy Server successfully started on port %s in %s mode", cfg.AppPort, cfg.AppEnv)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("Fatal: ListenAndServe error: %s", err)
		}
	}()

	// Listen for OS interrupt signals
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutdown signal received. Gracefully stopping server...")

	// 5-second context timeout to finish ongoing requests
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Fatal: Server Shutdown Forced: %v", err)
	}

	// Drain active background tasks (e.g. emails)
	worker.Shutdown()

	log.Println("Juicy Backend terminated gracefully.")
}
