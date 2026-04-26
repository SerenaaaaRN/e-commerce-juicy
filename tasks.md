# Juicy Frontend — Upgrade Tasks

## 🐛 Priority 1: Bug Fixes

### 1.1 Fix `payment_method` missing di orderStore
- **File**: `client/src/stores/orderStore.ts:56-58`
- **Issue**: `placeOrder()` memanggil `ordersApi.checkout()` tanpa mengirim `payment_method`, padahal `CheckoutPage.tsx` sudah menyertakannya.
- **Fix**: Teruskan `payload.payment_method` ke `ordersApi.checkout()`.

---

## 🧹 Priority 2: Low-Hanging Fruit

### 2.1 Logout Admin panggil API
- **File**: `client/src/components/layout/AdminLayout.tsx`
- **Issue**: `handleLogout()` hanya clear store lokal, tidak panggil `adminApi.logout()` ke backend.
- **Fix**: Panggil `adminApi.logout()` sebelum logout dari store.

### 2.2 Edit Address di Profile
- **File**: `client/src/features/profile/components/AddressList.tsx`, `AddressFormModal.tsx`
- **Issue**: Endpoint `PUT /api/addresses/:id` sudah ada di backend & `ordersApi` tapi tidak ada UI untuk edit address.
- **Fix**: Tambah tombol edit di `AddressCard.tsx`, modal edit menggunakan `AddressForm` yang sudah ada.

### 2.3 Edit Kategori di Admin
- **File**: `client/src/features/admin/ProductsPage.tsx`, `client/src/features/admin/hooks/useProducts.ts`
- **Issue**: `adminApi.updateCategory()` sudah didefinisikan tapi tidak pernah dipanggil.
- **Fix**: Tambah tombol edit di tabel kategori.

### 2.4 View & Edit Variant di Admin
- **File**: `client/src/features/admin/hooks/useVariants.ts`, `VariantManagerDialog.tsx`
- **Issue**: `adminApi.getVariants()` & `adminApi.updateVariant()` sudah didefinisikan tapi tidak dipakai.
- **Fix**: Tampilkan daftar variants dari API (bukan dari `activeProduct` saja) & form edit variant.

---

## 🚀 Priority 3: New Features (High Impact)

### 3.1 Search Produk
- **File**: `client/src/components/layout/Navbar.tsx`
- **Issue**: Search bar ada di Navbar tapi belum terhubung ke API.
- **Fix**: Navigasi ke `/shop?search=query` atau langsung fetch produk.

### 3.2 Wishlist / Favorit
- **Butuh**: Model & endpoint baru di backend, store + UI di frontend.

### 3.3 Batalkan Pesanan
- **Butuh**: Endpoint baru di backend (e.g., `POST /orders/:orderNumber/cancel`), button + konfirmasi di `OrderTrackingPage.tsx`.

### 3.4 Recently Viewed Products
- **Client-side**: Simpan di localStorage, tampilkan di home page atau sidebar.

---

## 📈 Priority 4: Admin Enhancement

### 4.1 Bulk Actions
- Batch update status pesanan/produk.

### 4.2 Export CSV/Excel
- Export orders & customers.

### 4.3 Manajemen Kupon
- CRUD diskon dari admin (butuh model backend baru).

### 4.4 Sales Report Detail
- Grafik & laporan lebih granular.

---

## Status Pengerjaan

| Task | Status |
|------|--------|
| 1.1 payment_method bug | ✅ |
| 2.1 Admin logout API | ✅ |
| 2.2 Edit Address | ✅ |
| 2.3 Edit Kategori | ✅ |
| 2.4 Edit Variant | ✅ |
| 3.1 Search Produk | ✅ (already implemented) |
| 3.2 Wishlist / Favorit | ⬜ (butuh backend baru) |
| 3.3 Batalkan Pesanan | ⬜ (butuh endpoint backend) |
| 3.4 Recently Viewed | ✅ |
| 4.1 Bulk Actions | ⬜ |
| 4.2 Export CSV | ⬜ |
| 4.3 Manajemen Kupon | ⬜ |
| 4.4 Sales Report | ⬜ |
