# CONTEXT.md — Juicy
> Project context, goals, and scope for AI agents and developers.

---

## Project Overview

**Juicy** is a luxury fashion e-commerce brand. This project is a full-stack web application serving as the brand's digital storefront — combining a public-facing shopping experience with an internal admin dashboard for operations management.

---

## Goals

### Primary
- Allow customers to browse products, manage a cart, checkout, track orders, and leave reviews.
- Give staff a clean admin dashboard to manage products, orders, customers, and analytics.

### Secondary
- Deliver transactional emails (order confirmation, shipping update, review request).
- Store and serve product photography via Cloudinary.
- Deploy to Railway for production.

---

## Target Users

### Customers (Public)
- First-time visitors discovering the brand online.
- Returning customers browsing new collections or tracking an order.
- Authenticated shoppers managing their cart, wishlist, and purchase history.

### Staff (Admin)
- Store manager: manages products, variants, inventory, orders, and customers.
- Single admin account is sufficient for MVP — no multi-role complexity.

---

## Scope — MVP

### In Scope
- Public website: Landing, Collection, Product Detail, Cart, Checkout, Order Tracking pages.
- Customer auth: Register, Login, Profile, Order History.
- Shopping: Product catalog, product variants (size × color), cart, checkout flow.
- Order management: Status lifecycle, order tracking by customers.
- Reviews: Authenticated customers can submit star ratings + written reviews per product.
- Admin dashboard: Product CRUD (with variants), Order management, Customer list, Analytics overview.
- Email notifications: Order confirmation to customer, new order alert to admin, shipping update.
- Image uploads via Cloudinary (product images, multi-image per product).
- JWT-based auth for both admin and customers (separate token flows).
- Payment gateway: TBD — placeholder service layer stub for now; integrate in post-MVP.

### Out of Scope (Post-MVP)
- Payment gateway integration (Midtrans / Xendit / Stripe).
- Wishlist / save for later.
- Discount codes & promotions.
- Multi-language / multi-currency support.
- CMS integration.
- Mobile app.
- Real-time inventory sync.

### Planned (Phase 7 — Shop Experience Enhancement)
- Subcategory hierarchy (`parent_id` on categories table).
- Size filter (multi-select, join `product_variants`).
- Text search bar di Navbar (ILIKE on `name` + `description`).
- Product count per category di category listing.
- Grid toggle (2-column / 4-column) di CollectionPage.
- Infinite scroll sebagai alternatif pagination.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript + Vite |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Icons | Hugeicons |
| Global State | Zustand (stores call API directly — no TanStack Query) |
| Forms | React Hook Form + Zod |
| Backend | Golang + Gin |
| ORM | GORM |
| Auth | JWT (golang-jwt/jwt) — dual flow: admin + customer |
| Email | Resend (Go SDK) |
| Image Storage | Cloudinary (cloudinary-go) |
| Database | PostgreSQL |
| DB GUI | pgAdmin 4 (local) |
| Deployment | Railway |

---

## Design Philosophy

- **Base:** shadcn/ui (zinc) — all components are shadcn primitives, unstyled overrides are minimal
- **Accent color:** Terracotta `#b5633a` — used for primary CTAs, active states, highlights
- **Background:** Zinc scale (shadcn default light theme)
- **No custom design system** — DESIGN.md is retired; do not reference it

---

## Development Phases

| Phase | Status | Focus |
|---|---|---|
| 1 | ✅ Done | Database schema, migrations, pgAdmin setup |
| 2 | ✅ Done | Backend API (Golang Gin) — all endpoints |
| 3 | ✅ Done | Admin dashboard (React) — refactored to clean architecture (hooks + components + validations) |
| 4 | 🔄 In Progress | Public frontend — Landing, Collection, PDP, Cart, Checkout, Order Tracking |
| 5 | 🔄 In Progress | Customer auth frontend — Register, Login, Profile, Order History |
| 6 | [ ] | Deployment to Railway |
| 7 | 📋 Planned | Shop Experience Enhancement — subcategories, size filter, search, grid toggle, infinite scroll |

---

## Repository Structure

```
juicy/
├── client/          # React + Vite frontend
├── server/          # Golang Gin backend
├── docs/            # All markdown documentation
│   ├── CONTEXT.md
│   ├── ARCHITECTURE.md
│   ├── ERD.md
│   ├── API.md
│   ├── TASKS.md
│   └── ENV.md
└── README.md
```

> `DESIGN.md` has been retired — shadcn/ui handles all component styling.

---

## Conventions

- All API responses follow a consistent JSON envelope (see `API.md`).
- Environment variables are never hardcoded — always via `.env` (see `ENV.md`).
- DB migrations are handled via `golang-migrate` — never AutoMigrate in production.
- Frontend communicates with backend only through the defined API contract in `API.md`.
- Image URLs stored in DB are always Cloudinary `secure_url` strings.
- Customer auth and Admin auth are completely separate JWT flows — different secrets, different middleware, different Zustand stores.
- **Admin UI must use shadcn primitives** — `Table` not `<table>`, `Select` not `<select>`, `Checkbox` not `<input type="checkbox">`, `Separator` not `<hr>`, `Badge` variants not raw color classes (`text-green-600`, etc.). Inline SVG icons must be replaced with `HugeiconsIcon`. Chart colors must reference CSS variables (`hsl(var(--primary))`) not raw `oklch()` values.
- **Admin feature follows clean architecture** — business logic in `hooks/`, validation schemas in `validations.ts`, form/derived types in `types.ts`, presentational dialogs in `components/`, page files are thin orchestrators. Do not put business logic inside page components.
- **Use `type` not `interface`** for all TypeScript definitions (props, form values, domain models). Always use arrow function components.
- **Admin-specific API response types** (`AdminOrder`, `AdminReview`) are separate from customer-facing types (`Order`, `Review`), matching the Go backend's separate admin DTO pattern.