# CLAUDE.md — JUICY Server (Go Backend)

## Ringkasan

Backend API untuk e-commerce fashion premium "JUICY". Dibangun dengan **Go 1.26**, **Gin** web framework, **GORM** ORM, **PostgreSQL**, dengan arsitektur **Layered Architecture** (Handler → Service → Repository).

Dua portal: **Customer API** (public + authenticated) dan **Admin API** (authenticated + guarded).

---

## Tech Stack

| Lapisan | Teknologi |
|---|---|
| **Bahasa** | Go 1.26.1 |
| **Web Framework** | Gin v1.12.0 |
| **ORM** | GORM v1.31.1 (driver PostgreSQL) |
| **Database** | PostgreSQL 16+ (custom enums: `order_status`, `payment_status`) |
| **Auth** | golang-jwt v5 (HS256, access + refresh token) |
| **Password** | bcrypt via `golang.org/x/crypto` |
| **Image Upload** | Cloudinary v2 (with mock fallback) |
| **Email** | Resend v2 (with mock fallback) |
| **Background Worker** | Custom pool pattern (`golang.org/x/sync`) |
| **UUID** | google/uuid |
| **Config** | godotenv + os.Getenv |
| **Migrations** | Plain SQL (golang-migrate compatible) |

### Dependencies Kunci (`go.mod`)

```
github.com/gin-gonic/gin v1.12.0
gorm.io/gorm v1.31.1
gorm.io/driver/postgres v1.6.0
github.com/golang-jwt/jwt/v5 v5.3.1
github.com/cloudinary/cloudinary-go/v2 v2.15.0
github.com/resend/resend-go/v2 v2.28.0
github.com/google/uuid v1.6.0
github.com/joho/godotenv v1.5.1
golang.org/x/crypto v0.52.0
golang.org/x/sync v0.20.0
```

---

## Arsitektur: Layered Pattern

```
cmd/main.go
  ↓
internal/config/       → Environment variables (.env)
internal/database/     → GORM connection (pool: 25 max open, 10 idle)
internal/router/       → All route definitions (Gin groups, middleware)
  ↓
internal/handler/      → HTTP layer (request binding, response formatting)
  ↓ (interface)
internal/service/      → Business logic, validation, orchestration
  ↓ (interface)
internal/repository/   → Database access (GORM queries)
  ↓
[PostgreSQL]
```

### Dependency Injection Flow (di `cmd/main.go`)

```
config.Load() → database.Connect(cfg)
  → repository.New*Repository(db)
  → service.New*Service(repo, ...)
  → handler.New*Handler(srv)
  → router.NewRouter(handler...)
  → r.Setup(ginEngine)
  → srv.ListenAndServe()
```

---

## Project Structure Lengkap

