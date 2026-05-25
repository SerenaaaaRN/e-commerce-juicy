# Juicy — Luxury Fashion E-Commerce Platform

**Juicy** adalah platform e-commerce fashion mewah full-stack yang menggabungkan storefront React 19 modern dengan backend administrasi Go berperforma tinggi. Terinspirasi dari brand fashion top-tier seperti Zalora, Net-a-Porter, dan SSENSE — menghadirkan pengalaman belanja editorial luxury dengan sistem manajemen operasional yang mumpuni.

---

## 🛠️ Technology Stack

| Layer | Teknologi |
|-------|-----------|
| **Frontend** | React 19, TypeScript, Vite |
| **Styling** | Tailwind CSS v4, shadcn/ui |
| **Icons** | Hugeicons |
| **State Management** | Zustand (JWT disimpan di memori — proteksi XSS) |
| **Forms** | React Hook Form + Zod |
| **Backend** | Golang 1.20+, Gin Web Framework |
| **ORM** | GORM |
| **Database** | PostgreSQL (via golang-migrate) |
| **Auth** | JWT dual-flow (golang-jwt) — admin & customer terpisah |
| **Image Storage** | Cloudinary (upload file + paste URL) |
| **Email** | Resend (background queue) |

---

## 🏗️ Fitur Utama

### 🛍️ Storefront (Customer)

- **Homepage Editorial** — 14 section layout: Hero, Featured, Trending, New Arrivals, Recently Viewed, Newsletter, CTA, dan lainnya
- **Katalog Produk** — Filter multi-kategori, subcategory tree, filter ukuran, sorting, search (ILIKE), pagination
- **Product Detail Page** — Galeri multi-image, size/color selector dengan real-time stock, review terverifikasi
- **Keranjang & Wishlist** — Zustand store dengan optimistic UI, quantity sync instan
- **Checkout COD** — Pilih alamat (default + inline edit), ringkasan order
- **Order Tracking** — Timeline status: Pending → Confirmed → Processing → Shipped → Delivered
- **Reviews** — Hanya untuk pembelian terverifikasi (rating + ulasan tertulis)
- **Recently Viewed** — localStorage, maksimal 8 item, FIFO eviction

### 📊 Admin Dashboard

- **Analytics** — Metrik real-time: total order, revenue, customer, produk; chart mingguan (errgroup concurrent pipelines)
- **Manajemen Produk** — CRUD produk, varian (size × color × stock), multi-image gallery, URL paste image
- **Manajemen Kategori** — Nested category (parent_id), display order, soft delete dengan proteksi referensi
- **Order Processing** — Lifecycle status + payment status, auto-inventory adjustment, trigger email
- **Customer CRM** — List customer, detail + riwayat order, suspend/active toggle
- **Review Moderation** — Publish/unpublish, hapus review

---

## 🔒 Keamanan

1. **Hardened CORS Whitelist** — Middleware CORS memvalidasi `Origin` header terhadap daftar `ALLOWED_ORIGINS` dari `.env`. Origin tidak dikenal langsung diblokir.
2. **JWT Token Type Protection** — Admin & customer memiliki JWT flow terpisah. Token admin memiliki klaim `token_type` (`access` vs `refresh`):
   - **AdminAuth Middleware:** Hanya menerima `token_type == "access"`
   - **Refresh Endpoint:** Hanya menerima `token_type == "refresh"`
3. **Atomic Inventory Stock** — Decrement stok berjalan dalam transaksi PostgreSQL `SELECT FOR UPDATE` — mencegah overselling saat checkout konkuren.
4. **Verified-Purchase Reviews** — Review memerlukan foreign key ke order dengan status `delivered` milik customer tersebut — mencegah spam review.

---

## 📂 Struktur Proyek

```
juicy/
├── client/                     # React 19 Frontend
│   ├── src/
│   │   ├── features/           # Domain-based (home, shop, cart, checkout, admin...)
│   │   ├── components/         # Shared UI (shadcn/ui primitives, layout)
│   │   ├── lib/api/            # Axios instances + interceptor refresh token
│   │   ├── stores/             # Zustand global state
│   │   └── index.css           # Global styles (terracotta theme, OKLCH tokens)
│
├── server/                     # Golang Backend
│   ├── cmd/main.go             # Entrypoint (DI + server boot)
│   ├── internal/
│   │   ├── middleware/         # CORS, AdminAuth, CustomerAuth
│   │   ├── model/              # GORM entities
│   │   ├── repository/         # Database persistence
│   │   ├── service/            # Business logic
│   │   ├── handler/            # Gin HTTP handlers
│   │   └── router/             # Route registrations
│   └── migrations/             # SQL migrations (000001 — 000014)
│
└── docs/                       # Dokumentasi sistem
    ├── CONTEXT.md              # Konteks proyek, goals, scope
    ├── ARCHITECTURE.md         # Arsitektur & data flow
    ├── API.md                  # Seluruh REST API contract
    ├── ERD.md                  # Entity relationship diagram
    ├── ENV.md                  # Dokumentasi environment variables
    ├── DESIGN.md               # Design system (luxury editorial)
    ├── TASKS.md                # Implementation checklists
    └── CHANGELOG.md            # Riwayat perubahan per sesi
```

---

## 🚀 Panduan Setup

### Prerequisites
- Go 1.20+
- Node.js 18+
- PostgreSQL

### 1. Database
```bash
# Buat database
createdb juicy

# Jalankan migrations
migrate -path server/migrations \
  -database "postgres://postgres:postgres@localhost:5432/juicy?sslmode=disable" up
```

### 2. Environment Variables
```bash
cp server/.env.example server/.env
# Isi semua konfigurasi (JWT secrets, Cloudinary, Resend, dll.)
```

### 3. Jalankan Backend
```bash
cd server
go run cmd/main.go
# Server berjalan di http://localhost:8080
```

### 4. Jalankan Frontend
```bash
cd client
npm install
npm run dev
# Aplikasi di http://localhost:5173
```

---

## 📖 Dokumentasi Lengkap

Dokumentasi detail tersedia di folder [`docs/`](docs/):

| Dokumen | Isi |
|---------|-----|
| [API.md](docs/API.md) | Seluruh endpoint REST — request, response, error codes |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Arsitektur sistem, folder structure, data flow |
| [ERD.md](docs/ERD.md) | Database schema, relationships, migration order |
| [ENV.md](docs/ENV.md) | Semua environment variables + cara generate secrets |
| [DESIGN.md](docs/DESIGN.md) | Design system editorial luxury (warna, tipografi, patterns) |
| [CHANGELOG.md](docs/CHANGELOG.md) | Riwayat perubahan per sesi development |
| [TASKS.md](docs/TASKS.md) | Implementation checklists |
| [CONTEXT.md](docs/CONTEXT.md) | Konteks proyek, goals, target users |

---

## 📝 API Response Envelope

Semua response API mengikuti format JSON yang konsisten:

```json
// Sukses
{ "success": true, "data": { ... }, "message": "..." }

// Paginated
{ "success": true, "data": [ ... ], "meta": { "page": 1, "per_page": 20, "total": 100 } }

// Error
{ "success": false, "error": "Pesan", "code": "MACHINE_CODE" }
```

---
