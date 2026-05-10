# ARCHITECTURE.md — Juicy
> Folder structure, data flow, and system design decisions.

---

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT (React)                      │
│  Public Site + Customer Auth  │  Admin Dashboard        │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP/JSON (REST)
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  SERVER (Golang Gin)                    │
│  Handlers → Services → Repositories                    │
└──────────┬─────────────────────┬───────────────────────┘
           │                     │
           ▼                     ▼
    ┌─────────────┐      ┌──────────────┐
    │  PostgreSQL │      │  Cloudinary  │
    │  (Railway)  │      │  (Images)    │
    └─────────────┘      └──────────────┘

           │ Email
           ▼
    ┌─────────────┐
    │   Resend    │
    └─────────────┘
```

---

## Frontend Structure

Struktur frontend menggunakan pendekatan **hybrid domain-based**: setiap domain/fitur besar punya folder sendiri di dalam `features/`, sementara shared UI, layout, dan utilities tetap di folder top-level (`components/`, `lib/`, `hooks/`).

```
client/
├── public/
├── src/
│   │
│   ├── features/                         # Domain-based feature folders
│   │   │
│   │   ├── home/                         # Landing page (Zalora-style multi-section)
│   │   │   ├── components/
│   │   │   │   ├── HeroSection.tsx           # Hero banner utama dengan CTA
│   │   │   │   ├── FeaturedSection.tsx       # Grid produk featured/bestseller
│   │   │   │   ├── CollectionPreview.tsx     # Preview koleksi dengan link ke /shop
│   │   │   │   ├── RecentlyViewedSection.tsx # Produk yg pernah dilihat (localStorage)
│   │   │   │   ├── EditorialSection.tsx      # Editorial/lookbook imagery section
│   │   │   │   ├── CtaSection.tsx            # Call-to-action banner bawah halaman
│   │   │   │   ├── PromoStrip.tsx            # [10.2] Full-width promo/flash sale banner
│   │   │   │   ├── StyleDirectory.tsx        # [10.2] Grid kategori besar ala Zalora
│   │   │   │   ├── NewArrivals.tsx           # [10.2] Produk terbaru grid
│   │   │   │   ├── BrandSpotlight.tsx        # [10.2] Editorial brand story
│   │   │   │   ├── WhyJuicy.tsx              # [10.2] Value propositions
│   │   │   │   ├── NewsletterSection.tsx     # [10.2] Email signup CTA
│   │   │   │   ├── InstagramFeed.tsx         # [10.2] Social media grid
│   │   │   │   └── TrendingNow.tsx           # [10.2] Trending/populer products
│   │   │   └── HomePage.tsx              # Page component — compose semua sections
│   │   │
│   │   ├── category/                     # [10.3] Category landing pages
│   │   │   ├── components/
│   │   │   │   ├── CategoryHero.tsx          # Hero banner + judul + deskripsi
│   │   │   │   ├── SubcategoryGrid.tsx       # Grid subkategori (jika ada)
│   │   │   │   ├── CategoryProducts.tsx      # Featured products dari kategori ini
│   │   │   │   ├── CategoryPromoBanner.tsx   # Promo banner spesifik kategori
│   │   │   │   └── CategoryInfo.tsx          # SEO-friendly deskripsi / size guide
│   │   │   └── CategoryLandingPage.tsx       # /category/:slug — full landing page
│   │   │
│   │   ├── shop/                         # Catalog + Product Detail
│   │   │   ├── components/
│   │   │   │   ├── ProductCard.tsx           # Card produk: gambar, nama, harga, badge
│   │   │   │   ├── ProductGrid.tsx           # Grid layout untuk list produk
│   │   │   │   ├── ProductFilters.tsx        # Filter sidebar: kategori, sort + [PLANNED: subcategory tree, size filter, product count]
│   │   │   │   ├── ProductImageGallery.tsx   # Main image + thumbnail strip
│   │   │   │   ├── VariantSelector.tsx       # Size pills + color swatches; OOS state
│   │   │   │   ├── AddToCartButton.tsx       # Button dengan stock check + loading state
│   │   │   │   ├── ProductInfo.tsx           # Nama, harga, compare_at_price, tags, desc
│   │   │   │   ├── ReviewsSection.tsx        # Review list + pagination di PDP
│   │   │   │   ├── ReviewCard.tsx            # Satu review: avatar, rating, body, date
│   │   │   │   └── StarRating.tsx            # Reusable — display mode + interactive mode
│   │   │   │   ├── SizeFilter.tsx            # [PLANNED] Multi-select size pills (XS–XXL)
│   │   │   │   └── GridToggle.tsx            # [PLANNED] Toggle 2-column / 4-column grid view
│   │   │   ├── types.ts                      # ProductFilters, SortOption, GalleryImage
│   │   │   ├── CollectionPage.tsx            # /shop — grid + filter + sort + pagination [PLANNED: infinite scroll, grid toggle]
│   │   │   └── ProductPage.tsx               # /shop/:slug — PDP lengkap
│   │   │
│   │   ├── cart/                         # Cart
│   │   │   ├── components/
│   │   │   │   ├── CartItem.tsx          # Row: gambar, nama, variant, qty stepper, hapus
│   │   │   │   ├── CartSummary.tsx       # Sidebar: subtotal, shipping placeholder, total
│   │   │   │   └── EmptyCart.tsx         # Empty state dengan CTA ke /shop
│   │   │   └── CartPage.tsx              # /cart — hanya untuk authenticated customer
│   │   │
│   │   ├── checkout/                     # Checkout flow
│   │   │   ├── components/
│   │   │   │   ├── AddressSelector.tsx   # Pilih dari saved addresses atau tambah baru
│   │   │   │   ├── AddressForm.tsx       # Inline form tambah/edit address
│   │   │   │   ├── OrderSummary.tsx      # Read-only ringkasan item + harga
│   │   │   │   └── PaymentSelector.tsx   # Payment method selector (COD untuk MVP)
│   │   │   ├── types.ts                  # CheckoutFormValues, AddressFormValues
│   │   │   └── CheckoutPage.tsx          # /checkout — protected route
│   │   │
│   │   ├── orders/                       # Order tracking + history
│   │   │   ├── components/
│   │   │   │   ├── OrderStatusTimeline.tsx   # Step indicator: Pending→Confirmed→...→Delivered
│   │   │   │   ├── OrderItemRow.tsx           # Baris item: gambar, nama, variant, harga
│   │   │   │   ├── OrderCard.tsx              # Card ringkasan order di list history
│   │   │   │   └── WriteReviewCta.tsx         # CTA review untuk item yang sudah delivered
│   │   │   ├── types.ts                       # OrderTimelineStep, OrderStatusDisplay
│   │   │   ├── OrderTrackingPage.tsx          # /orders/:orderNumber — detail + timeline
│   │   │   └── OrderHistoryPage.tsx           # /orders — list semua order customer
│   │   │
│   │   ├── auth/                         # Customer authentication
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx         # Email + password form dengan Zod validation
│   │   │   │   └── RegisterForm.tsx      # Nama, email, password, konfirmasi password
│   │   │   ├── types.ts                  # LoginFormValues, RegisterFormValues
│   │   │   ├── LoginPage.tsx             # /login
│   │   │   └── RegisterPage.tsx          # /register
│   │   │
│   │   ├── profile/                      # Customer profile management
│   │   │   ├── components/
│   │   │   │   ├── EditProfileForm.tsx       # Form edit nama + nomor telepon
│   │   │   │   ├── ChangePasswordForm.tsx    # Form ganti password (old + new + confirm)
│   │   │   │   ├── AddressList.tsx           # List semua address customer
│   │   │   │   ├── AddressCard.tsx           # Card address: label, detail, badge default, actions
│   │   │   │   └── AddressFormModal.tsx      # Modal tambah/edit address
│   │   │   ├── types.ts                      # EditProfileValues, ChangePasswordValues, AddressFormValues
│   │   │   └── ProfilePage.tsx               # /profile — tabs: Info, Password, Alamat
│   │   │
│   │   └── admin/                        # Admin dashboard (Phase 3 — refactored to clean architecture)
│   │       ├── types.ts                 # Admin-specific form values & derived types (ProductFormValues, VariantFormValues, CategoryFormValues, LoginFormValues, ClientStatistics)
│   │       ├── validations.ts           # Centralized Zod schemas (productSchema, variantSchema, categorySchema, loginSchema)
│   │       ├── hooks/
│   │       │   ├── useDataTableFilter.ts # Generic deferred search + filter hook
│   │       │   ├── useProducts.ts        # Product + category CRUD, form state, modal management
│   │       │   ├── useVariants.ts        # Variant add/delete operations per product
│   │       │   ├── useProductImages.ts   # Image upload, set-primary, delete operations
│   │       │   ├── useOrders.ts          # Orders list, detail loading, status/payment updates
│   │       │   ├── useCustomers.ts       # Customer CRM: list, detail, toggle status
│   │       │   └── useReviews.ts         # Review moderation: list, toggle publish, delete
│   │       ├── components/
│   │       │   ├── AdminRoute.tsx        # Route guard — redirect ke /admin/login
│   │       │   ├── PageHeader.tsx        # Reusable page header with title, description, action slot
│   │       │   ├── DataEmpty.tsx         # Standardized empty state for tables and cards
│   │       │   ├── DefferedContainer.tsx # Container for deferred transitions (opacity stale state)
│   │       │   ├── FullPageSpinner.tsx   # Reusable full-page loading spinner
│   │       │   ├── SearchInput.tsx       # Search input with icon prefix
│   │       │   ├── ProductFormDialog.tsx # Product create/edit dialog (presentational)
│   │       │   ├── VariantManagerDialog.tsx # Variant management dialog (presentational)
│   │       │   └── ImageManagerDialog.tsx  # Image upload/management dialog (presentational)
│   │       ├── LoginPage.tsx             # /admin/login — imports schema from validations.ts
│   │       ├── DashboardPage.tsx         # /admin/dashboard — Card + Recharts (CSS vars)
│   │       ├── ProductsPage.tsx          # /admin/products — thin orchestrator using useProducts + useVariants + useProductImages hooks
│   │       ├── OrdersPage.tsx            # /admin/orders — thin orchestrator using useOrders hook
│   │       ├── CustomersPage.tsx         # /admin/customers — thin orchestrator using useCustomers hook
│   │       └── ReviewsPage.tsx           # /admin/reviews — thin orchestrator using useReviews hook
│   │
│   ├── components/                       # Shared UI — dipakai lintas feature
│   │   ├── ui/                           # shadcn/ui primitives (auto-generated via CLI)
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   └── ...other
│   │   ├── layout/
│   │   │   ├── Navbar.tsx                # Public nav: logo + search + category ribbon [10.1] + cart + wishlist + auth dropdown
│   │   │   ├── Footer.tsx
│   │   │   └── AdminLayout.tsx           # Sidebar + Header wrapper untuk admin
│   │   └── common/
│   │       ├── ProtectedRoute.tsx        # Customer route guard — cek customerAuthStore
│   │       ├── LoadingSkeleton.tsx       # Generic skeleton placeholder
│   │       ├── EmptyState.tsx            # Generic empty state: icon + message + optional CTA
│   │       └── ErrorMessage.tsx          # Generic error display dengan retry button
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts                 # Admin Axios instance + JWT interceptor + refresh logic
│   │   │   ├── customerClient.ts         # Customer Axios instance + JWT interceptor + auto-logout on 401
│   │   │   ├── admin.ts                  # Semua admin API calls: auth, products, orders, customers, analytics
│   │   │   ├── products.ts               # Public shop API: getProducts, getProductBySlug, getCategories
│   │   │   ├── customer.ts               # Customer API: auth, profile, addresses, cart, orders, reviews
│   │   │   └── index.ts                  # Re-exports semua API modules
│   │   └── utils/
│   │       ├── cn.ts                     # cn() helper — clsx + tailwind-merge
│   │       ├── format.ts                 # formatPrice (Rupiah), formatDate, formatOrderNumber
│   │       └── status.ts                 # getOrderStatusLabel, getOrderStatusColor, getPaymentStatusLabel
│   │
│   ├── stores/                           # Zustand global stores
│   │   ├── adminAuthStore.ts             # Admin JWT access token + admin profile
│   │   ├── customerAuthStore.ts          # Customer JWT token + customer profile + addresses
│   │   ├── cartStore.ts                  # Cart items, fetchCart, addItem, updateQty, removeItem, clearCart
│   │   ├── orderStore.ts                 # Orders list, currentOrder, placeOrder, fetchOrders, fetchByOrderNumber
│   │   ├── productStore.ts               # Products list, categories, filters, fetchProducts, fetchProductBySlug
│   │   └── reviewStore.ts                # Reviews per product, submitReview, fetchReviews
│   │
│   ├── hooks/                            # Custom hooks — per concern
│   │   ├── useAuth.ts                    # Shortcut ke customerAuthStore: isLoggedIn, customer, logout
│   │   ├── useCart.ts                    # Shortcut ke cartStore + computed values: itemCount, totalPrice
│   │   ├── useProduct.ts                 # Fetch + state management untuk single product / list
│   │   └── useOrder.ts                   # Fetch order by orderNumber, status helpers
│   │
│   ├── types/
│   │   └── index.ts                      # Shared global types: ApiResponse<T>, PaginatedResponse<T>, semua backend DTO interfaces (Product, Order, Customer, Review, CartItem, Address, dll)
│   │
│   ├── constants/
│   │   ├── routes.ts                     # Typed route paths: ROUTES.shop, ROUTES.cart, ROUTES.orders, dll
│   │   └── orderStatus.ts                # ORDER_STATUS enum values, label map, color map
│   │
│   ├── provider/
│   │   └── theme-provider.tsx            # shadcn theme provider (light/dark)
│   │
│   ├── App.tsx                           # Router setup — semua route definitions
│   ├── main.tsx                          # Entry point — mount App + providers
│   └── index.css                         # Tailwind v4 @theme, shadcn CSS variables, accent terracotta #b5633a
│
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Backend Structure