```
server/
├── cmd/
│   └── main.go                  # Entry point: init all layers, graceful shutdown
│
├── internal/
│   ├── config/
│   │   └── config.go            # Config struct, Load(), DSN(), helpers
│   │
│   ├── database/
│   │   └── postgres.go          # GORM connection, pool config, Ping
│   │
│   ├── model/                   # GORM models (10 files)
│   │   ├── constants.go         #   OrderStatus, PaymentStatus (typed string consts)
│   │   ├── admin.go             #   Admin { ID, Username, Email, PasswordHash }
│   │   ├── customer.go          #   Customer { ID, FullName, Email, Phone, IsActive, Addresses[] }
│   │   ├── address.go           #   Address { ID, CustomerID, Label, RecipientName, Phone, AddressLine, City, Province, PostalCode, IsDefault }
│   │   ├── category.go          #   Category { ID, Name, Slug, ParentID(*), Children[] } — self-referencing
│   │   ├── product.go           #   Product { ID, CategoryID, Name, Slug, Price, CompareAtPrice, Tags(JSONB), Images[], Variants[] }
│   │   │                       #   ProductImage { ID, ProductID, ImageURL, CloudinaryPublicID(*), IsPrimary, DisplayOrder }
│   │   │                       #   ProductVariant { ID, ProductID, Size, Color, Stock, AdditionalPrice, IsActive }
│   │   │                       #   JSONStringArray — custom type for jsonb []string
│   │   ├── cart.go              #   CartItem { ID, CustomerID, VariantID, Quantity }
│   │   ├── order.go             #   Order { ID, CustomerID, OrderNumber, Status, Subtotal, ShippingFee, Total, PaymentStatus, Items[] }
│   │   │                       #   OrderItem { ID, OrderID, ProductName, VariantSize, VariantColor, Quantity, UnitPrice } — snapshot pattern
│   │   ├── review.go            #   Review { ID, ProductID, CustomerID, OrderID, Rating, Body(*), IsPublished }
│   │   └── wishlist.go          #   WishlistItem { ID, CustomerID, VariantID } — unique(CustomerID+VariantID)
│   │
│   ├── dto/                     # Data Transfer Objects (7 files)
│   │   ├── admin.go             #   AdminLoginRequest, AdminResponse, AdminLoginResponse
│   │   ├── customer.go          #   CustomerRegisterRequest, CustomerLoginRequest, UpdateProfileRequest,
│   │   │                       #   ChangePasswordRequest, AddressRequest, UpdateCustomerStatusRequest,
│   │   │                       #   CustomerResponse, CustomerLoginResponse, CustomerProfileResponse
│   │   ├── product.go           #   CategoryRequest, ProductVariantRequest, AddProductImageUrlRequest,
│   │   │                       #   CategoryTreeResponse (recursive), ProductResponse, ProductDetailResponse,
│   │   │                       #   ProductImageResponse, ProductVariantResponse, ProductReviewResponse
│   │   ├── cart.go              #   AddCartItemRequest, UpdateCartItemQuantityRequest, CartItemResponse, CartResponse
│   │   ├── order.go             #   CheckoutRequest, OrderStatusUpdateRequest, OrderPaymentUpdateRequest,
│   │   │                       #   OrderCheckoutResponse, OrderResponse, OrderDetailResponse,
│   │   │                       #   OrderItemResponse, OrderAddressInfo, AdminOrderResponse
│   │   ├── review.go            #   CreateReviewRequest, ReviewPublishRequest, ReviewResponse, AdminReviewResponse
│   │   └── wishlist.go          #   AddWishlistItemRequest, WishlistItemResponse, WishlistCheckResponse
│   │
│   ├── handler/                 # HTTP handlers (12 files)
│   │   ├── interfaces.go        #   All service interfaces (AdminService, CustomerService, etc.)
│   │   ├── helper.go            #   getCustomerID(), getAdminID(), okJSON(), createdJSON(), errJSON(), validationErrJSON()
│   │   ├── admin.go             #   AdminHandler: Login, Refresh, Logout, GetProfile
│   │   ├── customer.go          #   CustomerHandler: Register, Login, GetProfile, UpdateProfile,
│   │   │                       #   ChangePassword, ListCustomers, GetCustomerDetail, UpdateCustomerStatus
│   │   ├── address.go           #   AddressHandler: CRUD + SetDefault
│   │   ├── category.go          #   CategoryHandler: ListActiveCategories, ListAllCategories, CRUD
│   │   ├── product.go           #   ProductHandler: ListProducts (public), GetBySlug, GetByID,
│   │   │                       #   CreateProduct, UpdateProduct, DeleteProduct, AddProductImages,
│   │   │                       #   AddProductImageUrl, DeleteProductImage, SetPrimaryProductImage,
│   │   │                       #   GetProductVariants, AddVariant, UpdateVariant, DeleteVariant
│   │   ├── cart.go              #   CartHandler: GetCart, AddItem, UpdateQuantity, RemoveItem, ClearCart
│   │   ├── order.go             #   OrderHandler: Checkout, GetCustomerOrders, GetCustomerOrderDetail,
│   │   │                       #   CancelOrder, CompleteOrder, ListAllOrders, GetOrderDetail,
│   │   │                       #   UpdateOrderStatus, UpdateOrderPaymentStatus
│   │   ├── review.go            #   ReviewHandler: SubmitReview, GetProductReviews, ListAllReviews,
│   │   │                       #   UpdateReviewPublishStatus, DeleteReview
│   │   ├── wishlist.go          #   WishlistHandler: GetWishlist, CheckWishlist, AddToWishlist, RemoveFromWishlist
│   │   └── analytics.go         #   AnalyticsHandler: GetOverview, GetOrdersChart
│   │
│   ├── middleware/              # Gin middleware (3 files)
│   │   ├── cors.go              #   Dynamic CORS from ALLOWED_ORIGINS config, preflight 204
│   │   ├── admin_auth.go        #   JWT Bearer validation, AdminClaims{AdminID, TokenType},
│   │   │                       #   401 on invalid/expired, set "admin_id" in context
│   │   └── customer_auth.go     #   JWT Bearer validation, CustomerClaims{CustomerID},
│   │                           #   401 on invalid/expired, set "customer_id" in context
│   │
│   ├── repository/              # Database access (9 files)
│   │   ├── admin.go             #   FindByEmail, FindByID
│   │   ├── customer.go          #   FindByEmail, FindByID, Create, Update, FindAll (paginated + LIKE search),
│   │   │                       #   UpdateStatus, GetStats (aggregate), GetOrderHistory
│   │   ├── address.go           #   FindByID, FindByCustomerID, Create (tx), Update (tx), Delete, SetDefault (tx)
│   │   ├── category.go          #   FindAllActive, FindAll, FindByID, FindBySlug, Create, Update, Delete, GetProductCounts
│   │   ├── product.go           #   FindAll (10 params: CTE for subcategories, EXISTS for sizes,
│   │   │                       #   array @> for tags, ORDER BY sort, pagination),
│   │   │                       #   FindBySlug, FindByID, Create, Update, Delete,
│   │   │                       #   Image CRUD, Variant CRUD (soft-deactivate),
│   │   │                       #   GetReviewStats, GetReviewStat
│   │   ├── cart.go              #   FindByCustomerID (nested Preload), FindItemByID, UpsertItem (ON CONFLICT),
│   │   │                       #   UpdateItemQuantity, RemoveItem, ClearCart
│   │   ├── order.go             #   Create (tx + FOR UPDATE lock + stock decrement + cart clear),
│   │   │                       #   FindByCustomerID (paginated), FindByOrderNumberAndCustomerID,
│   │   │                       #   FindAll (paginated + joins + filters),
│   │   │                       #   FindByID (multi Preload), CancelOrder (tx + restock),
│   │   │                       #   UpdateStatus, UpdatePaymentStatus,
│   │   │                       #   HasCustomerPurchasedProduct (double joins),
│   │   │                       #   IsProductReviewable, GetItemCounts, CompleteOrderTx
│   │   ├── review.go            #   Create, FindByProductID (paginated + Preload Customer),
│   │   │                       #   FindAll (paginated + Preload Customer+Product, optional filters),
│   │   │                       #   FindByID, UpdatePublishStatus, Delete, Exists
│   │   └── wishlist.go          #   FindByCustomerID (nested Preload), Exists, Add, Remove (RowsAffected check)
│   │
│   └── service/                 # Business logic (14 files)
│       ├── interfaces.go        #   All repository interfaces (used by services)
│       ├── background.go        #   BackgroundWorker: pool goroutines, channel queue, graceful shutdown
│       ├── cloudinary.go        #   CloudinaryService: UploadImage, DeleteImage (mock fallback)
│       ├── email.go             #   EmailService: SendOrderConfirmation, SendAdminOrderAlert,
│       │                       #   SendShippingUpdate (fire-and-forget via worker, mock fallback)
│       ├── admin.go             #   adminService: Login (bcrypt + JWT), Refresh, GetAdminByID
│       ├── customer.go          #   customerService: Register, Login, GetProfile, UpdateProfile,
│       │                       #   ChangePassword, ListCustomers (with stats), UpdateCustomerStatus, GetCustomerDetail
│       ├── address.go           #   addressService: CRUD + SetDefault (ownership validation)
│       ├── category.go          #   categoryService: ListActiveCategories (tree builder), CRUD, Delete (with product check)
│       ├── product.go           #   productService: ListProducts (mapping with ratings), CRUD, Image management (Cloudinary),
│       │                       #   Variant management (soft delete), Primary image promotion logic
│       ├── cart.go              #   cartService: GetCart (with price calc), AddItem (stock check + upsert),
│       │                       #   UpdateQuantity (stock check), RemoveItem, ClearCart
│       ├── order.go             #   orderService: Checkout (tx: lock stock → create order → clear cart → email),
│       │                       #   GetCustomerOrders, GetOrderDetail, CancelOrder (tx + restock),
│       │                       #   CompleteOrder, ListAllOrders, UpdateStatus (email on shipped),
│       │                       #   UpdatePaymentStatus, Order number generation
│       ├── review.go            #   reviewService: SubmitReview (multi-step validation), GetProductReviews,
│       │                       #   ListAllReviews, UpdatePublishStatus, Delete
│       ├── wishlist.go          #   wishlistService: GetWishlist (with product/variant info), CheckWishlist,
│       │                       #   AddToWishlist (dedup check), RemoveFromWishlist
│       └── analytics.go         #   analyticsService: GetOverview (4 concurrent queries via errgroup),
│       │                       #   GetOrdersChart (6-month aggregate with TO_CHAR)
│
├── migrations/                  # SQL migrations (golang-migrate format)
│   ├── 000001_core.up/down.sql       # Types: order_status, payment_status; Tables: admins, customers, categories
│   ├── 000002_catalog.up/down.sql    # Tables: products, product_images, product_variants (with indexes)
│   ├── 000003_customer_relations.up/down.sql  # Tables: addresses, cart_items (with unique constraint)
│   ├── 000004_transactions.up/down.sql        # Tables: orders, order_items (with enums, timestamps)
│   ├── 000005_engagement.up/down.sql          # Tables: reviews (unique product+customer+order), wishlist_items (unique customer+variant)
│   └── seed.sql                               # Production seed data (categories, products, variants, images, orders, reviews, customers)
│
├── .env                          # Local env vars (dev defaults)
├── .env.example                  # Template for env vars
├── go.mod
├── go.sum
└── main.exe                      # Compiled binary
```

