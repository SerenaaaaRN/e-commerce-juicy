package router

import (
	"github.com/SerenaaaaRN/juicy/internal/config"
	"github.com/SerenaaaaRN/juicy/internal/handler"
	"github.com/SerenaaaaRN/juicy/internal/middleware"
	"github.com/gin-gonic/gin"
)

type Router struct {
	adminHandler     *handler.AdminHandler
	customerHandler  *handler.CustomerHandler
	addressHandler   *handler.AddressHandler
	categoryHandler  *handler.CategoryHandler
	productHandler   *handler.ProductHandler
	cartHandler      *handler.CartHandler
	orderHandler     *handler.OrderHandler
	reviewHandler    *handler.ReviewHandler
	wishlistHandler  *handler.WishlistHandler
	analyticsHandler *handler.AnalyticsHandler
	config           *config.Config
}

func NewRouter(
	adminHandler *handler.AdminHandler,
	customerHandler *handler.CustomerHandler,
	addressHandler *handler.AddressHandler,
	categoryHandler *handler.CategoryHandler,
	productHandler *handler.ProductHandler,
	cartHandler *handler.CartHandler,
	orderHandler *handler.OrderHandler,
	reviewHandler *handler.ReviewHandler,
	wishlistHandler *handler.WishlistHandler,
	analyticsHandler *handler.AnalyticsHandler,
	cfg *config.Config,
) *Router {
	return &Router{
		adminHandler:     adminHandler,
		customerHandler:  customerHandler,
		addressHandler:   addressHandler,
		categoryHandler:  categoryHandler,
		productHandler:   productHandler,
		cartHandler:      cartHandler,
		orderHandler:     orderHandler,
		reviewHandler:    reviewHandler,
		wishlistHandler:  wishlistHandler,
		analyticsHandler: analyticsHandler,
		config:           cfg,
	}
}

