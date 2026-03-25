# TASKS.md — Juicy
> Phased task breakdown. Update status as you go: `[ ]` todo → `[~]` in progress → `[x]` done.

---

## Phase 1 — Database

> **Dokumen yang dibuka:**
> - `ERD.md` — schema, SQL migrations, enum definitions, seed data
> - `ENV.md` → bagian DB credentials saja
>
> **Yang diminta ke AI:** SQL migration queries siap pakai → jalankan manual di pgAdmin 4.

### 1.1 PostgreSQL Setup
- [x] Create database `juicy` in pgAdmin 4
- [x] Verify connection (host, port, user, password)
- [x] Enable `pgcrypto` extension: `CREATE EXTENSION IF NOT EXISTS pgcrypto;`

### 1.2 Migrations
- [x] Install `golang-migrate` CLI
- [x] Create `migrations/` folder in `server/`
- [x] Generate migration files 001–012 (lihat `ERD.md`)
- [x] Run all up migrations: `migrate -path ./migrations -database "postgres://..." up`
- [x] Verify semua tabel terbuat di pgAdmin 4

### 1.3 Seed Data
- [x] Insert admin account (bcrypt hash password dulu)
- [x] Insert 6 categories (Tops, Bottoms, Dresses, Outerwear, Accessories, Sets)
- [x] Insert sample products (3–5 per category) dengan variants dan images untuk dev
- [x] Verify di pgAdmin 4

---

## Phase 2 — Backend (Golang Gin)

> **Dokumen yang dibuka:**
> - `CONTEXT.md` — scope & stack reminder
> - `ARCHITECTURE.md` — folder structure backend, data flow, response envelope
> - `ERD.md` — column names & types untuk GORM structs
> - `API.md` — semua endpoint contracts, request/response shapes
> - `ENV.md` — semua backend env vars
> - `TASKS.md` — Phase 2 checklist saja
>
> **Yang diminta ke AI:** satu subphase per prompt (misal: "Buatkan 2.4 Product API — model, repo, service, handler").

### 2.1 Project Setup
- [x] `go mod init github.com/SerenaaaaRN/juicy`
- [x] Install dependencies: `gin`, `gorm`, `gorm/driver/postgres`, `golang-jwt/jwt`, `golang-migrate`, `cloudinary-go`, `godotenv`, `go-playground/validator`, `gin-contrib/cors`, `resend-go`, `golang.org/x/sync`
- [x] Buat folder structure sesuai `ARCHITECTURE.md`
- [x] `config/config.go` — load semua env vars ke struct (termasuk dual JWT secrets)
- [x] `database/postgres.go` — GORM connection + ping check
- [x] `cmd/main.go` — init config, DB, router, graceful shutdown, BackgroundWorker

### 2.2 Router & Middleware
- [x] `router/router.go` — semua route groups (`/admin/*`, `/customer/*`, `/shop/*`)
- [x] `middleware/cors.go` — allow `ALLOWED_ORIGINS`, `AllowCredentials: true`
- [x] `middleware/admin_auth.go` — JWT validation dengan `JWT_ADMIN_SECRET`
- [x] `middleware/customer_auth.go` — JWT validation dengan `JWT_CUSTOMER_SECRET`

### 2.3 Admin Auth
- [x] `model/admin.go`
- [x] `repository/admin.go` — `FindByEmail()`
- [x] `service/admin.go` — `Login()`, `Refresh()`, `Logout()` + dual-token (access 15min + refresh 7d HttpOnly cookie)
- [x] `handler/admin.go` — `POST /admin/login`, `POST /admin/refresh`, `POST /admin/logout`
- [x] Test: login → access token + refresh cookie; refresh → new access token; logout → clears cookie