---

## Database Schema

### Entity Relationship Summary

```
admins ───────────────────────── (standalone auth table)

customers ──── has_many ──── addresses
    │                              (customer_id FK)
    ├── has_many ──── cart_items
    │                     (customer_id FK, variant_id FK → product_variants)
    ├── has_many ──── wishlist_items
    │                     (customer_id FK, variant_id FK → product_variants)
    ├── has_many ──── orders
    │                     (customer_id FK, address_id FK nullable)
    └── has_many ──── reviews
                          (customer_id FK)

categories ──── self_ref ──── categories
    │              (parent_id FK nullable)
    └── has_many ──── products
                         (category_id FK)

products ──── has_many ──── product_images
    │              (product_id FK, CASCADE)
    └── has_many ──── product_variants
                         (product_id FK, CASCADE)

orders ──── has_many ──── order_items
               (order_id FK, variant_id FK nullable)
```

### PostgreSQL Custom Types

```sql
CREATE TYPE order_status AS ENUM (
  'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'
);
CREATE TYPE payment_status AS ENUM (
  'unpaid', 'paid', 'refunded'
);
```

### Key Constraints

| Constraint | Table | Detail |
|---|---|---|
| Unique | `products.slug` | URL-safe identifier |
| Unique | `categories.slug` | URL-safe identifier |
| Unique | `orders.order_number` | Format: `JUICY-YYMMDD-XXXXXX` |
| Unique | `product_variants(product_id, size, color)` | Satu varian per kombinasi |
| Unique | `cart_items(customer_id, variant_id)` | Satu baris per variant di cart |
| Unique | `reviews(product_id, customer_id, order_id)` | Satu review per pembelian |
| Unique | `wishlist_items(customer_id, variant_id)` | No duplicate wishlist |
| Unique | `admins.email`, `admins.username` | Unique login |
| Unique | `customers.email` | Unique registration |
| Check | `products.price >= 0` | No negative price |
| Check | `product_variants.stock >= 0` | No negative stock |
| Check | `cart_items.quantity > 0` | Min 1 item |
| Check | `reviews.rating BETWEEN 1 AND 5` | Valid rating range |
| Delete CASCADE | `product_images.product_id`, `product_variants.product_id` | Cascade delete |
| Delete RESTRICT | `products.category_id`, `orders.customer_id` | Prevent delete if referenced |
| Delete SET NULL | `categories.parent_id`, `orders.address_id`, `order_items.variant_id` | Preserve history |