```
server/
├── cmd/
│   └── main.go
├── internal/
│   ├── config/
│   │   └── config.go
│   ├── database/
│   │   └── postgres.go
│   ├── handler/
│   │   ├── interfaces.go
│   │   ├── admin.go
│   │   ├── customer.go
│   │   ├── product.go
│   │   ├── category.go
│   │   ├── cart.go
│   │   ├── order.go
│   │   ├── review.go
│   │   ├── wishlist.go
│   │   └── analytics.go
│   ├── service/
│   │   ├── interfaces.go
│   │   ├── background.go
│   │   ├── admin.go
│   │   ├── customer.go
│   │   ├── product.go
│   │   ├── category.go
│   │   ├── cart.go
│   │   ├── order.go
│   │   ├── review.go
│   │   ├── email.go
│   │   ├── cloudinary.go
│   │   ├── wishlist.go
│   │   └── analytics.go
│   ├── repository/
│   │   ├── admin.go
│   │   ├── customer.go
│   │   ├── product.go
│   │   ├── category.go
│   │   ├── cart.go
│   │   ├── order.go
│   │   ├── review.go
│   │   └── wishlist.go
│   ├── model/
│   │   ├── admin.go
│   │   ├── customer.go
│   │   ├── address.go
│   │   ├── product.go            # Product + ProductImage + ProductVariant
│   │   ├── category.go
│   │   ├── cart.go
│   │   ├── order.go              # Order + OrderItem
│   │   ├── review.go
│   │   └── wishlist.go
│   ├── dto/
│   │   ├── admin.go
│   │   ├── customer.go
│   │   ├── product.go
│   │   ├── cart.go
│   │   ├── order.go
│   │   ├── review.go
│   │   └── wishlist.go
│   ├── middleware/
│   │   ├── admin_auth.go
│   │   ├── customer_auth.go
│   │   └── cors.go
│   └── router/
│       └── router.go
├── migrations/
│   ├── 000001_create_enums.up.sql / .down.sql
│   ├── 000002_create_admins.up.sql / .down.sql
│   ├── 000003_create_customers.up.sql / .down.sql
│   ├── 000004_create_addresses.up.sql / .down.sql
│   ├── 000005_create_categories.up.sql / .down.sql
│   ├── 000006_create_products.up.sql / .down.sql
│   ├── 000007_create_product_images.up.sql / .down.sql
│   ├── 000008_create_product_variants.up.sql / .down.sql
│   ├── 000009_create_cart_items.up.sql / .down.sql
│   ├── 000010_create_orders.up.sql / .down.sql
│   ├── 000011_create_order_items.up.sql / .down.sql
│   ├── 000012_create_reviews.up.sql / .down.sql
│   ├── 000013_add_parent_id_to_categories.up.sql / .down.sql
│   └── 000014_create_wishlist_items.up.sql / .down.sql
├── .env
├── .env.example
├── go.mod
└── go.sum
```

