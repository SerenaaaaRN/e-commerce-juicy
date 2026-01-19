# TO-DO LIST

## Project E-Commerce Sederhana (Full Stack NextJS)

**Stack:** Next.js 16 + Supabase + Tailwind + Shadcn UI  
**Target:** Learning Project, clean architecture, non-enterprise

---

# Struktur Project

```text
src/
├───app
│   ├───(admin)
│   │   └───dashboard
│   └───(auth)
│       ├───auth
│       │   └───callback
│       └───login
│   └───(store)
├───components
│   ├───admin
│   ├───store
│   ├───atoms
│   ├───molecules
│   └───organism
├───hooks
├───lib
├───types
└───utils
    └───supabase
```

---

# ==================================================

# PHASE 0 — PROJECT INITIALIZATION

# ==================================================

[x] Inisialisasi Next.js 15 (App Router)
[x] Setup route group (auth, store, admin)
[x] Setup Git repository
[x] Setup environment variables
[x] Validasi dev & build berjalan

# ==================================================

# PHASE 1 — BACKEND FOUNDATION (DATABASE & AUTH)

# ==================================================

## Database Schema

[x] Desain schema database (DDL)
[x] Table profiles + role
[x] Table categories
[x] Table products
[x] Table orders
[x] Table order_items

## Database Automation & Security

[x] Trigger auto-create profile (Supabase Auth)
[x] RLS user (akses data sendiri)
[x] RLS public read produk aktif
[x] RLS admin full access
[x] Seed admin & dummy data

## Authentication

[x] Login
[x] Register
[x] Forgot password
[x] Middleware proteksi admin route

# ==================================================

# PHASE 2 — DESIGN SYSTEM & UI FOUNDATION

# ==================================================

## Styling Foundation

[x] Tailwind CSS setup
[x] globals.css + CSS Variables
[x] Design tokens (color, typography, spacing)

## Shadcn UI

[x] Shadcn initialization
[x] Core components (Button, Input, Card, Dialog)
[x] Atoms-based UI architecture
[x] Molecules & organisms built from atoms

## Global Layout

[x] Root layout (Provider, Theme, Toaster)

[x] Store layout
[x] Navbar responsive (mobile & desktop)
[x] Footer grid layout

[x] Admin layout
[x] Sidebar + active state
[x] Header + mobile sidebar trigger
[x] Admin route isolated dari public page

# ==================================================

# PHASE 3 — ADMIN DASHBOARD (CONTENT & INVENTORY)

# ==================================================

## Product Management

[x] Product list (Supabase data)
[x] Search produk (?q= URL params)
[x] Create product (React Hook Form + Zod)
[x] Auto-generate slug
[x] Validasi input
[x] Edit product (populate existing data)
[x] Fix React 19 (useFormState → useActionState)
[x] Delete product (confirmation + soft delete)

## Media Management

[x] Supabase Storage bucket (products)
[x] RLS (Public Read, Admin Upload)
[x] Image upload component
[x] Image preview
[x] Replace image saat edit

## Dashboard Overview

[x] Shadcn Sidebar (New York Style)
[x] Collapsible + nested menu
[x] KPI cards (Revenue, Sales, Products)
[x] Overview bar chart
[x] Recent sales list
[x] Responsive grid layout

## Category Management

[x] CRUD kategori
[x] Quick add kategori dari form produk
[ ] saat ini user umum tanpa bukan role admin masih bisa crud dan masuk dashboard lewat url

## Admin Table Enhancement (NEXT)

[ ] TanStack Table integration
[ ] Sorting
[ ] Filtering (search & category)
[ ] Server-side pagination
[ ] Inline Active / Inactive toggle
[ ] Low-stock badge
[ ] Sonner toast (success & error)
[ ] Currency formatter (Rupiah)

# ==================================================

# PHASE 4 — STOREFRONT (CLIENT EXPERIENCE)

# ==================================================

## Store Foundation

[x] Layout store & admin terpisah
[x] Landing page dinamis (SSR)
[x] Fetch produk aktif & terbaru
[x] Catalog grid responsif (Mobile 2 col, Desktop 4 col)
[x] Product detail page (/products/[slug])
[x] Fix slug data lama (SQL backfill)

## Shoping Cart Logic

[ ] Setup Database Cart (Table carts & cart_items)
[ ] Server Action: addToCart (Cookie based session)
[ ] Client Component: AddToCartButton (Interaktif + Loading state)
[ ] Cart Page UI (/cart)
[ ] Update Quantity & Remove Item

## Store UX (NEXT)

[ ] Filter produk via URL params (Category)
[ ] Search bar di Navbar berfungsi
[ ] Disable add-to-cart jika stok habis
[ ] Empty cart state

# ==================================================

# PHASE 5 — TRANSACTION & PAYMENT

# ==================================================

## Checkout

[ ] Checkout Button (Cart -> Order)
[ ] Form alamat pengiriman
[ ] Kalkulasi ongkir (Static/JNE API optional)
[ ] Final price validation (Server-side)

## Payment Gateway

[ ] Integrasi Midtrans (Snap)
[ ] Handle Payment Callback (Webhook)
[ ] Update status order otomatis

## User Dashboard (Customer)

[ ] List transaksi user
[ ] Detail status pengiriman

# ==================================================

# PHASE 6 — UI POLISH & UX HARDENING

# ==================================================

## UI Refinement

[ ] Skeleton loading (Home, Detail, Cart)
[ ] Toast notification (Success Add to Cart)
[ ] 404 Not Found Page custom
[ ] Metadata SEO dinamis

## Mobile UX

[ ] Responsive admin table
[ ] Mobile-friendly cart & checkout
[ ] Sticky CTA

## Access Control UX

[ ] Hide UI berdasarkan role
[ ] Disable action berdasarkan status

# ==================================================

# PHASE 7 — OPTIMIZATION & DEPLOYMENT

# ==================================================

## Stability

[ ] Error boundaries
[ ] 404 page
[ ] Logging error & transaksi

## SEO

[ ] Metadata dinamis
[ ] OpenGraph
[ ] SEO-friendly URL

## Deployment

[ ] Env validation
[ ] Deploy Vercel
[ ] Final UAT

---

## CATATAN SCOPE

✔ Fokus pembelajaran  
✔ Arsitektur rapi  
✘ Tidak mencakup:

- Multi-warehouse
- Refund automation
- Advanced promotion
- Role enterprise