### Indexes

Partial indexes on `products(is_featured) WHERE is_featured = TRUE`, plus standard indexes on all foreign key columns and `orders(order_number)`, `orders(status)`.

---

## API Routes

### Public (no auth)

| Method | Path | Handler | Description |
|---|---|---|---|
| GET | `/` | inline | Health check `{app, status, version}` |
| POST | `/api/customers/register` | customerHandler.Register | Register new customer |
| POST | `/api/customers/login` | customerHandler.Login | Customer login |
| GET | `/api/shop/categories` | categoryHandler.ListActiveCategories | Active categories tree |
| GET | `/api/shop/products` | productHandler.ListProducts | Product catalog (filtered, paginated) |
| GET | `/api/shop/products/:slug` | productHandler.GetProductBySlug | Product detail by slug |
| GET | `/api/shop/products/:slug/reviews` | reviewHandler.GetProductReviews | Published reviews |
| POST | `/api/admin/login` | adminHandler.Login | Admin login |
| POST | `/api/admin/refresh` | adminHandler.Refresh | Admin token refresh |
| POST | `/api/admin/logout` | adminHandler.Logout | Admin logout |

### Customer Auth (JWT Bearer)

| Method | Path | Handler |
|---|---|---|
| GET | `/api/customers/profile` | customerHandler.GetProfile |
| PUT | `/api/customers/profile` | customerHandler.UpdateProfile |
| PUT | `/api/customers/profile/password` | customerHandler.ChangePassword |
| GET | `/api/addresses` | addressHandler.GetAddresses |
| GET | `/api/addresses/:id` | addressHandler.GetAddressByID |
| POST | `/api/addresses` | addressHandler.CreateAddress |
| PUT | `/api/addresses/:id` | addressHandler.UpdateAddress |
| DELETE | `/api/addresses/:id` | addressHandler.DeleteAddress |
| PUT | `/api/addresses/:id/default` | addressHandler.SetDefaultAddress |
| GET | `/api/cart` | cartHandler.GetCart |
| POST | `/api/cart/items` | cartHandler.AddCartItem |
| PUT | `/api/cart/items/:id` | cartHandler.UpdateCartItemQuantity |
| DELETE | `/api/cart/items/:id` | cartHandler.RemoveCartItem |
| DELETE | `/api/cart` | cartHandler.ClearCart |
| POST | `/api/orders/checkout` | orderHandler.Checkout |
| GET | `/api/orders` | orderHandler.GetCustomerOrders |
| GET | `/api/orders/:orderNumber` | orderHandler.GetCustomerOrderDetail |
| POST | `/api/orders/:orderNumber/cancel` | orderHandler.CancelOrder |
| POST | `/api/orders/:orderNumber/complete` | orderHandler.CompleteOrder |
| GET | `/api/wishlist` | wishlistHandler.GetWishlist |
| GET | `/api/wishlist/check/:variantId` | wishlistHandler.CheckWishlist |
| POST | `/api/wishlist/items` | wishlistHandler.AddToWishlist |
| DELETE | `/api/wishlist/items/:variantId` | wishlistHandler.RemoveFromWishlist |
| POST | `/api/reviews` | reviewHandler.SubmitReview |

### Admin Auth (JWT Bearer)