---

## Route Structure (Frontend)

```
/                           → HomePage
/shop                       → CollectionPage
/shop/:slug                 → ProductPage
/category/:slug             → [10.3] CategoryLandingPage
/cart                       → CartPage (protected)
/checkout                   → CheckoutPage (protected)
/orders                     → OrderHistoryPage (protected)
/orders/:orderNumber        → OrderTrackingPage (protected)
/wishlist                   → WishlistPage (protected)
/login                      → LoginPage (redirect ke / jika sudah login)
/register                   → RegisterPage (redirect ke / jika sudah login)
/profile                    → ProfilePage (protected)

/admin/login                → Admin LoginPage
/admin/dashboard            → DashboardPage (admin protected)
/admin/products             → ProductsPage (admin protected)
/admin/orders               → OrdersPage (admin protected)
/admin/customers            → CustomersPage (admin protected)
/admin/reviews              → ReviewsPage (admin protected)
```

---

## Types Strategy

### Global Types (`src/types/index.ts`)
Semua `type` (bukan `interface`, per project rules) yang merupakan cerminan langsung dari backend DTO — dipakai lintas feature:

```typescript
// API envelope
type ApiResponse<T> = { success: boolean; data: T; message?: string }
type PaginatedResponse<T> = { success: boolean; data: T[]; meta: PaginationMeta }

// Domain models (public-facing responses)
type CatalogProduct = { ... }      // List view (matches Go ProductResponse)
type ProductDetail = { ... }       // Detail view (matches Go ProductDetailResponse + model fields)
type ProductVariant = { ... }      // Matches Go ProductVariantRes
type ProductImage = { ... }        // Matches Go ProductImageResponse
type Category = { ... }
type CartItem = { ... }
type Order = { ... }               // Customer-facing order list
type OrderDetail = { ... }         // Customer-facing order detail
type OrderItem = { ... }           // Matches Go OrderItemResponse
type OrderAddressInfo = { ... }    // Matches Go OrderAddressInfo (simplified — no id, customer_id, label)
type Customer = { ... }
type Review = { ... }
type Address = { ... }

// Admin-specific response types (Option A — separate from customer types)
type AdminOrder = { ... }          // Matches Go AdminOrderResponse (has customer_name, customer_email)
type AdminReview = { ... }         // Matches Go AdminReviewResponse (has product_name, is_published as required bool)
```

