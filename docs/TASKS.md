# TASKS.md — Juicy
> Phased task breakdown. Update status as you go: `[ ]` todo → `[~]` in progress → `[x]` done.

---

## Phase 1 — Database ✅

### 1.1 PostgreSQL Setup
- [x] Create database `juicy` in pgAdmin 4
- [x] Verify connection (host, port, user, password)
- [x] Enable `pgcrypto` extension

### 1.2 Migrations
- [x] Install `golang-migrate` CLI
- [x] Create `migrations/` folder in `server/`
- [x] Generate migration files 001–012
- [x] Run all up migrations
- [x] Verify semua tabel terbuat di pgAdmin 4

### 1.3 Seed Data
- [x] Insert admin account (bcrypt hash password)
- [x] Insert 6 categories (Tops, Bottoms, Dresses, Outerwear, Accessories, Sets)
- [x] Insert sample products (3–5 per category) dengan variants dan images
- [x] Verify di pgAdmin 4

---

## Phase 2 — Backend (Golang Gin) ✅

### 2.1 Project Setup
- [x] `go mod init` + install all dependencies
- [x] Folder structure sesuai `ARCHITECTURE.md`
- [x] `config/config.go`, `database/postgres.go`, `cmd/main.go`

### 2.2 Router & Middleware
- [x] `router/router.go` — semua route groups
- [x] `middleware/cors.go`, `admin_auth.go`, `customer_auth.go`

### 2.3 Admin Auth
- [x] Model, repo, service, handler — login, refresh, logout
- [x] Dual-token: access 15min + refresh 7d HttpOnly cookie

### 2.4 Customer Auth
- [x] Model, repo, service, handler — register, login, profile, change password

### 2.5 Addresses
- [x] Full CRUD + `PATCH /customer/addresses/:id/default` (atomic transaction)

### 2.6 Category API
- [x] Public `GET /shop/categories` + admin CRUD

### 2.7 Product API
- [x] Model: `Product`, `ProductImage`, `ProductVariant`
- [x] Repo: FindAll (filters + pagination), FindBySlug, CRUD
- [x] Service: business logic + Cloudinary multi-image upload/delete
- [x] Handler: public endpoints + admin CRUD + image + variant management

### 2.8 Cart API
- [x] Upsert pattern (`ON CONFLICT DO UPDATE`), stock check, full CRUD

### 2.9 Order API
- [x] Atomic stock decrement (SELECT FOR UPDATE transaction)
- [x] Order number generation `JUICY-YYYYMMDD-XXXXXX`
- [x] Email triggers via BackgroundWorker

### 2.10 Review API
- [x] Purchase-verified: order must belong to customer + status must be `delivered`
- [x] Unique constraint per (product_id, customer_id, order_id)

### 2.11 Analytics API
- [x] `GET /admin/analytics/overview` — concurrent errgroup pipeline
- [x] `GET /admin/analytics/orders/chart` — grouped by month (last 6 months)

### 2.12 Backend QA
- [x] Auth separation verified (admin token on customer route → 401)
- [x] Atomic stock decrement under concurrent requests
- [x] Cloudinary upload/delete cycle
- [x] Resend email flow

---

## Phase 3 — Admin Dashboard (React) ✅

### 3.1 Project Setup & Config
- [x] Initialize Vite + React + TypeScript
- [x] Configure Tailwind CSS v4 + shadcn/ui base styles
- [x] Create API Client instances: `src/lib/api/client.ts` (admin) & `src/lib/api/customerClient.ts` (customer)
- [x] Define global DTO interfaces in `src/types/index.ts`
- [x] Implement API modules: `src/lib/api/admin.ts`, `src/lib/api/products.ts`, `src/lib/api/customer.ts`
- [x] Create Zustand global stores: `adminAuthStore`, `customerAuthStore`, `cartStore`, `orderStore`, `productStore`, `reviewStore`

### 3.2 Admin Authentication
- [x] `src/features/admin/LoginPage.tsx` — login interface for store managers
- [x] `src/features/admin/components/AdminRoute.tsx` — route guard for `/admin/*`
- [x] Implement silent auth check (token refresh) & logout actions

