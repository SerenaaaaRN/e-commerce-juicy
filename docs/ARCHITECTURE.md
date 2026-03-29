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

```
client/
├── public/
│   └── fonts/                    # Playfair Display, DM Sans (self-hosted)
├── src/
│   ├── assets/                   # Static images, SVGs
│   ├── components/
│   │   ├── ui/                   # Custom design system primitives
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── sonner.tsx
│   │   │   ├── textarea.tsx
│   │   │   └── Divider.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx            # Public nav (logo + links + cart icon + auth)
│   │   │   ├── Footer.tsx
│   │   │   └── AdminLayout.tsx
│   │   ├── animations/           # Reusable GSAP cinematic animations
│   │   │   ├── AsymmetricParallaxSection.tsx
│   │   │   ├── OrigamiSplitSection.tsx
│   │   │   └── DioramaSection.tsx    # Box-to-Fullscreen Zoom Portal
│   │   ├── sections/             # Public page sections
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturedSection.tsx
│   │   │   ├── CollectionPreview.tsx
│   │   │   ├── EditorialSection.tsx
│   │   │   └── CtaSection.tsx
│   │   ├── shop/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductImageGallery.tsx
│   │   │   ├── VariantSelector.tsx   # Size + color picker
│   │   │   ├── ReviewCard.tsx
│   │   │   └── StarRating.tsx
│   │   ├── admin/
│   │   │   ├── AdminRoute.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   └── ImageUploader.tsx
│   │   └── common/
│   │       └── ProtectedRoute.tsx    # Customer route guard
│   ├── pages/
│   │   ├── public/
│   │   │   ├── HomePage.tsx
│   │   │   ├── CollectionPage.tsx    # Product catalog with filters
│   │   │   ├── ProductPage.tsx       # PDP — product detail
│   │   │   ├── CartPage.tsx
│   │   │   ├── CheckoutPage.tsx
│   │   │   └── OrderTrackingPage.tsx
│   │   ├── customer/
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   └── OrderHistoryPage.tsx
│   │   └── admin/
│   │       ├── LoginPage.tsx
│   │       ├── DashboardPage.tsx
│   │       ├── ProductsPage.tsx
│   │       ├── OrdersPage.tsx
│   │       └── CustomersPage.tsx
│   ├── lib/
│   │   ├── api/                  # API client layer
│   │   │   ├── client.ts         # Admin Axios instance + JWT interceptor
│   │   │   ├── customerClient.ts # Customer Axios instance + JWT interceptor
│   │   │   ├── types.ts          # 25+ TypeScript interfaces matching backend DTOs
│   │   │   ├── products.ts       # Public shop product API
│   │   │   ├── customer.ts       # Customer auth, addresses, cart, orders, reviews
│   │   │   ├── admin.ts          # Admin auth, CRUDs, analytics
│   │   │   └── index.ts          # Re-exports
│   │   ├── utils.ts              # cn() utility (clsx + tailwind-merge)
│   │   ├── gsap.ts               # GSAP + ScrollTrigger init
│   │   └── lenis.ts              # Lenis smooth scroll init
│   ├── stores/                   # Zustand — API calls directly in async actions
│   │   ├── adminAuthStore.ts     # Admin JWT token + profile
│   │   ├── customerAuthStore.ts  # Customer JWT token + profile + addresses
│   │   ├── cartStore.ts          # Cart items, fetchCart, addItem, etc.
│   │   ├── orderStore.ts         # Orders, placeOrder, fetchOrders, etc.
│   │   ├── productStore.ts       # Products + categories
│   │   └── uiStore.ts            # Sidebar open, loading overlay
│   ├── features/                 # Feature types (shop types only)
│   │   └── shop/
│   │       └── shop.types.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css                 # Tailwind v4 @theme, font-face declarations
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
│   │   ├── admin.go              # Admin auth
│   │   ├── customer.go           # Customer auth + profile
│   │   ├── product.go            # Public + admin product endpoints
│   │   ├── category.go
│   │   ├── cart.go               # Customer cart
│   │   ├── order.go              # Customer checkout + admin order management
│   │   ├── review.go             # Customer reviews
│   │   └── analytics.go
│   ├── service/
│   │   ├── interfaces.go
│   │   ├── background.go
│   │   ├── admin.go
│   │   ├── customer.go
│   │   ├── product.go
│   │   ├── category.go
│   │   ├── cart.go
│   │   ├── order.go              # Stock decrement + order number generation
│   │   ├── review.go
│   │   ├── email.go              # Order confirmation, shipping update emails
│   │   ├── cloudinary.go
│   │   └── analytics.go
│   ├── repository/
│   │   ├── admin.go
│   │   ├── customer.go
│   │   ├── product.go
│   │   ├── category.go
│   │   ├── cart.go
│   │   ├── order.go
│   │   └── review.go
│   ├── model/
│   │   ├── admin.go
│   │   ├── customer.go
│   │   ├── address.go
│   │   ├── product.go            # Product + ProductImage + ProductVariant
│   │   ├── category.go
│   │   ├── cart.go
│   │   ├── order.go              # Order + OrderItem
│   │   └── review.go
│   ├── dto/
│   │   ├── admin.go
│   │   ├── customer.go
│   │   ├── product.go
│   │   ├── cart.go
│   │   ├── order.go
│   │   └── review.go
│   ├── middleware/
│   │   ├── admin_auth.go         # JWT validator for admin routes
│   │   ├── customer_auth.go      # JWT validator for customer routes
│   │   └── cors.go
│   └── router/
│       └── router.go
├── migrations/
│   ├── 000001_create_enums.up.sql
│   ├── 000001_create_enums.down.sql
│   ├── 000002_create_admins.up.sql
│   ├── 000002_create_admins.down.sql
│   ├── 000003_create_customers.up.sql
│   ├── 000003_create_customers.down.sql
│   ├── 000004_create_addresses.up.sql
│   ├── 000004_create_addresses.down.sql
│   ├── 000005_create_categories.up.sql
│   ├── 000005_create_categories.down.sql
│   ├── 000006_create_products.up.sql
│   ├── 000006_create_products.down.sql
│   ├── 000007_create_product_images.up.sql
│   ├── 000007_create_product_images.down.sql
│   ├── 000008_create_product_variants.up.sql
│   ├── 000008_create_product_variants.down.sql
│   ├── 000009_create_cart_items.up.sql
│   ├── 000009_create_cart_items.down.sql
│   ├── 000010_create_orders.up.sql
│   ├── 000010_create_orders.down.sql
│   ├── 000011_create_order_items.up.sql
│   ├── 000011_create_order_items.down.sql
│   ├── 000012_create_reviews.up.sql
│   └── 000012_create_reviews.down.sql
├── .env
├── .env.example
├── go.mod
└── go.sum
```

