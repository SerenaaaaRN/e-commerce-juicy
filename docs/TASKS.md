# TASKS.md — Juicy
> Phased task breakdown. Update status as you go: `[ ]` todo → `[~]` in progress → `[x]` done.
>
> Fase 1–10 (Database, Backend API, Admin Dashboard, Frontend, Deployment, Shop Enhancements, Bug Fixes) sudah selesai — lihat `CHANGELOG.md`, `ARCHITECTURE.md`, `API.md`, `ERD.md` untuk detail.

---

## Phase 11 — Testing & Infrastructure 📋

> **Goal:** Prevent regression, streamline developer onboarding, enforce code quality.

### 11.1 Backend Tests (Go)
- [ ] Unit tests untuk semua service layer (table-driven tests)
- [ ] Integration tests untuk handler + router (Gin test mode)
- [ ] Repository tests dengan testcontainers (PostgreSQL)
- [ ] Run `go test ./...` in CI

### 11.2 Frontend Tests (Vitest)
- [ ] Unit tests untuk Zustand stores (state + actions)
- [ ] Component tests untuk komponen kritis (CheckoutPage, OrderTrackingPage)
- [ ] API client mock tests

### 11.3 Docker Compose
- [ ] `docker-compose.yml` dengan PostgreSQL + Go backend
- [ ] `Dockerfile` untuk backend (multi-stage build)
- [ ] Developer setup script (one command up)

### 11.4 CI/CD (GitHub Actions)
- [ ] Backend: lint (`golangci-lint`) + typecheck (`go build`) + test
- [ ] Frontend: lint (`eslint`) + typecheck (`tsc --noEmit`) + test + build
- [ ] Security scanning (`gosec`, `npm audit`)

---

## Phase 12 — Backend Hardening & Quality 📋

> **Goal:** Production readiness — security, observability, reliability.

### 12.1 Payment Gateway Integration
- [ ] Pilih provider (Midtrans / Xendit / Stripe)
- [ ] Implement `PaymentService` (replace current stub)
- [ ] Webhook handler untuk payment confirmation
- [ ] Payment status sync (unpaid → paid / refunded)

### 12.2 API Versioning & Documentation
- [ ] Prefix routes dengan `/api/v1/...`
- [ ] Generate OpenAPI 3.0 spec (swaggo/swag)
- [ ] Swagger UI endpoint

### 12.3 Security Hardening
- [ ] Rate limiting di `/customers/login`, `/admin/login` (brute-force protection)
- [ ] Request body size limits (Gin middleware)
- [ ] Helmet-equivalent security headers

### 12.4 Observability
- [ ] Replace `log.Default()` dengan `slog` atau `zerolog`
- [ ] Structured JSON logging (level, request_id, duration, error)
- [ ] Request ID propagation middleware
- [ ] Health check endpoint lebih detail (`/health` — DB ping, uptime, version)

### 12.5 Search & Performance
- [ ] Full-text search: replace `LIKE '%term%'` dengan PostgreSQL `tsvector` + GIN index
- [ ] Product listing query optimization (N+1 preloads)
- [ ] Add `LIMIT` cap on all paginated queries

### 12.6 Soft Delete Consistency
- [ ] Product: soft delete (`deleted_at`) instead of hard delete
- [ ] Review: soft delete instead of hard delete
- [ ] Consistent `is_active` / `deleted_at` convention across all models

### 12.7 Order Return Flow
- [ ] Implement return request by customer
- [ ] Admin return approval workflow
- [ ] Stock restore on return approval
- [ ] Refund payment status integration

---

## Phase 13 — Frontend Architecture 📋

> **Goal:** Better DX, performance, and maintainability.

### 13.1 TanStack Query Integration
- [ ] Evaluate migration from Zustand direct API calls to TanStack Query
- [ ] Query keys strategy + stale times per domain
- [ ] Mutation hooks untuk write operations
- [ ] Optimistic updates untuk cart, wishlist

### 13.2 Code Splitting
- [ ] `React.lazy()` + `Suspense` untuk semua route pages
- [ ] Chunk naming strategy (feature-based)
- [ ] Bundle analysis (`vite-bundle-visualizer`)

### 13.3 Error Handling & UX
- [ ] Global error boundary
- [ ] API error → user-friendly toast messages (sonner already installed)
- [ ] Offline detection + stale indicator
- [ ] Retry button pattern standardization

### 13.4 Accessibility (a11y)
- [ ] Audit with axe-core
- [ ] Focus management on modal/dialog open/close
- [ ] Keyboard navigation untuk ProductFilters, VariantSelector
- [ ] Skip-to-content link

### 13.5 Admin Dashboard Enhancements
- [ ] Multi-select bulk actions (delete products, update order status)
- [ ] Export CSV (orders, customers, products)
- [ ] Sales report page (date range picker, charts)
- [ ] Activity log / audit trail

---

## Phase 14 — Business Features 📋

> **Goal:** Feature parity with production e-commerce platforms.

### 14.1 Coupon & Discount Engine
- [ ] `coupons` table (code, type, value, min_purchase, usage_limit, valid_from/to)
- [ ] Admin CRUD for coupons
- [ ] Apply coupon at checkout → discount calculation
- [ ] Usage tracking (per customer, global limit)

### 14.2 Abandoned Cart Recovery
- [ ] Cart timestamp tracking
- [ ] Background job: find abandoned carts (> 24h)
- [ ] Email reminder: "You left something behind"
- [ ] Configurable delay + max reminders

### 14.3 Back-in-Stock Notification
- [ ] `stock_notifications` table (customer_id, variant_id, notified)
- [ ] Subscribe button on PDP when stock = 0
- [ ] Background job: check restocked variants → send email

### 14.4 Social Login (OAuth)
- [ ] Google OAuth integration
- [ ] Link social account to existing customer
- [ ] Auto-register on first social login

### 14.5 Size Guide & Fit Advisor
- [ ] Size chart per category (static or image upload)
- [ ] Fit predictor based on height/weight (customer profile)
- [ ] "True to size" rating per product from reviews

---

## Phase 15 — Known Bugs 🐛

> **Status:** Unresolved — perlu diperbaiki.

### 15.1 Customer Dialog Bugs (admin panel)
- [ ] Fix "Total spent Rp.null" display in Customer Dialog — `total_spent` null handling
- [ ] Fix total spent for customer that has no order yet (show Rp 0, not null)
- [ ] Empty order history message (show "Belum ada pesanan" placeholder)
- [ ] Order lifecycle table not displaying (lifecycle order + lifecycle spent)
- [ ] Can't suspend customer — toggle button fails silently

### 15.2 Phase 10 Missing Components
- [ ] Create `BrandSpotlight.tsx` — Editorial lookbook section dengan brand story
- [ ] Create `InstagramFeed.tsx` — Social media feed grid (static placeholder)
- [ ] Create `StyleDirectory.tsx` — Grid kategori besar ala Zalora
- [ ] Integrate 3 components di HomePage.tsx (target 13 sections total)

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