### Feature-Specific Types (`src/features/<domain>/types.ts`)
Berisi types yang hanya relevan untuk UI/form di feature tersebut — tidak perlu di-share:

```typescript
// features/admin/types.ts
type ProductFormValues = { name: string; slug: string; category_id: string; price: number; ... }
type VariantFormValues = { size: string; color?: string; sku: string; stock: number; ... }
type CategoryFormValues = { name: string; slug: string; description?: string; display_order: number }
type LoginFormValues = { email: string; password: string }
type ClientStatistics = Customer & { order_count: number; total_spent: number; is_active?: boolean }

// features/shop/types.ts
type ProductFilters = { categoryId?: string; sort?: SortOption; page?: number }
type SortOption = 'newest' | 'price_asc' | 'price_desc'

// features/checkout/types.ts
type CheckoutFormValues = { addressId: string; paymentMethod: string; notes?: string }

// features/auth/types.ts
type LoginFormValues = { email: string; password: string }
type RegisterFormValues = { name: string; email: string; password: string; confirmPassword: string }
```

---

## Architectural Patterns

### 1. Interface Abstraction (Backend)
"Accept Interfaces, Return Structs." Services dan handlers accept mockable interfaces di constructor mereka. `service/interfaces.go` mendefinisikan repository contracts; `handler/interfaces.go` mendefinisikan service contracts.

