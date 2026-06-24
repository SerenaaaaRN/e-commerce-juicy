# JUICY — Luxury Fashion E-Commerce

<p align="center">
  <img src="https://cdn.simpleicons.org/react/61DAFB" height="80" alt="React"/>
  <img src="https://cdn.simpleicons.org/go/00ADD8" height="80" alt="Go"/>
</p>

<p align="center">
  <b>Luxury Fashion E-Commerce</b><br>
  React 19 SPA + Go 1.26 API · PostgreSQL · TanStack Query · Zustand
</p>

<p align="center">
  <img src="https://cdn.simpleicons.org/typescript/3178C6" height="28"/>&nbsp;
  <img src="https://cdn.simpleicons.org/vite/646CFF" height="28"/>&nbsp;
  <img src="https://cdn.simpleicons.org/tailwindcss/06B6D4" height="28"/>&nbsp;
  <img src="https://cdn.simpleicons.org/reactquery/FF4154" height="28"/>&nbsp;
  <img src="https://cdn.simpleicons.org/gin/0097D3" height="28"/>&nbsp;
  <img src="https://cdn.simpleicons.org/postgresql/4169E1" height="28"/>&nbsp;
</p>

---

## Struktur Proyek

```
juicy/
├── client/              # React SPA
│   ├── CLAUDE.md        # Full Docs Frontend
│   └── src/
│       ├── features/    # auth, shop, cart, checkout, orders, profile, wishlist, admin, home, category, heritage
│       ├── components/  # common/, layout/, ui/ (shadcn)
│       ├── hooks/       # useAuth, useDebounce, useConfirm, useCartQueries, dll.
│       ├── lib/api/     # Axios instances + domain services
│       ├── stores/      # Zustand (auth, theme)
│       └── constants/   # routes, paths, order-status
│
├── server/              # Go API
│   ├── CLAUDE.md        # Full Docs Backend
│   └── internal/
│       ├── handler/     # 12 HTTP handler (request/response)
│       ├── service/     # 14 business logic files
│       ├── repository/  # 9 GORM query files
│       ├── model/       # 10 GORM entities
│       ├── middleware/  # CORS, AdminAuth, CustomerAuth
│       └── migrations/  # 5 SQL migrations + seed.sql
│
└── .claude/             # Claude Code konfigurasi
```

---

## Fitur Utama

### 🛍️ Customer

- **Katalog Produk** — Navigasi kategori tree (4 level), filter ukuran, sortir (harga, popularitas, terbaru), pencarian, pagination + infinite scroll
- **Manajemen Keranjang** — Tambah/hapus/ubah quantity item, stock validation real-time, sinkronisasi penuh dengan server
- **Wishlist** — Simpan produk favorit, cek status wishlist di halaman produk, toggle add/remove
- **Checkout COD** — Pilih alamat pengiriman (CRUD + set default), ringkasan pesanan, konfirmasi pesanan
- **Pesanan & Tracking** — Riwayat pesanan lengkap, tracking status (pending → confirmed → processing → shipped → delivered), batalkan pesanan (jika memungkinkan), konfirmasi penerimaan
- **Review Produk** — Rating + ulasan tertulis, hanya untuk pembelian terverifikasi (status delivered), moderasi otomatis published
- **Manajemen Profil** — Edit data diri, ganti password, kelola daftar alamat pengiriman
- **Autentikasi** — Register dengan validasi password ketat, login customer, login admin, proteksi halaman via auth guard

### 📊 Admin

- **Dashboard Analitik** — Ringkasan revenue total, jumlah pesanan, pertumbuhan customer, stok produk; grafik revenue & order per bulan
- **Manajemen Produk** — CRUD produk + kategori (nested), varian (size/color/stock), gambar produk (upload file + URL)
- **Pemrosesan Pesanan** — Daftar pesanan dengan filter status, update status fulfillment (pending→confirmed→processing→shipped→delivered), update status pembayaran, stok otomatis berkurang saat checkout
- **CRM Customer** — Data customer lengkap, riwayat pesanan per customer, suspend/aktifkan akun
- **Moderasi Review** — Daftar review, set published/hidden, hapus review

### 🔧 Backend

- **Autentikasi Dual-Flow** — Admin: JWT access token (15 menit) + refresh token (7 hari, HttpOnly cookie) dengan silent refresh queue · Customer: JWT single token (7 hari) · bcrypt · Middleware terpisah per role
- **Transaksional Checkout** — Pessimistic locking (SELECT FOR UPDATE), validasi stok atomik, pembuatan order number format JUICY-YYMMDD-XXXXXX, snapshot data produk ke order_items, clear cart, email konfirmasi async
- **Manajemen Stok** — Stok otomatis berkurang saat checkout, restok otomatis saat order dibatalkan, validasi stok di add/update cart item
- **Validasi Review** — Multi-step: product exist → order milik customer → status delivered → product ada di order → belum pernah review sebelumnya
- **Filter Produk Lanjutan** — Recursive CTE untuk subkategori, PostgreSQL array @> untuk tags, EXISTS subquery untuk filter ukuran, ILIKE search, sortir multi-kriteria
- **Category Tree** — Self-referencing parent-child, recursive tree builder, product count aggregation dari children
- **Concurrent Analytics** — 4 goroutines paralel via errgroup untuk kalkulasi overview, 6-month chart aggregation via TO_CHAR
- **Background Worker** — Pool goroutines + channel queue, graceful shutdown, panic recovery, fire-and-forget email notification
- **Image Upload** — Cloudinary integration dengan mock fallback, auto-promotion primary image saat delete, upload multiple files
- **Email Notification** — Order confirmation ke customer, admin alert untuk order baru, shipping update — semua async via background worker
- **CORS Dynamic** — Whitelist origin dari environment variable, support credentials

---

## Setup

```bash
# 1. Database
createdb juicy
migrate -path server/migrations -database "postgres://postgres:postgres@localhost:5432/juicy?sslmode=disable" up

# 2. Backend
cp server/.env.example server/.env  # isi JWT_ADMIN_SECRET & JWT_CUSTOMER_SECRET
cd server && go run cmd/main.go     # → http://localhost:8080

# 3. Frontend
cd client && npm install && npm run dev  # → http://localhost:5173
```

---

## API Ringkas

| Group        | Auth | Endpoints                                                                   |
| ------------ | ---- | --------------------------------------------------------------------------- |
| **Public**   | —    | register, login, shop/\* (categories, products, reviews)                    |
| **Customer** | JWT  | cart CRUD, addresses CRUD, checkout, orders, wishlist, review, profile      |
| **Admin**    | JWT  | analytics, products+images+variants, categories, orders, customers, reviews |

Response: `{"success":bool, "data":T, "error":{message,code}}`  
Status: 200 · 201 · 400 · 401 · 403 · 404 · 409 · 422 · 500

---

## 📚 Dokumentasi

- **[Client Documentation](client/CLAUDE.md)** - Frontend architecture, components, state management
- **[Server Documentation](server/CLAUDE.md)** - Backend API, database schema, business logic