---

## Architectural Patterns

### 1. Robust Layer Coupling via Interface Abstraction
Same pattern as Elysium — "Accept Interfaces, Return Structs". Services and handlers accept mockable interfaces in their constructors. `service/interfaces.go` defines repository contracts; `handler/interfaces.go` defines service actions.

### 2. Request Context Propagation
All Gin handlers extract context via `c.Request.Context()` and chain it downward. All GORM queries use `db.WithContext(ctx)`.

### 3. Graceful Shutdown & Managed Concurrency
- Graceful HTTP shutdown on `SIGINT` / `SIGTERM` with 10-second drain timeout.
- `BackgroundWorker` using `sync.WaitGroup` for async email dispatches (order confirmation, shipping update).
- `errgroup` concurrent pipeline for dashboard analytics overview.

### 4. Dual Auth Middleware
Admin and customer JWTs are issued with separate secrets (`JWT_ADMIN_SECRET`, `JWT_CUSTOMER_SECRET`), validated by separate middleware (`admin_auth.go`, `customer_auth.go`), and stored in separate Zustand stores on the frontend. This prevents any cross-contamination of auth contexts.

### 5. Atomic Stock Decrement
Order creation runs inside a PostgreSQL transaction:
1. Lock all relevant `product_variants` rows with `SELECT FOR UPDATE`.
2. Check each variant has sufficient stock.
3. Decrement stock for each item.
4. Insert `orders` + `order_items`.
5. Commit — or rollback if any variant is out of stock, returning `409 OUT_OF_STOCK`.

### 6. Order Number Generation
`order_number` is generated in the service layer as `JUICY-YYYYMMDD-XXXXXX` (date + 6-char random alphanumeric), checked for uniqueness before insert.

### 7. Cart Upsert Pattern
`POST /cart/items` uses `INSERT ... ON CONFLICT (customer_id, variant_id) DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity` to handle add-to-cart idempotency.