### 2. Request Context Propagation (Backend)
Semua Gin handlers extract context via `c.Request.Context()` dan chain-nya ke bawah. Semua GORM queries menggunakan `db.WithContext(ctx)`.

### 3. Graceful Shutdown & Managed Concurrency (Backend)
- Graceful HTTP shutdown pada `SIGINT` / `SIGTERM` dengan 10-second drain timeout.
- `BackgroundWorker` menggunakan `sync.WaitGroup` untuk async email dispatch.
- `errgroup` concurrent pipeline untuk dashboard analytics overview.

### 4. Dual Auth Middleware
Admin dan customer JWT menggunakan separate secrets (`JWT_ADMIN_SECRET`, `JWT_CUSTOMER_SECRET`), separate middleware, dan separate Zustand stores. Tidak ada cross-contamination.

| | Admin | Customer |
|---|---|---|
| Secret | `JWT_ADMIN_SECRET` | `JWT_CUSTOMER_SECRET` |
| Expiry | Access 15min + Refresh 7d (HttpOnly cookie) | Access 7d |
| Axios instance | `client.ts` | `customerClient.ts` |
| Zustand store | `adminAuthStore` | `customerAuthStore` |
| 401 behavior | Attempt refresh → auto-logout | Auto-logout |

#### Proteksi Token Substitution (Token Type Check)
Untuk mencegah serangan penukaran token (Token Substitution Attack), klaim JWT Admin (`AdminClaims`) menyertakan parameter `token_type` (`access` atau `refresh`):
- **Access Verification**: Middleware `AdminAuth` memvalidasi tanda tangan token dan memastikan secara ketat bahwa `token_type == "access"`. Refresh Token tidak dapat digunakan untuk otentikasi endpoint administratif biasa.
- **Refresh Verification**: Endpoint `/admin/refresh` memvalidasi secara ketat bahwa `token_type == "refresh"`. Access Token yang aktif tidak dapat disalahgunakan sebagai Refresh Token.