### 2.4 Customer Auth
- [x] `model/customer.go`
- [x] `repository/customer.go` — `FindByEmail()`, `Create()`, `FindByID()`
- [x] `service/customer.go` — `Register()`, `Login()`, `GetProfile()`, `UpdateProfile()`, `ChangePassword()`
- [x] `handler/customer.go` — auth endpoints + profile endpoints
- [x] Test: register → token; login → token; protected profile endpoint

### 2.5 Addresses
- [x] `model/address.go`
- [x] `repository/` + `service/` + `handler/` for address CRUD
- [x] `PATCH /customer/addresses/:id/default` — atomic: set default, unset others in single transaction
- [x] Test all CRUD + default toggle

### 2.6 Category API
- [x] `model/category.go`
- [x] `repository/category.go` — CRUD
- [x] `service/category.go`
- [x] `handler/category.go` — public `GET /shop/categories` + admin CRUD
- [x] Test: public + admin endpoints

### 2.7 Product API
- [x] `model/product.go` — `Product`, `ProductImage`, `ProductVariant` GORM structs
- [x] `repository/product.go` — FindAll (with filters + pagination), FindBySlug, Create, Update, Delete
- [x] `service/product.go` — business logic + Cloudinary multi-image upload/delete
- [x] `handler/product.go` — public endpoints + admin CRUD + image management + variant management
- [x] Test: product listing with filters; PDP; admin create with images; variant add/update

### 2.8 Cart API
- [x] `model/cart.go`
- [x] `repository/cart.go` — upsert pattern (`ON CONFLICT DO UPDATE`), FindByCustomer, RemoveItem, ClearCart
- [x] `service/cart.go` — stock check on add
- [x] `handler/cart.go` — GET, POST (upsert), PATCH quantity, DELETE item, DELETE clear
- [x] Test: add same item twice → quantity increments; add out-of-stock → 409

### 2.9 Order API
- [x] `model/order.go` — `Order` + `OrderItem` GORM structs
- [x] `repository/order.go` — Create (with transaction), FindByCustomer, FindByID, FindByOrderNumber, UpdateStatus, UpdatePayment
- [x] `service/order.go` — atomic stock decrement + order number generation + email triggers
- [x] `service/email.go` — `SendOrderConfirmation()` + `SendAdminOrderAlert()` + `SendShippingUpdate()`
- [x] `handler/order.go` — customer checkout + tracking + admin order management
- [x] Test: checkout with sufficient stock → order created, stock decremented, email sent; checkout with out-of-stock → 409

### 2.10 Review API
- [x] `model/review.go`
- [x] `repository/review.go`
- [x] `service/review.go` — validate: order belongs to customer, order status is 'delivered', no duplicate review
- [x] `handler/review.go` — `POST /customer/reviews`, `GET /shop/products/:slug/reviews`, admin management
- [x] Test: submit review on non-delivered order → 403; duplicate review → 409; valid review → 201

### 2.11 Analytics API
- [x] `GET /admin/analytics/overview` — concurrent errgroup pipeline: total orders, revenue, customers, out-of-stock products
- [x] `GET /admin/analytics/orders/chart` — grouped by month (last 6 months), revenue + count
- [x] Test: verify concurrent pipeline correctness

### 2.12 Backend QA
- [x] Public endpoints return correct data without auth
- [x] Admin routes return `401` without admin token; customer token on admin route → `401`
- [x] Customer routes return `401` without customer token
- [x] Validation errors return `422`
- [x] Stock decrement atomic under concurrent requests (test with two simultaneous checkout requests for same last-stock item)
- [x] Image upload/delete cycle (Cloudinary) berjalan
- [x] Email flow (Resend) berjalan

---

## Phase 3 — Admin Dashboard (React)

> **Dokumen yang dibuka:**
> - `CONTEXT.md` — scope
> - `ARCHITECTURE.md` — folder structure frontend, auth strategy
> - `API.md` — admin routes saja
> - `DESIGN.md` — full doc
> - `ENV.md` — `VITE_API_BASE_URL` saja
> - `TASKS.md` — Phase 3 checklist saja
>
> **Yang diminta ke AI:** per halaman atau per komponen besar. Sertakan `DESIGN.md` + `API.md` tiap prompt.