| Method | Path | Handler |
|---|---|---|
| GET | `/api/admin/profile` | adminHandler.GetProfile |
| GET | `/api/admin/customers` | customerHandler.ListCustomers |
| GET | `/api/admin/customers/:id` | customerHandler.GetCustomerDetail |
| PATCH | `/api/admin/customers/:id/status` | customerHandler.UpdateCustomerStatus |
| GET | `/api/admin/categories` | categoryHandler.ListAllCategories |
| GET | `/api/admin/categories/:id` | categoryHandler.GetCategoryByID |
| POST | `/api/admin/categories` | categoryHandler.CreateCategory |
| PUT | `/api/admin/categories/:id` | categoryHandler.UpdateCategory |
| DELETE | `/api/admin/categories/:id` | categoryHandler.DeleteCategory |
| GET | `/api/admin/products` | productHandler.ListProducts |
| GET | `/api/admin/products/:id` | productHandler.GetProductByID |
| POST | `/api/admin/products` | productHandler.CreateProduct |
| PUT | `/api/admin/products/:id` | productHandler.UpdateProduct |
| DELETE | `/api/admin/products/:id` | productHandler.DeleteProduct |
| POST | `/api/admin/products/:id/images` | productHandler.AddProductImages |
| POST | `/api/admin/products/:id/images/url` | productHandler.AddProductImageUrl |
| DELETE | `/api/admin/products/:id/images/:imageId` | productHandler.DeleteProductImage |
| PUT | `/api/admin/products/:id/images/:imageId/primary` | productHandler.SetPrimaryProductImage |
| GET | `/api/admin/products/:id/variants` | productHandler.GetProductVariants |
| POST | `/api/admin/products/:id/variants` | productHandler.AddProductVariant |
| PUT | `/api/admin/products/:id/variants/:variantId` | productHandler.UpdateProductVariant |
| DELETE | `/api/admin/products/:id/variants/:variantId` | productHandler.DeleteProductVariant |
| GET | `/api/admin/orders` | orderHandler.ListAllOrders |
| GET | `/api/admin/orders/:id` | orderHandler.GetOrderDetail |
| PUT | `/api/admin/orders/:id/status` | orderHandler.UpdateOrderStatus |
| PUT | `/api/admin/orders/:id/payment` | orderHandler.UpdateOrderPaymentStatus |
| GET | `/api/admin/reviews` | reviewHandler.ListAllReviews |
| PUT | `/api/admin/reviews/:id/publish` | reviewHandler.UpdateReviewPublishStatus |
| DELETE | `/api/admin/reviews/:id` | reviewHandler.DeleteReview |
| GET | `/api/admin/analytics/overview` | analyticsHandler.GetOverview |
| GET | `/api/admin/analytics/orders/chart` | analyticsHandler.GetOrdersChart |

---

## Response Envelope

Semua response menggunakan format seragam:

```go
// Success
{ "success": true, "data": T }
{ "success": true, "data": [], "meta": { "page": 1, "per_page": 10, "total": 100, "total_pages": 10 } }
{ "success": true, "message": "..." }

// Error
{ "success": false, "error": { "message": "...", "code": "ERROR_CODE" } }
{ "success": false, "error": { "message": "Validation error", "code": "VALIDATION_ERROR", "details": "..." } }
```

### HTTP Status Codes

| Status | Usage |
|---|---|
| 200 | Success (GET, PUT, DELETE, POST dengan data) |
| 201 | Created (POST register, checkout, review, category, product, variant) |
| 204 | OPTIONS preflight (CORS) |
| 400 | Invalid UUID in path param |
| 401 | Missing/invalid/expired token, wrong credentials |
| 403 | User inactive, order not delivered, not purchased |
| 404 | Resource not found (product, category, order, address, review, variant) |
| 409 | Conflict: email taken, insufficient stock, category has products, already reviewed, wishlist exists, cannot cancel order |
| 422 | Validation error (binding tags) |
| 500 | Internal server error |

### Error Code Strings

`UNAUTHORIZED`, `VALIDATION_ERROR`, `INVALID_CREDENTIALS`, `EMAIL_TAKEN`, `USER_INACTIVE`,
`PRODUCT_NOT_FOUND`, `CATEGORY_NOT_FOUND`, `CATEGORY_HAS_PRODUCTS`, `IMAGE_NOT_FOUND`,
`VARIANT_NOT_FOUND`, `ADDRESS_NOT_FOUND`, `ORDER_NOT_FOUND`, `REVIEW_NOT_FOUND`,
`CART_EMPTY`, `INSUFFICIENT_STOCK`, `OUT_OF_STOCK`, `CANNOT_CANCEL_ORDER`,
`ALREADY_REVIEWED`, `ORDER_NOT_DELIVERED`, `NOT_PURCHASED`, `ALREADY_IN_WISHLIST`,
`WRONG_PASSWORD`

---

## Arsitektur Detail

### Config Layer (`config.go`)

```go
type Config struct {
    AppPort, AppEnv string
    DBHost, DBPort, DBName, DBUser, DBPassword, DBSSLMode, DatabaseURL string
    JWTAdminSecret, JWTAdminAccessExpiryMinutes, JWTAdminRefreshExpiryDays  // admin JWT
    JWTCustomerSecret, JWTCustomerExpiryDays  // customer JWT
    CloudinaryCloudName, CloudinaryAPIKey, CloudinaryAPISecret, CloudinaryUploadFolder
    ResendAPIKey, ResendFromEmail, AdminAlertEmail
    AllowedOrigins string  // comma-separated CORS origins
    DefaultShippingFee float64  // default: 25000
}
```

