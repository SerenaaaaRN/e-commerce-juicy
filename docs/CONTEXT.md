# CONTEXT.md — Juicy
> Project context, goals, and scope for AI agents and developers.

---

## Project Overview

**Juicy** is a luxury fashion e-commerce brand. This project is a full-stack web application serving as the brand's digital storefront — combining an editorial public-facing website with an internal admin dashboard for operations management, and a full customer-facing shopping experience including cart, checkout, order tracking, and reviews.

---

## Goals

### Primary
- Establish a premium, editorial online presence aligned with the Jacquemus-inspired warm aesthetic.
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

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript + Vite |
| Styling | Tailwind CSS v4 (custom, no component library) |
| Icons | Hugeicons |
| Scroll | Lenis |
| Animation | GSAP + ScrollTrigger |
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

Refer to `DESIGN.md` for full token reference.

- **Theme:** Light, warm, editorial — "Warm Editorial Canvas"
- **Inspiration:** Jacquemus — warm beige/cream dominant, playful asymmetric layouts, bold typography, premium yet approachable
- **Primary palette:** Cream `#f5efe6`, Sand `#c9b99a`, Terracotta `#b5633a`, Chalk `#faf7f2`, Dust `#8c7b6b`
- **Typography:** Playfair Display (headlines) + DM Sans (body/UI)
- **Motion:** GSAP ScrollTrigger for section reveals; Lenis for smooth scroll
- **No component library** — all UI is custom-built to match the DESIGN.md spec precisely

---

## Development Phases

| Phase | Focus |
|---|---|
| 1 | Database schema, migrations, pgAdmin setup |
| 2 | Backend API (Golang Gin) — all endpoints |
| 3 | Admin dashboard (React) |
| 4 | Public frontend — Landing, Collection, PDP, Cart, Checkout, Order Tracking |
| 5 | Customer auth frontend — Register, Login, Profile, Order History |

---

## Repository Structure

```
juicy/
├── client/          # React + Vite frontend
├── server/          # Golang Gin backend
├── docs/            # All markdown documentation
│   ├── CONTEXT.md
│   ├── DESIGN.md
│   ├── ARCHITECTURE.md
│   ├── ERD.md
│   ├── API.md
│   ├── TASKS.md
│   └── ENV.md
└── README.md
```

---

## Conventions

- All API responses follow a consistent JSON envelope (see `API.md`).
- Environment variables are never hardcoded — always via `.env` (see `ENV.md`).
- DB migrations are handled via `golang-migrate` — never AutoMigrate in production.
- Frontend communicates with backend only through the defined API contract in `API.md`.
- Image URLs stored in DB are always Cloudinary `secure_url` strings.
- Customer auth and Admin auth are completely separate JWT flows — different secrets, different middleware, different Zustand stores.