### 3.3 Layout & Common Components
- [x] `src/components/layout/AdminLayout.tsx` — sidebar + header container
- [x] `src/features/admin/components/Sidebar.tsx` & `Header.tsx`
- [x] `src/features/admin/components/DataTable.tsx` — reusable paginated table

### 3.4 Dashboard & Analytics Overview
- [x] `src/features/admin/DashboardPage.tsx`
- [x] `src/features/admin/components/StatsCard.tsx` for key metrics (orders, revenue, customers, out-of-stock)
- [x] Custom SVG bar & line charts for orders and revenue over the last 6 months (utilizing concurrent errgroup pipeline)

### 3.5 Product Management
- [x] `src/features/admin/ProductsPage.tsx`
- [x] Create/Edit product dialog with variant manager (size × color pills)
- [x] Integrated Multi-image upload to Cloudinary with drag-and-drop
- [x] Delete with confirmation dialog

### 3.6 Order Operations
- [x] `src/features/admin/OrdersPage.tsx`
- [x] Order detail drawer with snapshot verification, customer details, and timeline
- [x] Inline status updates (Pending → Confirmed → Processing → Shipped → Delivered) and payment updates

### 3.7 Customer Management
- [x] `src/features/admin/CustomersPage.tsx`
- [x] Customer details modal with complete profile and historical order summary
- [x] Toggle customer status (active/inactive)

### 3.8 Review Management
- [x] `src/features/admin/ReviewsPage.tsx`
- [x] Product and published/unpublished status filters
- [x] Action to publish/unpublish reviews or delete permanently

### 3.9 Shadcn UI Standardization
- [x] Replace all raw `<table>` with shadcn `Table` component (ProductsPage, OrdersPage, CustomersPage)
- [x] Replace all raw `<select>` with shadcn `Select` component (ProductsPage, OrdersPage, ReviewsPage)
- [x] Replace raw `<input type="checkbox">` with shadcn `Checkbox` (ProductsPage)
- [x] Replace `<hr>` with shadcn `Separator` (OrdersPage)
- [x] Replace inline SVG icons with `HugeiconsIcon` (all pages)
- [x] Replace raw color classes (`text-green-600`, `text-yellow-600`, etc.) with semantic `Badge` variants
- [x] Replace raw `oklch()` values in Recharts with `hsl(var(--...))` CSS variables (DashboardPage)
- [x] Clean production build (`npm run build` passes)

### 3.10 Clean Code Refactoring
- [x] Extract admin-specific types to `src/features/admin/types.ts` (ProductFormValues, VariantFormValues, CategoryFormValues, LoginFormValues, ClientStatistics)
- [x] Extract all Zod validation schemas to `src/features/admin/validations.ts` (productSchema, variantSchema, categorySchema, loginSchema)
- [x] Extract business logic hooks:
  - [x] `hooks/useProducts.ts` — product + category CRUD, form state, modal management
  - [x] `hooks/useVariants.ts` — variant add/delete operations per product
  - [x] `hooks/useProductImages.ts` — image upload, set-primary, delete operations
  - [x] `hooks/useOrders.ts` — orders list, detail loading, status/payment updates
  - [x] `hooks/useCustomers.ts` — customer CRM: list, detail, toggle status
  - [x] `hooks/useReviews.ts` — review moderation: list, toggle publish, delete
  - [x] Migrate `hook/useDataTableFilter.ts` → `hooks/useDataTableFilter.ts` (kebab-case folder convention)
- [x] Extract reusable admin UI components:
  - [x] `components/FullPageSpinner.tsx` — shared full-page loading spinner
  - [x] `components/SearchInput.tsx` — search input with icon prefix
  - [x] `components/ProductFormDialog.tsx` — product create/edit dialog (presentational)
  - [x] `components/VariantManagerDialog.tsx` — variant management dialog (presentational)
  - [x] `components/ImageManagerDialog.tsx` — image upload/management dialog (presentational)