- `Load()` baca `.env`, require `JWT_ADMIN_SECRET` dan `JWT_CUSTOMER_SECRET`
- `DSN()`: prioritize `DATABASE_URL`, fallback ke parameter individual
- `IsDevelopment()`: cek `AppEnv == "development"`

### Middleware

**CORS** (`middleware/cors.go`):
- Parse comma-separated `ALLOWED_ORIGINS` → per-request origin matching
- Set `Access-Control-Allow-Origin` (echo), `Allow-Credentials: true`
- Static `Allow-Headers` dan `Allow-Methods`
- Preflight `OPTIONS` → 204 No Content

**AdminAuth** (`middleware/admin_auth.go`):
- Parse `Bearer <token>` dari Authorization header
- `jwt.ParseWithClaims` → `AdminClaims{AdminID, TokenType}` dengan `JWTAdminSecret`
- Verifikasi `TokenType == "access"` (mencegah refresh token sebagai access)
- Set `c.Set("admin_id", uuid.UUID)` untuk downstream handlers
- 401 untuk semua error (missing, invalid, expired, wrong type)

**CustomerAuth** (`middleware/customer_auth.go`):
- Sama seperti AdminAuth tapi dengan `CustomerClaims{CustomerID}` dan `JWTCustomerSecret`
- **Tidak ada** pengecekan `TokenType` (access/refresh bisa dipakai untuk akses)
- Set `c.Set("customer_id", uuid.UUID)`

### Handler Layer

- Setiap handler menerima `service interface` via constructor
- `helper.go` menyediakan: `getCustomerID(ctx)`, `getAdminID(ctx)`, `okJSON()`, `createdJSON()`, `errJSON()`, `validationErrJSON()`
- Input binding: `c.ShouldBindJSON(&dto.SomeRequest)` dengan Gin binding tags
- Error mapping: `errors.Is(err, service.ErrXxx)` → HTTP status code
- Pagination meta dihitung di level handler: `totalPages = ceil(total / perPage)`
- Response selalu `{"success": bool, "data": ...}` atau `{"success": false, "error": {...}}`

### Service Layer

- Struct **private** (`adminService`, `customerService`, etc), constructor public
- **Sentinel errors**: variabel `var ErrXxx = errors.New("...")` di package service
- Business logic validation sebelum delegasi ke repository
- JWT token generation: `HS256` via `golang-jwt/jwt/v5`
- Cloudinary & Email: graceful **mock fallback** saat credential tidak dikonfigurasi
- Order email: **fire-and-forget** via `BackgroundWorker.Submit()`
- Concurrent analytics: `errgroup` (4 goroutines parallel)

### Repository Layer

- Struct **private** (`adminRepo`, `customerRepo`, etc), constructor public
- **Context propagation**: semua method menerima `context.Context` → `.WithContext(ctx)`
- **Pagination pattern**: `.Count()` → total, lalu `.Offset().Limit().Order().Find()`
- **Preload pattern**: nested Preload untuk eager loading (cart: `Variant.Product.Images`)
- **Transaction pattern**: `db.Transaction(func(tx *gorm.DB) error { ... })` di address (set default), order (checkout, cancel), product (set primary image)
- **Locking**: `clause.Locking{Strength: "UPDATE"}` (pessimistic FOR UPDATE) di order checkout
- **Upsert**: `clause.OnConflict` di cart upsert dengan `gorm.Expr` untuk quantity increment
- **Raw SQL**: `WITH RECURSIVE` untuk subkategori CTE, `@>` untuk array tag, `TO_CHAR` untuk monthly chart
- **Soft delete**: `Update("is_active", false)` untuk variant (bukan hard delete)
- **Aggregate ke map**: `Scan` ke struct → map `[uuid.UUID]Result` untuk stats

### Background Worker (`service/background.go`)

```
NewBackgroundWorker(ctx, poolSize, queueSize)
  → spawns poolSize goroutines
  → each worker: select { ctx.Done(), <-tasks }
  → Submit(task) non-blocking via select { case tasks <- task }
  → Shutdown(): cancel context → close channel → Wait() all workers
  → Panic recovery per task execution
  → Sentinel error: ErrWorkerPoolClosed
```

---

## Autentikasi & JWT

### Admin JWT

| Claim | Value |
|---|---|
| AdminID | string UUID |
| TokenType | "access" atau "refresh" |
| Access expiry | configurable (default 15 menit) |
| Refresh expiry | configurable (default 7 hari) |
| Refresh token | Disimpan di HttpOnly cookie (`refresh_token`), dikirim via `/admin/refresh` |
| Refresh flow | Axios interceptor queue → POST /admin/refresh → set new cookie + return new access token |

### Customer JWT

| Claim | Value |
|---|---|
| CustomerID | string UUID |
| TokenType | **tidak ada** — hanya RegisteredClaims |
| Expiry | configurable (default 7 hari) |
| No refresh token | customer token langsung expired, user harus login ulang |

---

## Business Logic Rules