### 3.1 Project Setup
- [x] `npm create vite@latest client -- --template react-ts`
- [x] Install deps: `tailwindcss`, `gsap`, `lenis`, `zustand`, `react-hook-form`, `zod`, `@hookform/resolvers`, `axios`, `react-router-dom`, `hugeicons-react`, `sonner`
- [x] Setup Tailwind v4 + `DESIGN.md` tokens di `index.css`
- [x] Self-host fonts (Playfair Display + DM Sans) di `public/fonts/`, `@font-face` di `index.css`
- [x] `lib/api/client.ts` — Axios instance + admin JWT interceptor + auto-logout on 401
- [x] `lib/api/customerClient.ts` — Axios instance + customer JWT interceptor + auto-logout on 401
- [x] `lib/api/types.ts` — 25+ TypeScript interfaces matching backend DTOs
- [x] `lib/api/products.ts`, `customer.ts`, `admin.ts` — API functions for all endpoints
- [x] `stores/adminAuthStore.ts`, `customerAuthStore.ts`, `cartStore.ts`, `orderStore.ts`, `productStore.ts`

### 3.2 Admin Auth
- [x] `pages/admin/LoginPage.tsx`
- [x] `AdminRoute.tsx` — guard, redirect ke `/admin/login` jika no token
- [x] Silent `checkAuth` on mount via `POST /admin/refresh`
- [x] Logout clears adminAuthStore + calls `POST /admin/logout`

### 3.3 Admin Layout
- [x] `components/admin/Sidebar.tsx`
- [x] `components/admin/TopBar.tsx`
- [x] `AdminLayout.tsx` wrapper

### 3.4 Dashboard Page
- [x] `pages/admin/DashboardPage.tsx` — fetches from `/admin/analytics/*` (pure API, no fallback)
- [x] `StatsCard.tsx` — 4 stat cards (orders, revenue, customers, out-of-stock)
- [x] Bar chart: orders per month + revenue per month

### 3.5 Products Page
- [x] `pages/admin/ProductsPage.tsx`
- [x] Product list table with category filter + search
- [x] Create/Edit product modal — includes multi-image upload (`ImageUploader.tsx`)
- [x] Variant management panel (add/edit/deactivate variants per product)
- [x] Delete product with confirm dialog

### 3.6 Orders Page
- [x] `pages/admin/OrdersPage.tsx`
- [x] `DataTable.tsx` — reusable paginated table
- [x] Filter by status + payment_status + search by order_number/email
- [x] Order detail panel (slide-in or modal) — shows items, address, timeline
- [x] Inline status update + payment update

### 3.7 Customers Page
- [x] `pages/admin/CustomersPage.tsx`
- [x] Customer list table with search
- [x] Customer detail modal — profile + order summary
- [x] Toggle active/inactive status

### 3.8 Reviews Page
- [x] `pages/admin/ReviewsPage.tsx`
- [x] Reviews table with product filter + published filter
- [x] Toggle publish/unpublish
- [x] Delete with confirm

### 3.9 Frontend-Backend Integration (Mock Data Removal)
- [x] Create `lib/api/` client layer (dual Axios instances, types, all API functions)
- [x] Rewrite all stores to be pure-API (no mock fallbacks)
- [x] Delete `lib/mockData.ts`
- [x] Delete `lib/api/helpers.ts` (withFallback, isNetworkError removed)
- [x] Rewrite `OrdersPage.tsx` — removed MOCK_ORDERS, pure API CRUD
- [x] Rewrite `CustomersPage.tsx` — removed MOCK_CUSTOMERS, pure API CRUD
- [x] Rewrite `ReviewsPage.tsx` — removed MOCK_REVIEWS, pure API CRUD
- [x] Rewrite `ProductsPage.tsx` — removed MOCK_PRODUCTS/CATEGORIES, pure API CRUD + categories from server
- [x] Fix `DashboardPage.tsx` — removed orphaned duplicate stats def
- [x] Fix `OrderTrackingPage.tsx` — removed broken updateOrderStatus call
- [x] Fix `Customer` type — `phone: string | null` to match API response
- [x] Verify: `npm run build` + `go vet ./...` pass