---

## Data Flow

### Customer Checks Out
```
1. Customer reviews cart (CartPage)
2. Selects shipping address
3. React Hook Form validates via Zod
4. Zustand store.action → customerApi.placeOrder()
5. POST /api/customer/orders
6. Gin handler extracts context → OrderService.Create(ctx, req)
7. BEGIN TRANSACTION
   ├── Lock variants (SELECT FOR UPDATE)
   ├── Validate stock for each item
   ├── Decrement stock
   ├── Generate order_number
   ├── Insert orders row
   ├── Insert order_items rows (with price/name snapshots)
   └── COMMIT
8. BackgroundWorker.Submit() → Resend: order confirmation email to customer
9. BackgroundWorker.Submit() → Resend: new order alert to admin
10. Response 201 → frontend clears cart store, shows order confirmation
```

### Admin Updates Order Status to Shipped
```
1. Admin selects order → PATCH /api/admin/orders/:id/status { status: "shipped" }
2. OrderService.UpdateStatus(ctx, id, "shipped")
3. Sets shipped_at = NOW()
4. BackgroundWorker.Submit() → Resend: shipping update email to customer
5. Response 200 → admin page updates local state
```

### Customer Submits Review
```
1. Customer navigates to order history → clicks "Review" on delivered item
2. POST /api/customer/reviews with product_id, order_id, rating, body
3. ReviewService validates: order must belong to customer, status must be 'delivered'
4. Checks UNIQUE (product_id, customer_id, order_id) — one review per order-item
5. Inserts review (is_published: true by default)
6. Response 201 → PDP review list updates
```

### Admin Auth Flow
```
1. POST /api/admin/login with credentials
2. AdminService verifies bcrypt hash
3. Returns signed JWT (access: 15min) + sets HttpOnly refresh_token cookie
4. Frontend stores access token in adminAuthStore (Zustand, memory only)
5. Axios interceptor (client.ts) reads token from store, attaches Bearer to all /api/admin/* requests
6. On 401, interceptor calls POST /api/admin/refresh; if that fails, clears store (auto-logout)
7. admin_auth.go middleware validates JWT on every protected route
```

### Customer Auth Flow
```
1. POST /api/customer/register or /api/customer/login
2. CustomerService verifies bcrypt hash (login) or creates account (register)
3. Returns signed customer JWT (access: 7d — longer since non-admin)
4. Frontend stores token in customerAuthStore (Zustand, memory only)
5. customerClient.ts Axios interceptor reads token from store, attaches Bearer to all /api/customer/* requests
6. On 401, interceptor clears store (auto-logout)
7. customer_auth.go middleware validates JWT on protected customer routes
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

| Decision | Choice | Reason |
|---|---|---|
| No component library | Custom UI | DESIGN.md too opinionated; override cost too high |
| Dual JWT secrets | Separate admin/customer secrets | Prevents cross-contamination; admin tokens cannot be used on customer routes |
| Atomic stock decrement | SELECT FOR UPDATE transaction | Prevents overselling under concurrent checkout |
| Snapshot fields in order_items | product_name, price, image_url copied at checkout | Order history accuracy even if product is edited/deleted |
| Purchase-verified reviews | order_id FK on reviews | Prevents fake reviews; enforces real purchase |
| Cart upsert | ON CONFLICT DO UPDATE | Idempotent add-to-cart without duplicates |
| GORM over raw SQL | GORM | Development speed; migrations still use raw SQL |
| golang-migrate over AutoMigrate | golang-migrate | Explicit, reversible, production-safe |
| stores call API directly (no TanStack Query) | Zustand async actions | Simpler mental model; no extra cache layer needed for admin CRUD |
| JWT in memory | Memory (not localStorage) | XSS protection; admin session lost on refresh (re-login required) |
| Payment as stub | Service layer stub | Slot for Midtrans/Xendit/Stripe in post-MVP without architectural change |
| No mock data | Server is single source of truth | All pages show empty states when server is offline |
| Dual Axios instances | client.ts + customerClient.ts | Separate token sources (admin vs customer); separate 401 handling |
| Reusable Animations Folder | components/animations/ | Pure visual GSAP wrapper components (AsymmetricParallax, OrigamiSplit) isolated to prevent redundant math code and preserve prop typing rules |
