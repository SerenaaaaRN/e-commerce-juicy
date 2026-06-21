package service

import (
	"context"

	"github.com/SerenaaaaRN/juicy/internal/dto"
	"github.com/SerenaaaaRN/juicy/internal/model"
	"github.com/google/uuid"
)

type AdminRepository interface {
	FindByEmail(ctx context.Context, email string) (*model.Admin, error)
	FindByID(ctx context.Context, id uuid.UUID) (*model.Admin, error)
}

type CustomerRepository interface {
	FindByEmail(ctx context.Context, email string) (*model.Customer, error)
	FindByID(ctx context.Context, id uuid.UUID) (*model.Customer, error)
	Create(ctx context.Context, customer *model.Customer) error
	Update(ctx context.Context, customer *model.Customer) error
	FindAll(ctx context.Context, page, perPage int, search string) ([]model.Customer, int64, error)
	UpdateStatus(ctx context.Context, id uuid.UUID, isActive bool) error
	GetStats(ctx context.Context, customerIDs []uuid.UUID) (map[uuid.UUID]model.CustomerStats, error)
	GetOrderHistory(ctx context.Context, customerID uuid.UUID) ([]model.Order, error)
}

type AddressRepository interface {
	FindByID(ctx context.Context, id uuid.UUID) (*model.Address, error)
	FindByCustomerID(ctx context.Context, customerID uuid.UUID) ([]model.Address, error)
	Create(ctx context.Context, address *model.Address) error
	Update(ctx context.Context, address *model.Address) error
	Delete(ctx context.Context, id uuid.UUID, customerID uuid.UUID) error
	SetDefault(ctx context.Context, id uuid.UUID, customerID uuid.UUID) error
}

type CategoryRepository interface {
	FindAllActive(ctx context.Context) ([]model.Category, error)
	FindAll(ctx context.Context) ([]model.Category, error)
	FindByID(ctx context.Context, id uuid.UUID) (*model.Category, error)
	FindBySlug(ctx context.Context, slug string) (*model.Category, error)
	Create(ctx context.Context, category *model.Category) error
	Update(ctx context.Context, category *model.Category) error
	Delete(ctx context.Context, id uuid.UUID) error
	GetProductCounts(ctx context.Context) (map[uuid.UUID]int64, error)
}

type ProductRepository interface {
	FindAll(ctx context.Context, categorySlug string, featuredOnly bool, tag string, sort string, page, perPage int, includeUnavailable bool, sizes []string, search string) ([]model.Product, int64, error)
	FindBySlug(ctx context.Context, slug string) (*model.Product, error)
	FindByID(ctx context.Context, id uuid.UUID) (*model.Product, error)
	Create(ctx context.Context, product *model.Product) error
	Update(ctx context.Context, product *model.Product) error
	Delete(ctx context.Context, id uuid.UUID) error

	CreateImage(ctx context.Context, image *model.ProductImage) error
	DeleteImage(ctx context.Context, id uuid.UUID, productID uuid.UUID) error
	FindImageByID(ctx context.Context, id uuid.UUID) (*model.ProductImage, error)
	SetPrimaryImage(ctx context.Context, id uuid.UUID, productID uuid.UUID) error

	FindVariantsByProductID(ctx context.Context, productID uuid.UUID) ([]model.ProductVariant, error)
	FindVariantByID(ctx context.Context, id uuid.UUID) (*model.ProductVariant, error)
	CreateVariant(ctx context.Context, variant *model.ProductVariant) error
	UpdateVariant(ctx context.Context, variant *model.ProductVariant) error
	DeactivateVariant(ctx context.Context, id uuid.UUID, productID uuid.UUID) error
	GetReviewStats(ctx context.Context, productIDs []uuid.UUID) (map[uuid.UUID]dto.ProductReviewStat, error)
	GetReviewStat(ctx context.Context, productID uuid.UUID) (*dto.ProductReviewStat, error)
}

type CartRepository interface {
	FindByCustomerID(ctx context.Context, customerID uuid.UUID) ([]model.CartItem, error)
	FindItemByID(ctx context.Context, id uuid.UUID) (*model.CartItem, error)
	UpsertItem(ctx context.Context, item *model.CartItem) error
	UpdateItemQuantity(ctx context.Context, id uuid.UUID, customerID uuid.UUID, quantity int) error
	RemoveItem(ctx context.Context, id uuid.UUID, customerID uuid.UUID) error
	ClearCart(ctx context.Context, customerID uuid.UUID) error
}

type OrderRepository interface {
	Create(ctx context.Context, order *model.Order, items []model.OrderItem) error
	FindByCustomerID(ctx context.Context, customerID uuid.UUID, page, perPage int) ([]model.Order, int64, error)
	FindByOrderNumberAndCustomerID(ctx context.Context, orderNumber string, customerID uuid.UUID) (*model.Order, error)
	FindAll(ctx context.Context, status string, paymentStatus string, search string, page, perPage int) ([]model.Order, int64, error)
	FindByID(ctx context.Context, id uuid.UUID) (*model.Order, error)
	UpdateStatus(ctx context.Context, id uuid.UUID, status string) error
	UpdatePaymentStatus(ctx context.Context, id uuid.UUID, paymentStatus string) error
	CancelOrder(ctx context.Context, orderID uuid.UUID) error
	CompleteOrderTx(ctx context.Context, orderID uuid.UUID) error
	HasCustomerPurchasedProduct(ctx context.Context, customerID uuid.UUID, productID uuid.UUID) (bool, error)
	IsProductReviewable(ctx context.Context, customerID uuid.UUID, productID uuid.UUID, orderID uuid.UUID) (bool, error)
	GetItemCounts(ctx context.Context, orderIDs []uuid.UUID) (map[uuid.UUID]int, error)
}

type WishlistRepository interface {
	FindByCustomerID(ctx context.Context, customerID uuid.UUID) ([]model.WishlistItem, error)
	Exists(ctx context.Context, customerID uuid.UUID, variantID uuid.UUID) (bool, error)
	Add(ctx context.Context, item *model.WishlistItem) error
	Remove(ctx context.Context, customerID uuid.UUID, variantID uuid.UUID) error
}

type ReviewRepository interface {
	Create(ctx context.Context, review *model.Review) error
	FindByProductID(ctx context.Context, productID uuid.UUID, page, perPage int) ([]model.Review, int64, error)
	FindAll(ctx context.Context, productID *uuid.UUID, published *bool, page, perPage int) ([]model.Review, int64, error)
	FindByID(ctx context.Context, id uuid.UUID) (*model.Review, error)
	UpdatePublishStatus(ctx context.Context, id uuid.UUID, isPublished bool) error
	Delete(ctx context.Context, id uuid.UUID) error
	Exists(ctx context.Context, customerID uuid.UUID, productID uuid.UUID, orderID uuid.UUID) (bool, error)
}