---

## Phase 4 — Public Frontend (React)

> **Dokumen yang dibuka:**
> - `CONTEXT.md` — scope, customer persona
> - `ARCHITECTURE.md` — folder structure frontend
> - `API.md` — public shop routes + customer order/review routes
> - `DESIGN.md` — **full doc** — most critical for this phase
> - `ENV.md` — `VITE_API_BASE_URL` saja
> - `TASKS.md` — Phase 4 checklist saja

### 4.1 Global Setup
- [x] `lib/lenis.ts` — init Lenis + integrate GSAP ticker
- [x] `lib/gsap.ts` — register ScrollTrigger + `JuicyMotion` presets
- [x] `components/layout/Navbar.tsx` — logo center, links left, cart icon + auth right
- [x] `components/layout/Footer.tsx`
- [x] `App.tsx` — router + Lenis init + ScrollToTop

### 4.2 Custom UI Primitives
- [x] `Button.tsx` — `variant: primary | ghost | sand`
- [x] `Badge.tsx` — product tags + sale
- [x] `Input.tsx`, `Textarea.tsx`, `Select.tsx`
- [x] `Divider.tsx` — Sand divider
- [x] `StarRating.tsx` — display + interactive modes

### 4.3 Home Page
- [x] `HeroSection.tsx` — full-bleed, GSAP headline word reveal
- [x] `FeaturedSection.tsx` — featured products grid (3-col)
- [x] `CollectionPreview.tsx` — category tiles
- [x] `EditorialSection.tsx` — large image + text composition (asymmetric)
- [x] `CtaSection.tsx` — brand statement + shop CTA
- [x] GSAP ScrollTrigger: `fadeUp` + `gridStagger` + `imageDrift` on editorial image

### 4.4 Collection Page
- [x] `CollectionPage.tsx` — product grid with category filter tabs + sort dropdown
- [x] `ProductGrid.tsx` + `ProductCard.tsx`
- [x] Pagination
- [x] Loading skeleton
- [x] Empty state

### 4.5 Product Detail Page (PDP)
- [x] `ProductPage.tsx`
- [x] `ProductImageGallery.tsx` — thumbnail strip + main image
- [x] `VariantSelector.tsx` — size pills + color swatches; out-of-stock indication
- [x] Add to cart button — stock check, loading state
- [x] Product info: name, price, compare_at_price (strikethrough), tags, description
- [x] Reviews section with `ReviewCard.tsx` + pagination
- [x] Average rating display with `StarRating.tsx`

### 4.6 Cart Page
- [x] `CartPage.tsx`
- [x] Cart item list (image, name, variant, price, quantity stepper, remove)
- [x] Order summary sidebar (subtotal, shipping fee placeholder, total)
- [x] Proceed to checkout CTA (requires customer auth — redirect to login if not authenticated)
- [x] Empty cart state

### 4.7 Checkout Page (Protected — Customer)
- [x] `CheckoutPage.tsx`
- [x] Address selector (from saved addresses) + add new address inline
- [x] Order summary (read-only)
- [x] Payment method selector (COD for MVP; placeholder for gateway)
- [x] Notes field
- [x] Place order button + loading state
- [x] Success redirect to order detail

### 4.8 Order Tracking Page (Protected — Customer)
- [x] `OrderTrackingPage.tsx`
- [x] Access by order_number from URL param
- [x] Order status timeline (visual step indicator: Pending → Confirmed → Processing → Shipped → Delivered)
- [x] Order items list
- [x] Shipping address display
- [x] Review CTA on delivered items (links to review form if not yet reviewed)

