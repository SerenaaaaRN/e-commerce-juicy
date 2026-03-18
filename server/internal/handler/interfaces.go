package handler

import (
	"context"

	"github.com/google/uuid"
	"github.com/SerenaaaaRN/juicy/internal/dto"
	"github.com/SerenaaaaRN/juicy/internal/model"
)

type AdminService interface {
	Login(ctx context.Context, req dto.AdminLoginRequest) (*dto.AdminLoginResponse, string, error)
	Refresh(ctx context.Context, refreshToken string) (*dto.AdminLoginResponse, string, error)
	GetAdminByID(ctx context.Context, id uuid.UUID) (*dto.AdminResponse, error)
}

type CustomerService interface {
	Register(ctx context.Context, req dto.CustomerRegisterRequest) (*dto.CustomerLoginResponse, error)
	Login(ctx context.Context, req dto.CustomerLoginRequest) (*dto.CustomerLoginResponse, error)
	GetProfile(ctx context.Context, id uuid.UUID) (*dto.CustomerProfileResponse, error)
	UpdateProfile(ctx context.Context, id uuid.UUID, req dto.UpdateProfileRequest) (*dto.CustomerProfileResponse, error)
	ChangePassword(ctx context.Context, id uuid.UUID, req dto.ChangePasswordRequest) error

	// Admin customer routes
	ListCustomers(ctx context.Context, page, perPage int, search string) ([]dto.CustomerProfileResponse, int64, error)
	UpdateCustomerStatus(ctx context.Context, id uuid.UUID, isActive bool) error
	GetCustomerDetail(ctx context.Context, id uuid.UUID) (*dto.CustomerProfileResponse, error)
}

type AddressService interface {
	GetAddresses(ctx context.Context, customerID uuid.UUID) ([]model.Address, error)
	GetAddressByID(ctx context.Context, id uuid.UUID, customerID uuid.UUID) (*model.Address, error)
	CreateAddress(ctx context.Context, customerID uuid.UUID, req dto.AddressRequest) (*model.Address, error)
	UpdateAddress(ctx context.Context, id uuid.UUID, customerID uuid.UUID, req dto.AddressRequest) (*model.Address, error)
	DeleteAddress(ctx context.Context, id uuid.UUID, customerID uuid.UUID) error
	SetDefaultAddress(ctx context.Context, id uuid.UUID, customerID uuid.UUID) error
}

type CategoryService interface {
	ListActiveCategories(ctx context.Context) ([]model.Category, error)
	ListAllCategories(ctx context.Context) ([]model.Category, error)
	GetCategoryByID(ctx context.Context, id uuid.UUID) (*model.Category, error)
	CreateCategory(ctx context.Context, req dto.CategoryRequest) (*model.Category, error)
	UpdateCategory(ctx context.Context, id uuid.UUID, req dto.CategoryRequest) (*model.Category, error)
	DeleteCategory(ctx context.Context, id uuid.UUID) error
}

type ProductService interface {
	ListProducts(ctx context.Context, categorySlug string, featuredOnly bool, tag string, sort string, page, perPage int, includeUnavailable bool) ([]dto.ProductResponse, int64, error)
	GetProductBySlug(ctx context.Context, slug string) (*dto.ProductDetailResponse, error)
	GetProductByID(ctx context.Context, id uuid.UUID) (*dto.ProductDetailResponse, error)
	CreateProduct(ctx context.Context, product *model.Product) (*model.Product, error)
	UpdateProduct(ctx context.Context, id uuid.UUID, product *model.Product) (*model.Product, error)
	DeleteProduct(ctx context.Context, id uuid.UUID) error

	// Image uploads (Cloudinary integrated)
	AddProductImages(ctx context.Context, id uuid.UUID, filePaths []string) error
	DeleteProductImage(ctx context.Context, id uuid.UUID, imageID uuid.UUID) error
	SetPrimaryProductImage(ctx context.Context, id uuid.UUID, imageID uuid.UUID) error

	// Variant management
	GetProductVariants(ctx context.Context, productID uuid.UUID) ([]dto.ProductVariantRes, error)
	AddProductVariant(ctx context.Context, productID uuid.UUID, req dto.ProductVariantRequest) (*model.ProductVariant, error)
	UpdateProductVariant(ctx context.Context, productID uuid.UUID, variantID uuid.UUID, req dto.ProductVariantRequest) (*model.ProductVariant, error)
	DeleteProductVariant(ctx context.Context, productID uuid.UUID, variantID uuid.UUID) error
}

type CartService interface {
	GetCart(ctx context.Context, customerID uuid.UUID) (*dto.CartResponse, error)
	AddCartItem(ctx context.Context, customerID uuid.UUID, req dto.AddCartItemRequest) error
	UpdateCartItemQuantity(ctx context.Context, id uuid.UUID, customerID uuid.UUID, req dto.UpdateCartItemQuantityRequest) error
	RemoveCartItem(ctx context.Context, id uuid.UUID, customerID uuid.UUID) error
	ClearCart(ctx context.Context, customerID uuid.UUID) error
}

type OrderService interface {
	Checkout(ctx context.Context, customerID uuid.UUID, req dto.CheckoutRequest) (*dto.OrderCheckoutResponse, error)
	GetCustomerOrders(ctx context.Context, customerID uuid.UUID, page, perPage int) ([]dto.OrderResponse, int64, error)
	GetCustomerOrderDetail(ctx context.Context, orderNumber string, customerID uuid.UUID) (*dto.OrderDetailResponse, error)
	
	// Admin routes
	ListAllOrders(ctx context.Context, status string, paymentStatus string, search string, page, perPage int) ([]dto.AdminOrderResponse, int64, error)
	GetOrderDetail(ctx context.Context, id uuid.UUID) (*dto.OrderDetailResponse, error)
	UpdateOrderStatus(ctx context.Context, id uuid.UUID, status string) error
	UpdateOrderPaymentStatus(ctx context.Context, id uuid.UUID, paymentStatus string) error
}

type ReviewService interface {
	SubmitReview(ctx context.Context, customerID uuid.UUID, req dto.CreateReviewRequest) (*dto.ReviewResponse, error)
	GetProductReviews(ctx context.Context, productSlug string, page, perPage int) ([]dto.ProductReviewResponse, int64, error)
	
	// Admin routes
	ListAllReviews(ctx context.Context, productID *uuid.UUID, published *bool, page, perPage int) ([]dto.AdminReviewResponse, int64, error)
	UpdateReviewPublishStatus(ctx context.Context, id uuid.UUID, isPublished bool) error
	DeleteReview(ctx context.Context, id uuid.UUID) error
}

type AnalyticsService interface {
	GetOverview(ctx context.Context) (map[string]interface{}, error)
	GetOrdersChart(ctx context.Context) ([]map[string]interface{}, error)
}
