package router

import (
	"github.com/SerenaaaaRN/juicy/internal/config"
	"github.com/SerenaaaaRN/juicy/internal/handler"
	"github.com/SerenaaaaRN/juicy/internal/middleware"
	"github.com/gin-gonic/gin"
)

type Router struct {
	h      *handler.Handlers
	config *config.Config
}

func NewRouter(h *handler.Handlers, cfg *config.Config) *Router {
	return &Router{
		h:      h,
		config: cfg,
	}
}

func (r *Router) Setup(engine *gin.Engine) {
	engine.Use(middleware.CORS(r.config))

	engine.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"app":     "Juicy Backend API",
			"status":  "healthy",
			"version": "1.0.0",
		})
	})

	api := engine.Group("/api")
	{
		api.POST("/customers/register", r.h.Customer.Register)
		api.POST("/customers/login", r.h.Customer.Login)

		shop := api.Group("/shop")
		{
			shop.GET("/categories", r.h.Category.ListActiveCategories)
			shop.GET("/products", r.h.Product.ListProducts)
			shop.GET("/products/:slug", r.h.Product.GetProductBySlug)
			shop.GET("/products/:slug/reviews", r.h.Review.GetProductReviews)
		}

		customerAuth := api.Group("")
		customerAuth.Use(middleware.CustomerAuth(r.config))
		{
			customerAuth.GET("/customers/profile", r.h.Customer.GetProfile)
			customerAuth.PUT("/customers/profile", r.h.Customer.UpdateProfile)
			customerAuth.PUT("/customers/profile/password", r.h.Customer.ChangePassword)

			customerAuth.GET("/addresses", r.h.Address.GetAddresses)
			customerAuth.GET("/addresses/:id", r.h.Address.GetAddressByID)
			customerAuth.POST("/addresses", r.h.Address.CreateAddress)
			customerAuth.PUT("/addresses/:id", r.h.Address.UpdateAddress)
			customerAuth.DELETE("/addresses/:id", r.h.Address.DeleteAddress)
			customerAuth.PUT("/addresses/:id/default", r.h.Address.SetDefaultAddress)

			customerAuth.GET("/cart", r.h.Cart.GetCart)
			customerAuth.POST("/cart/items", r.h.Cart.AddCartItem)
			customerAuth.PUT("/cart/items/:id", r.h.Cart.UpdateCartItemQuantity)
			customerAuth.DELETE("/cart/items/:id", r.h.Cart.RemoveCartItem)
			customerAuth.DELETE("/cart", r.h.Cart.ClearCart)

			customerAuth.POST("/orders/checkout", r.h.Order.Checkout)
			customerAuth.GET("/orders", r.h.Order.GetCustomerOrders)
			customerAuth.GET("/orders/:orderNumber", r.h.Order.GetCustomerOrderDetail)
			customerAuth.POST("/orders/:orderNumber/cancel", r.h.Order.CancelOrder)
			customerAuth.POST("/orders/:orderNumber/complete", r.h.Order.CompleteOrder)

			customerAuth.GET("/wishlist", r.h.Wishlist.GetWishlist)
			customerAuth.GET("/wishlist/check/:variantId", r.h.Wishlist.CheckWishlist)
			customerAuth.POST("/wishlist/items", r.h.Wishlist.AddToWishlist)
			customerAuth.DELETE("/wishlist/items/:variantId", r.h.Wishlist.RemoveFromWishlist)

			customerAuth.POST("/reviews", r.h.Review.SubmitReview)
		}

		api.POST("/admin/login", r.h.Admin.Login)
		api.POST("/admin/refresh", r.h.Admin.Refresh)
		api.POST("/admin/logout", r.h.Admin.Logout)

		adminAuth := api.Group("/admin")
		adminAuth.Use(middleware.AdminAuth(r.config))
		{
			adminAuth.GET("/profile", r.h.Admin.GetProfile)
			adminAuth.GET("/customers", r.h.Customer.ListCustomers)
			adminAuth.GET("/customers/:id", r.h.Customer.GetCustomerDetail)
			adminAuth.PATCH("/customers/:id/status", r.h.Customer.UpdateCustomerStatus)

			adminAuth.GET("/categories", r.h.Category.ListAllCategories)
			adminAuth.GET("/categories/:id", r.h.Category.GetCategoryByID)
			adminAuth.POST("/categories", r.h.Category.CreateCategory)
			adminAuth.PUT("/categories/:id", r.h.Category.UpdateCategory)
			adminAuth.DELETE("/categories/:id", r.h.Category.DeleteCategory)

			adminAuth.GET("/products", r.h.Product.ListProducts)
			adminAuth.GET("/products/:id", r.h.Product.GetProductByID)
			adminAuth.POST("/products", r.h.Product.CreateProduct)
			adminAuth.PUT("/products/:id", r.h.Product.UpdateProduct)
			adminAuth.DELETE("/products/:id", r.h.Product.DeleteProduct)

			adminAuth.POST("/products/:id/images", r.h.Product.AddProductImages)
			adminAuth.POST("/products/:id/images/url", r.h.Product.AddProductImageUrl)
			adminAuth.DELETE("/products/:id/images/:imageId", r.h.Product.DeleteProductImage)
			adminAuth.PUT("/products/:id/images/:imageId/primary", r.h.Product.SetPrimaryProductImage)

			adminAuth.GET("/products/:id/variants", r.h.Product.GetProductVariants)
			adminAuth.POST("/products/:id/variants", r.h.Product.AddProductVariant)
			adminAuth.PUT("/products/:id/variants/:variantId", r.h.Product.UpdateProductVariant)
			adminAuth.DELETE("/products/:id/variants/:variantId", r.h.Product.DeleteProductVariant)

			adminAuth.GET("/orders", r.h.Order.ListAllOrders)
			adminAuth.GET("/orders/:id", r.h.Order.GetOrderDetail)
			adminAuth.PUT("/orders/:id/status", r.h.Order.UpdateOrderStatus)
			adminAuth.PUT("/orders/:id/payment", r.h.Order.UpdateOrderPaymentStatus)

			adminAuth.GET("/reviews", r.h.Review.ListAllReviews)
			adminAuth.PUT("/reviews/:id/publish", r.h.Review.UpdateReviewPublishStatus)
			adminAuth.DELETE("/reviews/:id", r.h.Review.DeleteReview)

			adminAuth.GET("/analytics/overview", r.h.Analytics.GetOverview)
			adminAuth.GET("/analytics/orders/chart", r.h.Analytics.GetOrdersChart)
		}
	}
}