### 4.9 Public QA
- [x] Responsive mobile + desktop
- [x] `prefers-reduced-motion` untuk GSAP
- [x] Error + loading + empty states semua terpenuhi
- [x] No FOUT (font flash)
- [x] 0 ESLint errors/warnings in production build

---

## Phase 5 — Customer Auth Frontend (React)

> **Dokumen yang dibuka:**
> - `API.md` — customer auth + profile + address routes
> - `DESIGN.md` — full doc
> - `ARCHITECTURE.md` — customer auth flow, customerApi.ts

### 5.1 Auth Pages
- [x] `lib/api/customerClient.ts` — separate Axios instance + customer JWT interceptor
- [x] `stores/customerAuthStore.ts` — Zustand (token, customer, addresses, login/register/logout/fetchProfile)
- [x] `pages/customer/LoginPage.tsx` — form
- [x] `components/common/ProtectedRoute.tsx` — customer route guard

### 5.2 Profile Page
- [x] `pages/customer/ProfilePage.tsx`
- [x] Edit profile form (name, phone)
- [x] Change password form (current + new)
- [x] Address management: list, add, edit, delete, set default

### 5.3 Order History Page
- [x] `pages/customer/OrderHistoryPage.tsx` (not yet built)
- [x] Order list with status badges + total
- [x] Link to order tracking per order
- [x] "Write a Review" CTA for delivered orders without review

---

## Phase 6 — Deployment

> **Dokumen yang dibuka:**
> - `ENV.md` — Railway notes, semua production env vars
> - `TASKS.md` — Phase 6 checklist saja

- [ ] Push ke GitHub
- [ ] Railway: buat project + PostgreSQL plugin
- [ ] Deploy backend, set semua env vars
- [ ] Run migrations di Railway DB
- [ ] Deploy frontend, set `VITE_API_BASE_URL`
- [ ] Set `ALLOWED_ORIGINS` ke frontend URL
- [ ] Smoke test end-to-end (register → browse → cart → checkout → track order → review)
- [ ] Custom domain (opsional)

---

## Notes for AI Agents

1. Baca dulu dokumen yang tertera di header phase sebelum mulai.
2. `DESIGN.md` hanya relevan di Phase 3, 4, dan 5 — jangan sertakan di Phase 1 & 2.
3. `ERD.md` hanya relevan di Phase 1 & 2 — setelah itu schema sudah settled.
4. Referensi `API.md` untuk field names — jangan tebak sendiri.
5. Referensi `ENV.md` untuk nama env var — jangan hardcode nilai apapun.
6. Kerjakan satu subphase per sesi. Selesaikan dan verifikasi dulu sebelum lanjut.
7. Semua Go struct wajib punya GORM tag + JSON tag.
8. Semua React component wajib typed — tidak ada `any`.
9. Folder baru diletakkan sesuai `ARCHITECTURE.md` — jangan improvisasi struktur.
10. Response backend selalu pakai envelope dari `ARCHITECTURE.md` — `{ success, data, message/error }`.
11. **Admin auth dan Customer auth adalah dua flow terpisah** — JWT secret berbeda, middleware berbeda, Zustand store berbeda, Axios instance berbeda. Jangan campur aduk.
12. **Stock decrement selalu dalam transaction** — `SELECT FOR UPDATE` sebelum decrement. Tidak boleh ada race condition di checkout.
13. **Order items wajib snapshot** — salin `product_name`, `variant_size`, `variant_color`, `image_url`, `unit_price` saat order dibuat. Jangan query ulang dari products table untuk display order history.
14. **Reviews wajib purchase-verified** — selalu validasi bahwa `order_id` milik customer yang bersangkutan dan order status adalah `delivered`.