- [x] Fix `AdminRoute.tsx` to use arrow function component (per project rules)
- [x] Slim down all page components to thin orchestrators:
  - [x] `ProductsPage.tsx` (1382 → ~200 lines)
  - [x] `OrdersPage.tsx` — uses useOrders hook
  - [x] `CustomersPage.tsx` — uses useCustomers hook
  - [x] `ReviewsPage.tsx` — uses useReviews hook
  - [x] `LoginPage.tsx` — imports schema from validations.ts
- [x] Align `src/types/index.ts` with Go backend DTOs:
  - [x] Add `AdminOrder` type (matches Go `AdminOrderResponse` with `customer_name`, `customer_email`)
  - [x] Add `AdminReview` type (matches Go `AdminReviewResponse` with `product_name`, `is_published`)
  - [x] Add `OrderAddressInfo` type (matches Go simplified address DTO)
  - [x] Add `CatalogProduct` type (matches Go `ProductResponse` for list views)
  - [x] Fix `OrderItem` to match Go DTO (no `id`/`order_id`, `image_url` optional)
  - [x] Use `type` keyword everywhere instead of `interface` (per project rules)
- [x] Update `src/lib/api/admin.ts` to use new admin-specific types
- [x] Delete old `hook/` directory (singular)

### 3.11 Integration QA
- [x] Validate all admin screens connect to the Golang backend without mock data

---

## Phase 4 — Public Frontend (React) 🔄

> **Dokumen yang dibuka:**
> - `CONTEXT.md` — scope, customer persona
> - `ARCHITECTURE.md` — folder structure frontend
> - `API.md` — public shop routes + customer order/review routes
> - `ENV.md` — `VITE_API_BASE_URL` saja
> - `TASKS.md` — Phase 4 checklist saja
>
> **Stack:** shadcn/ui components, Tailwind v4, Hugeicons. Tidak ada custom design system.

### 4.1 Global Setup & Router
- [x] `src/components/layout/Navbar.tsx` — terracotta-accented public header with navigation links, cart badge, and auth dropdown
- [x] `src/components/layout/Footer.tsx` — responsive editorial footer with info links
- [x] `src/App.tsx` — setup routes according to `ARCHITECTURE.md` + ScrollToTop wrapper

### 4.2 Home Page (Atelier Narrative)
- [x] `src/features/home/HomePage.tsx` — narrative canvas layout composing the editorial sections
- [x] `src/features/home/components/HeroSection.tsx` — full-bleed hero banner with bold typography and terracotta primary CTAs
- [x] `src/features/home/components/FeaturedSection.tsx` — bestseller product grid with hover-zoom cards
- [x] `src/features/home/components/CollectionPreview.tsx` — category preview layout linking to `/shop`
- [x] `src/features/home/components/EditorialSection.tsx` — high-fashion campaign showcase
- [x] `src/features/home/components/CtaSection.tsx` — bottom campaign call-to-action block

### 4.3 Catalog / Shop (CollectionPage)
- [x] `src/features/shop/CollectionPage.tsx` — `/shop` layout integrating filters, sorting, and pagination
- [x] `src/features/shop/components/ProductGrid.tsx` — responsive layout for rendering lists
- [x] `src/features/shop/components/ProductCard.tsx` — card component displaying product image, price, tags, and badge
- [x] `src/features/shop/components/ProductFilters.tsx` — sidebar filter panel (category, sorting, price range)
- [x] Infinite scroll or pagination support with skeleton placeholders (`src/components/common/LoadingSkeleton.tsx`)

### 4.4 Product Detail Page (PDP)
- [x] `src/features/shop/ProductPage.tsx` — `/shop/:slug` PDP page compose
- [x] `src/features/shop/components/ProductImageGallery.tsx` — thumbnail selector strip + high-res main preview with smooth transitions
- [x] `src/features/shop/components/VariantSelector.tsx` — size pills & color swatches with stock checking (disable out-of-stock options)
- [x] `src/features/shop/components/AddToCartButton.tsx` — terracotta CTA with active stock availability checks & loading states
- [x] `src/features/shop/components/ProductInfo.tsx` — details: title, price comparison, tags, and description
- [x] `src/features/shop/components/ReviewsSection.tsx` — list reviews with rating summaries and pagination
- [x] `src/features/shop/components/ReviewCard.tsx` — single customer rating, comment, and formatted date
- [x] `src/features/shop/components/StarRating.tsx` — dual mode (readonly display & active interactive stars)

