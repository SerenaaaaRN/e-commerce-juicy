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

	"github.com/SerenaaaaRN/juicy/internal/config"
	"github.com/SerenaaaaRN/juicy/internal/database"
	"github.com/SerenaaaaRN/juicy/internal/handler"
	"github.com/SerenaaaaRN/juicy/internal/repository"
	"github.com/SerenaaaaRN/juicy/internal/router"
	"github.com/SerenaaaaRN/juicy/internal/service"
	"github.com/gin-gonic/gin"
)

func main() {
	log.Println("Starting Juicy Backend Initialization...")

	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Fatal: Failed to load configuration: %v", err)
	}

	if cfg.AppEnv == "production" {
		gin.SetMode(gin.ReleaseMode)
	} else {
		gin.SetMode(gin.DebugMode)
	}

	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatalf("Fatal: Database connection failed: %v", err)
	}

	adminRepo := repository.NewAdminRepository(db)
	customerRepo := repository.NewCustomerRepository(db)
	addressRepo := repository.NewAddressRepository(db)
	categoryRepo := repository.NewCategoryRepository(db)
	productRepo := repository.NewProductRepository(db)
	cartRepo := repository.NewCartRepository(db)
	orderRepo := repository.NewOrderRepository(db)
	reviewRepo := repository.NewReviewRepository(db)
	wishlistRepo := repository.NewWishlistRepository(db)

	worker := service.NewBackgroundWorker(context.Background(), 5, 100)
	cloudinaryService := service.NewCloudinaryService(cfg)
	emailService := service.NewEmailService(cfg)

	adminService := service.NewAdminService(adminRepo, cfg)
	customerService := service.NewCustomerService(customerRepo, cfg)
	addressService := service.NewAddressService(addressRepo)
	categoryService := service.NewCategoryService(categoryRepo)
	productService := service.NewProductService(productRepo, cloudinaryService, db)
	cartService := service.NewCartService(cartRepo, productRepo)
	orderService := service.NewOrderService(orderRepo, cartRepo, addressRepo, productRepo, customerRepo, emailService, worker, cfg)
	reviewService := service.NewReviewService(reviewRepo, orderRepo, productRepo, customerRepo)
	wishlistService := service.NewWishlistService(wishlistRepo)
	analyticsService := service.NewAnalyticsService(db)

	adminHandler := handler.NewAdminHandler(adminService, cfg)
	customerHandler := handler.NewCustomerHandler(customerService)
	addressHandler := handler.NewAddressHandler(addressService)
	categoryHandler := handler.NewCategoryHandler(categoryService)
	productHandler := handler.NewProductHandler(productService)
	cartHandler := handler.NewCartHandler(cartService)
	orderHandler := handler.NewOrderHandler(orderService)
	reviewHandler := handler.NewReviewHandler(reviewService)
	wishlistHandler := handler.NewWishlistHandler(wishlistService)
	analyticsHandler := handler.NewAnalyticsHandler(analyticsService)

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
		wishlistHandler,
		analyticsHandler,
		cfg,
	)
	r.Setup(ginEngine)

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

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutdown signal received. Gracefully stopping server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	worker.Shutdown()

	if err := srv.Shutdown(ctx); err != nil {
		log.Printf("Error: Server Shutdown Forced: %v", err)
	}

	log.Println("Juicy Backend terminated gracefully.")
}