### 5. Atomic Stock Decrement (Backend)
Order creation berjalan dalam PostgreSQL transaction:
1. Lock semua `product_variants` rows yang relevan dengan `SELECT FOR UPDATE`.
2. Cek kecukupan stok.
3. Decrement stok.
4. Insert `orders` + `order_items`.
5. Commit — atau rollback jika out-of-stock, return `409 OUT_OF_STOCK`.

### 6. Order Number Generation (Backend)
`order_number` di-generate sebagai `JUICY-YYYYMMDD-XXXXXX` (tanggal + 6-char random alphanumeric), dengan uniqueness check sebelum insert.

### 7. Cart Upsert Pattern (Backend)
`POST /cart/items` menggunakan `INSERT ... ON CONFLICT (customer_id, variant_id) DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity`.

### 8. Zustand Store Pattern (Frontend)
Setiap store berisi state + async actions yang langsung call API. Tidak ada TanStack Query / cache layer tambahan.

```typescript
// Pola standar store
interface CartStore {
  items: CartItem[]
  isLoading: boolean
  error: string | null
  fetchCart: () => Promise<void>
  addItem: (variantId: string, qty: number) => Promise<void>
  updateQty: (itemId: string, qty: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => void
}
```

### 9. Protected Routes (Frontend)
Dua jenis route guard yang terpisah:

- `ProtectedRoute` (customer) — cek `customerAuthStore.isAuthenticated`. Jika tidak, redirect ke `/login` dengan `state.from` untuk post-login redirect.
- `AdminRoute` (admin) — cek `adminAuthStore.isAuthenticated`. Jika tidak, redirect ke `/admin/login`.

---

## Data Flow

### Customer Checks Out
```
1. Customer review cart (CartPage)
2. Pilih shipping address (AddressSelector)
3. React Hook Form + Zod validation
4. orderStore.placeOrder() → customerApi.placeOrder()
5. POST /api/customer/orders
6. Gin handler → OrderService.Create(ctx, req)
7. BEGIN TRANSACTION
   ├── Lock variants (SELECT FOR UPDATE)
   ├── Validate stock
   ├── Decrement stock
   ├── Generate order_number
   ├── Insert orders row
   ├── Insert order_items (snapshot: name, price, image, variant)
   └── COMMIT
8. BackgroundWorker → Resend: order confirmation ke customer
9. BackgroundWorker → Resend: new order alert ke admin
10. Response 201 → frontend clear cart, redirect ke /orders/:orderNumber
```