### 4.5 Cart Page
- [x] `src/features/cart/CartPage.tsx` — `/cart` main view, restricted to authenticated customers (redirect to login if guest)
- [x] `src/features/cart/components/CartItem.tsx` — row displaying image, details, variant details, price, quantity stepper, and remove action
- [x] `src/features/cart/components/CartSummary.tsx` — sidebar summary showing subtotal, shipping placeholder, and final total with a checkout CTA
- [x] `src/features/cart/components/EmptyCart.tsx` — friendly empty state with terracotta "Shop Now" button redirecting to `/shop`

### 4.6 Checkout Flow (Protected)
- [x] `src/features/checkout/CheckoutPage.tsx` — `/checkout` page protected route
- [x] `src/features/checkout/components/AddressSelector.tsx` — choose from existing addresses or trigger address modal
- [x] `src/features/checkout/components/AddressForm.tsx` — inline form for adding addresses on the fly
- [x] `src/features/checkout/components/OrderSummary.tsx` — immutable read-only checklist of purchased items, prices, and total cost
- [x] `src/features/checkout/components/PaymentSelector.tsx` — payment option select (COD stub for MVP)
- [x] Implement order submission: `placeOrder()` with transaction handling on the backend

### 4.7 Order Tracking (Protected)
- [x] `src/features/orders/OrderTrackingPage.tsx` — `/orders/:orderNumber` detail page
- [x] `src/features/orders/components/OrderStatusTimeline.tsx` — modern status step timeline (Pending → Confirmed → Processing → Shipped → Delivered)
- [x] `src/features/orders/components/OrderItemRow.tsx` — read-only display of snapshotted items purchased

### 4.8 Public QA & Responsiveness
- [ ] Verify complete layout responsiveness (mobile first, fluid desktop layout)
- [ ] Handle error states (`src/components/common/ErrorMessage.tsx`) and empty states (`src/components/common/EmptyState.tsx`) gracefully
- [ ] Run production build and ensure zero ESLint/TypeScript compilation errors

---

## Phase 5 — Customer Auth Frontend (React) 🔄

> **Dokumen yang dibuka:**
> - `API.md` — customer auth + profile + address routes
> - `ARCHITECTURE.md` — customer auth flow
>
> **Stack:** shadcn/ui components, Tailwind v4.

### 5.1 Customer Authentication Flow
- [x] `src/features/auth/LoginPage.tsx` — `/login` public page (redirects to `/` if already logged in)
- [x] `src/features/auth/RegisterPage.tsx` — `/register` public page with validation
- [x] `src/features/auth/components/LoginForm.tsx` & `src/features/auth/components/RegisterForm.tsx` using React Hook Form + Zod
- [x] `src/components/common/ProtectedRoute.tsx` — protect `/cart`, `/checkout`, `/profile`, `/orders`

### 5.2 Profile & Address Management
- [x] `src/features/profile/ProfilePage.tsx` — `/profile` account tabs (Info, Security, Addresses)
- [x] `src/features/profile/components/EditProfileForm.tsx` — edit name, phone number, email
- [x] `src/features/profile/components/ChangePasswordForm.tsx` — update password securely
- [x] `src/features/profile/components/AddressList.tsx` & `AddressCard.tsx` — display active customer addresses with "Default" label badge
- [x] `src/features/profile/components/AddressFormModal.tsx` — modal container for creating/editing customer address details

### 5.3 Order History & Review Submission
- [x] `src/features/orders/OrderHistoryPage.tsx` — `/orders` listing all historic customer purchases
- [x] `src/features/orders/components/OrderCard.tsx` — listing order number, timestamp, total price, status badge, and detail link
- [x] `src/features/orders/components/WriteReviewCta.tsx` — "Write a Review" prompt active only for verified `delivered` items (triggers `StarRating` + review comment modal)

---

## Phase 6 — Deployment