### Checkout Flow
```
POST /api/orders/checkout
 1. Validasi address ownership
 2. Validasi cart tidak kosong
 3. BEGIN TRANSACTION
 4.   FOR UPDATE lock variants
 5.   Untuk setiap item: validasi stock >= quantity
 6.   Kurangi stock (UPDATE stock = stock - quantity)
 7.   Generate order number: JUICY-YYMMDD-XXXXXX (crypto/rand)
 8.   Hitung subtotal, shipping fee (config), total
 9.   Create Order + OrderItems (snapshot product data)
10.   Hapus semua cart items
11. COMMIT
12. Background: send order confirmation email + admin alert
```

### Order Lifecycle
```
Customer                     Admin
  │                           │
  │── pending ───────────────►│
  │                           ├── confirmed
  │                           ├── processing
  │                           ├── shipped (email notification)
  │◄── shipped ──────────────│
  ├── delivered (confirm)     │
  └── cancelled (if pending)  │
  │                           │
```

### Cancel Order (by Customer)
- Hanya bisa cancel jika status `pending` atau `confirmed`
- Transaction: update status → restock (UPDATE stock = stock + quantity)

### Review Validation
- Product harus exist
- Order harus milik customer yang sama
- Order status harus `delivered`
- Product harus ada di order tersebut (`IsProductReviewable`)
- Belum pernah review kombinasi `(customer, product, order)`

### Category Tree Building
```
ListActiveCategories:
 1. Fetch all active categories
 2. Get product counts (GROUP BY category_id)
 3. Pisahkan root nodes (parent_id IS NULL) dan child nodes
 4. buildNode(root): recursive attach children
 5. Akumulasi product_count dari children ke parent
```

### Product Filtering
```
GET /api/shop/products?category=&featured=&tag=&sort=&sizes=&search=&page=&per_page=
 1. Start with is_available = true (public)
 2. If category: CTE recursive untuk include subcategories
 3. If sizes: EXISTS subquery ke product_variants
 4. If tag: PostgreSQL array @> operator
 5. If search: LIKE pada name
 6. Preload Category, Images, Variants
 7. Sort: price_asc, price_desc, newest, popular (by avg rating)
 8. Pagination with Count
```

### Price Calculation (Cart)
```
unitPrice = product.price + variant.additional_price
subtotal = unitPrice * quantity
cart.total = SUM(subtotals)
```

### Order Number Generation
```go
format: "JUICY-" + YYMMDD + "-" + 6 random uppercase alphanumeric
example: "JUICY-260528-UO85BU"
source: crypto/rand (fallback ke math/rand time-based jika crypto gagal)
```

---

## Environment Variables

| Variable | Default | Required | Description |
|---|---|---|---|
| `APP_PORT` | `8080` | No | Server port |
| `APP_ENV` | `development` | No | `development` atau `production` |
| `DB_HOST` | `localhost` | No | PostgreSQL host |
| `DB_PORT` | `5432` | No | PostgreSQL port |
| `DB_NAME` | `juicy` | No | Database name |
| `DB_USER` | `postgres` | No | Database user |
| `DB_PASSWORD` | `postgres` | No | Database password |
| `DB_SSLMODE` | `disable` | No | PostgreSQL SSL mode |
| `DATABASE_URL` | (empty) | No | Full DSN (overrides individual params) |
| `JWT_ADMIN_SECRET` | (empty) | **Yes** | HMAC key for admin JWT |
| `JWT_ADMIN_ACCESS_EXPIRY_MINUTES` | `15` | No | Admin access token expiry |
| `JWT_ADMIN_REFRESH_EXPIRY_DAYS` | `7` | No | Admin refresh token expiry |
| `JWT_CUSTOMER_SECRET` | (empty) | **Yes** | HMAC key for customer JWT |
| `JWT_CUSTOMER_EXPIRY_DAYS` | `7` | No | Customer token expiry |
| `CLOUDINARY_CLOUD_NAME` | (empty) | No | Cloudinary (mock fallback if empty) |
| `CLOUDINARY_API_KEY` | (empty) | No | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | (empty) | No | Cloudinary API secret |
| `CLOUDINARY_UPLOAD_FOLDER` | `juicy` | No | Cloudinary folder |
| `RESEND_API_KEY` | (empty) | No | Resend email API (mock fallback if empty) |
| `RESEND_FROM_EMAIL` | `noreply@juicy.com` | No | Sender email |
| `ADMIN_ALERT_EMAIL` | `admin@juicy.com` | No | Admin notification email |
| `ALLOWED_ORIGINS` | `http://localhost:5173` | No | Comma-separated CORS origins |
| `DEFAULT_SHIPPING_FEE` | `25000` | No | Default shipping fee |

---

## Coding Conventions

### Error Handling Pattern
```go
// Sentinel errors (package-level var)
var ErrProductNotFound = errors.New("product not found")

// Service: return sentinel
if product == nil {
    return nil, ErrProductNotFound
}

// Handler: map sentinel → HTTP status
if errors.Is(err, service.ErrProductNotFound) {
    errJSON(c, http.StatusNotFound, "Product not found", "PRODUCT_NOT_FOUND")
    return
}
```