func (r *Router) Setup(engine *gin.Engine) {
	engine.Use(middleware.CORS())

	engine.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"app":     "Juicy Backend API",
			"status":  "healthy",
			"version": "1.0.0",
		})
	})

	api := engine.Group("/api")
	{
		api.POST("/customers/register", r.customerHandler.Register)
		api.POST("/customers/login", r.customerHandler.Login)

		shop := api.Group("/shop")
		{
			shop.GET("/categories", r.categoryHandler.ListActiveCategories)
			shop.GET("/products", r.productHandler.ListProducts)
			shop.GET("/products/:slug", r.productHandler.GetProductBySlug)
			shop.GET("/products/:slug/reviews", r.reviewHandler.GetProductReviews)
		}

		customerAuth := api.Group("")
		customerAuth.Use(middleware.CustomerAuth(r.config))
		{
			customerAuth.GET("/customers/profile", r.customerHandler.GetProfile)
			customerAuth.PUT("/customers/profile", r.customerHandler.UpdateProfile)
			customerAuth.PUT("/customers/profile/password", r.customerHandler.ChangePassword)

			customerAuth.GET("/addresses", r.addressHandler.GetAddresses)
			customerAuth.GET("/addresses/:id", r.addressHandler.GetAddressByID)
			customerAuth.POST("/addresses", r.addressHandler.CreateAddress)
			customerAuth.PUT("/addresses/:id", r.addressHandler.UpdateAddress)
			customerAuth.DELETE("/addresses/:id", r.addressHandler.DeleteAddress)
			customerAuth.PUT("/addresses/:id/default", r.addressHandler.SetDefaultAddress)

			customerAuth.GET("/cart", r.cartHandler.GetCart)
			customerAuth.POST("/cart/items", r.cartHandler.AddCartItem)
			customerAuth.PUT("/cart/items/:id", r.cartHandler.UpdateCartItemQuantity)
			customerAuth.DELETE("/cart/items/:id", r.cartHandler.RemoveCartItem)
			customerAuth.DELETE("/cart", r.cartHandler.ClearCart)

			customerAuth.POST("/orders/checkout", r.orderHandler.Checkout)
			customerAuth.GET("/orders", r.orderHandler.GetCustomerOrders)
			customerAuth.GET("/orders/:orderNumber", r.orderHandler.GetCustomerOrderDetail)
			customerAuth.POST("/orders/:orderNumber/cancel", r.orderHandler.CancelOrder)

			customerAuth.GET("/wishlist", r.wishlistHandler.GetWishlist)
			customerAuth.GET("/wishlist/check/:variantId", r.wishlistHandler.CheckWishlist)
			customerAuth.POST("/wishlist/items", r.wishlistHandler.AddToWishlist)
			customerAuth.DELETE("/wishlist/items/:variantId", r.wishlistHandler.RemoveFromWishlist)

			customerAuth.POST("/reviews", r.reviewHandler.SubmitReview)
		}

		api.POST("/admin/login", r.adminHandler.Login)
		api.POST("/admin/refresh", r.adminHandler.Refresh)
		api.POST("/admin/logout", r.adminHandler.Logout)

		adminAuth := api.Group("/admin")
		adminAuth.Use(middleware.AdminAuth(r.config))
		{
			adminAuth.GET("/profile", r.adminHandler.GetProfile)
			adminAuth.GET("/customers", r.customerHandler.ListCustomers)
			adminAuth.GET("/customers/:id", r.customerHandler.GetCustomerDetail)
			adminAuth.PUT("/customers/:id/status", r.customerHandler.UpdateCustomerStatus)

			adminAuth.GET("/categories", r.categoryHandler.ListAllCategories)
			adminAuth.GET("/categories/:id", r.categoryHandler.GetCategoryByID)
			adminAuth.POST("/categories", r.categoryHandler.CreateCategory)
			adminAuth.PUT("/categories/:id", r.categoryHandler.UpdateCategory)
			adminAuth.DELETE("/categories/:id", r.categoryHandler.DeleteCategory)

			adminAuth.GET("/products", r.productHandler.ListProducts)
			adminAuth.GET("/products/:id", r.productHandler.GetProductByID)
			adminAuth.POST("/products", r.productHandler.CreateProduct)
			adminAuth.PUT("/products/:id", r.productHandler.UpdateProduct)
			adminAuth.DELETE("/products/:id", r.productHandler.DeleteProduct)

			adminAuth.POST("/products/:id/images", r.productHandler.AddProductImages)
			adminAuth.POST("/products/:id/images/url", r.productHandler.AddProductImageUrl)
			adminAuth.DELETE("/products/:id/images/:imageId", r.productHandler.DeleteProductImage)
			adminAuth.PUT("/products/:id/images/:imageId/primary", r.productHandler.SetPrimaryProductImage)

			adminAuth.GET("/products/:id/variants", r.productHandler.GetProductVariants)
			adminAuth.POST("/products/:id/variants", r.productHandler.AddProductVariant)
			adminAuth.PUT("/products/:id/variants/:variantId", r.productHandler.UpdateProductVariant)
			adminAuth.DELETE("/products/:id/variants/:variantId", r.productHandler.DeleteProductVariant)

			adminAuth.GET("/orders", r.orderHandler.ListAllOrders)
			adminAuth.GET("/orders/:id", r.orderHandler.GetOrderDetail)
			adminAuth.PUT("/orders/:id/status", r.orderHandler.UpdateOrderStatus)
			adminAuth.PUT("/orders/:id/payment", r.orderHandler.UpdateOrderPaymentStatus)

			adminAuth.GET("/reviews", r.reviewHandler.ListAllReviews)
			adminAuth.PUT("/reviews/:id/publish", r.reviewHandler.UpdateReviewPublishStatus)
			adminAuth.DELETE("/reviews/:id", r.reviewHandler.DeleteReview)

			adminAuth.GET("/analytics/overview", r.analyticsHandler.GetOverview)
			adminAuth.GET("/analytics/orders/chart", r.analyticsHandler.GetOrdersChart)
		}
	}
}