- [ ] Push ke GitHub
- [ ] Railway: buat project + PostgreSQL plugin
- [ ] Deploy backend, set semua env vars
- [ ] Run migrations di Railway DB
- [ ] Deploy frontend, set `VITE_API_BASE_URL`
- [ ] Set `ALLOWED_ORIGINS` ke frontend URL
- [ ] Smoke test end-to-end (register → browse → cart → checkout → track order → review)
- [ ] Custom domain (opsional)

---

## Phase 7 — Shop Experience Enhancement (Zalora-Style) 📋

> **Status:** Planned — belum diimplementasi.
> **Prerequisite:** Phase 4 & 6 selesai, backend running.
> **Referensi:** Zalora, ASOS — advanced filtering & browsing UX.

### 7.1 Backend — Subcategory Support
- [ ] Migration 013: Tambah `parent_id UUID REFERENCES categories(id)` ke `categories` table
- [ ] Update `Category` model + DTO — tambah `parent_id`, `children` field
- [ ] Update `CategoryRepository` — support tree query (parent + children)
- [ ] Update `GET /api/shop/categories` — return nested structure dengan `children[]`
- [ ] Update `GET /api/admin/categories` — support `parent_id` di CRUD

### 7.2 Backend — Advanced Product Filters
- [ ] Tambah query params di `ListProducts` handler:
  - `sizes` — comma-separated size filter (e.g. `sizes=S,M,L`)
  - `search` — full-text search di `name` + `description` (ILIKE)
- [ ] Update `ProductRepository` — join `product_variants` untuk size filtering
- [ ] Tambah `product_count` per category di `GET /api/shop/categories` response

### 7.3 Frontend — Search Bar
- [ ] `src/components/layout/Navbar.tsx` — tambah search input di header
- [ ] Search triggers navigation ke `/shop?search=<query>`
- [ ] Debounced input (300ms) untuk autocomplete feel

### 7.4 Frontend — Enhanced ProductFilters
- [ ] Size filter: multi-select checkboxes/pills (XS, S, M, L, XL, XXL)
- [ ] Subcategory support: collapsible tree di sidebar
- [ ] Product count badge `(24)` di sebelah nama kategori

### 7.5 Frontend — Grid & Scroll Enhancements
- [ ] Grid toggle button (2-column / 4-column view) di toolbar CollectionPage
- [ ] Infinite scroll sebagai alternatif pagination (`IntersectionObserver`)
- [ ] Skeleton loader improvements untuk infinite scroll

### 7.6 QA & Polish
- [ ] Verify semua filter params sync ke URL (`useSearchParams`)
- [ ] Verify mobile responsive — Sheet drawer untuk filters tetap works
- [ ] Run production build — zero TypeScript errors
- [ ] Test edge cases: empty results, reset filters, back navigation

---

## Notes for AI Agents

1. Baca `CONTEXT.md` dan `ARCHITECTURE.md` sebelum mulai phase apapun.
2. `ERD.md` hanya relevan di Phase 1 & 2 — schema sudah settled.
3. Referensi `API.md` untuk field names — jangan tebak sendiri.
4. Referensi `ENV.md` untuk nama env var — jangan hardcode nilai apapun.
5. Kerjakan satu subphase per sesi.
6. Semua Go struct wajib punya GORM tag + JSON tag.
7. Semua React component wajib typed — gunakan `type` bukan `interface` untuk props dan form values. Tidak ada `any`.
8. Folder baru diletakkan sesuai `ARCHITECTURE.md` — jangan improvisasi struktur.
9. Response backend selalu pakai envelope: `{ success, data, message/error }`.
10. **Admin auth dan Customer auth adalah dua flow terpisah** — JWT secret berbeda, middleware berbeda, Zustand store berbeda, Axios instance berbeda.
11. **Stock decrement selalu dalam transaction** — `SELECT FOR UPDATE` sebelum decrement.
12. **Order items wajib snapshot** — salin `product_name`, `variant_size`, `variant_color`, `image_url`, `unit_price` saat order dibuat.
13. **Reviews wajib purchase-verified** — validasi `order_id` milik customer + order status `delivered`.