### Service Interface Pattern
```go
// interfaces.go — repository interfaces
type ProductRepository interface {
    FindAll(ctx context.Context, ...) ([]model.Product, int64, error)
    FindBySlug(ctx context.Context, slug string) (*model.Product, error)
    Create(ctx context.Context, product *model.Product) error
    // ...
}

// handler/interfaces.go — service interfaces
type ProductService interface {
    ListProducts(ctx context.Context, ...) ([]dto.ProductResponse, int64, error)
    GetProductBySlug(ctx context.Context, slug string) (*dto.ProductDetailResponse, error)
    // ...
}
```

### Constructor Pattern
```go
type productService struct {
    repo              ProductRepository
    cloudinaryService *CloudinaryService
    db                *gorm.DB
}

func NewProductService(repo ProductRepository, cloudinaryService *CloudinaryService, db *gorm.DB) *productService {
    return &productService{repo: repo, cloudinaryService: cloudinaryService, db: db}
}
```

### Transaction Pattern
```go
func (r *addressRepo) Create(ctx context.Context, address *model.Address) error {
    return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
        if address.IsDefault {
            if err := tx.Model(&model.Address{}).
                Where("customer_id = ?", address.CustomerID).
                Update("is_default", false).Error; err != nil {
                return err
            }
        }
        return tx.Create(address).Error
    })
}
```

### Pagination Response
```go
func (h *CustomerHandler) ListCustomers(c *gin.Context) {
    page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
    perPage, _ := strconv.Atoi(c.DefaultQuery("per_page", "10"))
    search := c.Query("search")

    customers, total, err := h.srv.ListCustomers(c.Request.Context(), page, perPage, search)
    if err != nil {
        errJSON(c, http.StatusInternalServerError, "Failed to load customers", "INTERNAL_ERROR")
        return
    }

    totalPages := int(math.Ceil(float64(total) / float64(perPage)))
    okJSON(c, gin.H{
        "items": customers,
        "meta": gin.H{
            "page":        page,
            "per_page":    perPage,
            "total":       total,
            "total_pages": totalPages,
        },
    })
}
```

### Ownership Validation Pattern
```go
func (s *addressService) GetAddressByID(ctx context.Context, id, customerID uuid.UUID) (*model.Address, error) {
    addr, err := s.repo.FindByID(ctx, id)
    if err != nil {
        return nil, ErrAddressNotFound
    }
    if addr.CustomerID != customerID {
        return nil, ErrAddressNotFound  // don't leak ownership info
    }
    return addr, nil
}
```

### JSON Response Helpers
```go
okJSON(c, data)          // 200: {"success":true, "data": data}
createdJSON(c, data)     // 201: {"success":true, "data": data}
okMessageJSON(c, msg)    // 200: {"success":true, "message": msg}
errJSON(c, status, msg, code)   // {"success":false, "error":{message, code}}
validationErrJSON(c, details)   // 422: {"success":false, "error":{..., details}}
```

---

## Migration Files

Format: `golang-migrate` compatible (sequential numbering + `up`/`down`).

| Migration | Tables Created | Key Details |
|---|---|---|
| `000001_core` | `admins`, `customers`, `categories` | Custom types: `order_status`, `payment_status` |
| `000002_catalog` | `products`, `product_images`, `product_variants` | JSONB tags, composite unique index variants |
| `000003_customer_relations` | `addresses`, `cart_items` | Unique(customer, variant), CASCADE deletes |
| `000004_transactions` | `orders`, `order_items` | Snapshot pattern, enum types, nullable variant_id |
| `000005_engagement` | `reviews`, `wishlist_items` | Unique constraints, indexes |

`seed.sql` — Production data: 1 admin, 2 customers, 19 categories (4-level tree), 16 products, ~50 variants, ~50 product images, 10 orders with items, 3 reviews.

---

## Catatan Penting

- **No DI container**: Semua dependency injection manual di `main.go` — constructor chain
- **No migration tool built-in**: Migrations tidak di-run oleh aplikasi, perlu dijalankan manual atau via `golang-migrate`
- **CustomerAuth tidak validasi TokenType**: Refresh token customer bisa jadi access token (beda dengan admin yang punya guard `TokenType == "access"`)
- **Email & Cloudinary** punya **mock fallback**: Jika credential tidak diset, service log ke stdout dan return placeholder — tidak fail
- **Order email fire-and-forget**: Error email tidak mempengaruhi response order — hanya di-log
- **Price calculation di cart**: `unitPrice = product.price + variant.additional_price` — dihitung per request, tidak disimpan di cart
- **Order item snapshot**: Product name, variant, price di-copy ke `order_items` saat checkout — perubahan data produk setelahnya tidak mengubah histori
- **Variant soft delete**: Tidak dihapus, hanya `is_active = false` — menjaga integritas referensi order_items
- **No Soft Delete untuk model lain**: Product, Category, dll di-hard-delete
- **Pool connection**: 25 max open, 10 max idle — via GORM `sql.DB` config
- **`gorm.SkipDefaultTransaction: true`**: Mencegah GORM membungkus query tunggal dalam transaction (kecuali explicit `Transaction()`)
