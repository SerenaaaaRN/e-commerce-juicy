package app

import (
	"context"
	"net/http"
	"time"

	"github.com/SerenaaaaRN/juicy/internal/config"
	"github.com/SerenaaaaRN/juicy/internal/database"
	"github.com/SerenaaaaRN/juicy/internal/handler"
	"github.com/SerenaaaaRN/juicy/internal/repository"
	"github.com/SerenaaaaRN/juicy/internal/router"
	"github.com/SerenaaaaRN/juicy/internal/service"
	"github.com/gin-gonic/gin"
)

type App struct {
	*http.Server
	Worker *service.BackgroundWorker
}

func New(cfg *config.Config) (*App, error) {
	db, err := database.Connect(cfg)
	if err != nil {
		return nil, err
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
	analyticsRepo := repository.NewAnalyticsRepository(db)

	worker := service.NewBackgroundWorker(context.Background(), cfg.BackgroundWorkerPoolSize, cfg.BackgroundWorkerQueueSize)
	cloudinarySvc := service.NewCloudinaryService(cfg)
	emailSvc := service.NewEmailService(cfg)

	adminSvc := service.NewAdminService(adminRepo, cfg)
	customerSvc := service.NewCustomerService(customerRepo, cfg)
	addressSvc := service.NewAddressService(addressRepo)
	categorySvc := service.NewCategoryService(categoryRepo)
	productSvc := service.NewProductService(productRepo, cloudinarySvc)
	cartSvc := service.NewCartService(cartRepo, productRepo)
	orderSvc := service.NewOrderService(orderRepo, cartRepo, addressRepo, productRepo, customerRepo, emailSvc, worker, cfg)
	reviewSvc := service.NewReviewService(reviewRepo, orderRepo, productRepo, customerRepo)
	wishlistSvc := service.NewWishlistService(wishlistRepo)
	analyticsSvc := service.NewAnalyticsService(analyticsRepo)

	h := &handler.Handlers{
		Admin:     handler.NewAdminHandler(adminSvc, cfg),
		Customer:  handler.NewCustomerHandler(customerSvc),
		Address:   handler.NewAddressHandler(addressSvc),
		Category:  handler.NewCategoryHandler(categorySvc),
		Product:   handler.NewProductHandler(productSvc),
		Cart:      handler.NewCartHandler(cartSvc),
		Order:     handler.NewOrderHandler(orderSvc),
		Review:    handler.NewReviewHandler(reviewSvc),
		Wishlist:  handler.NewWishlistHandler(wishlistSvc),
		Analytics: handler.NewAnalyticsHandler(analyticsSvc),
	}

	ginEngine := gin.Default()
	r := router.NewRouter(h, cfg)
	r.Setup(ginEngine)

	srv := &http.Server{
		Addr:         ":" + cfg.AppPort,
		Handler:      ginEngine,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	return &App{Server: srv, Worker: worker}, nil
}