### Admin Updates Order ke Shipped
```
1. PATCH /api/admin/orders/:id/status { status: "shipped" }
2. OrderService.UpdateStatus → set shipped_at = NOW()
3. BackgroundWorker → Resend: shipping update email ke customer
4. Response 200 → admin page update local state
```

### Customer Submit Review
```
1. POST /api/customer/reviews { product_id, order_id, rating, body }
2. ReviewService: order harus milik customer + status harus 'delivered'
3. Cek UNIQUE (product_id, customer_id, order_id)
4. Insert review (is_published: true by default)
5. Response 201 → ReviewsSection refresh
```

### Admin Auth Flow
```
1. POST /api/admin/login
2. AdminService verifikasi bcrypt hash
3. Return JWT (access: 15min) + HttpOnly refresh_token cookie
4. Frontend simpan access token di adminAuthStore (memory only)
5. client.ts interceptor attach Bearer ke semua /api/admin/* requests
6. Pada 401 → POST /api/admin/refresh; jika gagal → auto-logout
```

### Customer Auth Flow
```
1. POST /api/customer/register atau /login
2. Return customer JWT (access: 7d)
3. Frontend simpan di customerAuthStore (memory only — bukan localStorage)
4. customerClient.ts interceptor attach Bearer ke /api/customer/* requests
5. Pada 401 → clear store (auto-logout)
```

---

## API Response Envelope

```typescript
// Success
{ "success": true, "data": T, "message": "optional" }

// Error
{ "success": false, "error": "human-readable", "code": "MACHINE_CODE" }

// Paginated
{ "success": true, "data": T[], "meta": { "page": 1, "per_page": 20, "total": 150, "total_pages": 8 } }
```

---

## Key Design Decisions

| Decision | Choice | Alasan |
|---|---|---|
| Hybrid domain-based structure | `features/` per domain + shared `components/` | Mudah navigate per fitur, tapi shared UI tidak duplikat |
| Feature-specific types | `features/<domain>/types.ts` untuk form/UI types | Hanya expose ke global apa yang benar-benar di-share |
| shadcn/ui | Component library base | Development cepat; zinc theme dengan terracotta accent override |
| Dual JWT secrets | Separate admin/customer secrets | Cegah cross-contamination |
| Atomic stock decrement | SELECT FOR UPDATE transaction | Cegah overselling di concurrent checkout |
| Snapshot fields di order_items | product_name, price, image_url di-copy saat checkout | Akurasi order history jika produk diedit/dihapus |
| Purchase-verified reviews | order_id FK di reviews | Cegah fake review |
| Cart upsert | ON CONFLICT DO UPDATE | Idempotent add-to-cart |
| GORM + raw migrations | GORM untuk queries, golang-migrate untuk schema | Speed development + explicit reversible migrations |
| Zustand (no TanStack Query) | Zustand async actions | Mental model lebih simpel; tidak ada cache layer tambahan |
| JWT in memory | Memory (bukan localStorage) | Proteksi XSS |
| CORS Allowed Origins Lockdown | Strict dynamic lookup against `.env` whitelist | Mencegah serangan CSRF / Reflected CORS credential hijacking oleh situs pihak ketiga |
| JWT Token Type Differentiation | `token_type` claim validation in middleware & service | Mencegah Token Substitution Attack (menyalahgunakan access token sebagai refresh token atau sebaliknya) |
| Payment sebagai stub | Service layer stub | Slot untuk Midtrans/Xendit/Stripe post-MVP |
| Dual Axios instances | client.ts + customerClient.ts | Token source terpisah; 401 handling terpisah |
| Category Landing Pages | `features/category/` dengan multiple sections | Dedicated landing page per kategori seperti Zalora — setiap kategori punya hero, subcategory grid, product grid, dan promo banner sendiri |

(End of file - total 562 lines)