# 🎨 PLANNING: Integrasi Desain Referensi "Maison" → Aplikasi "JUICY"

> **Tanggal:** 23 Juni 2026  
> **Status:** Planning  
> **Sumber Referensi:** `client/referensi style ui/`  
> **Kode Aktif:** `client/src/`

---

## 📌 Konteks

Aplikasi **JUICY** adalah e-commerce luxury fashion yang sudah berjalan penuh — API connected, React Query, Zustand stores, routing lengkap. Di samping itu ada folder **referensi UI** (`client/referensi style ui/`) yang berisi desain konsep "Maison" — luxury fashion brand dengan estetika monokrom minimalis, tipografi serif, layout asimetris, dan animasi halus menggunakan framer-motion.

**Tujuan:** Mengaplikasikan **style, UI, motion, dan design** dari referensi ke kode aktif JUICY. Bukan copy-paste, tapi mengadopsi pola desain referensi sambil mempertahankan seluruh business logic, API, state management, dan arsitektur yang sudah ada.

---

## ✅ Keputusan Desain (Sudah Dikonfirmasi)

| Aspek | Keputusan | Detail |
|---|---|---|
| **Tipografi** | Playfair Display & Inter (Referensi) | Heading → Playfair Display (serif luxury). Body → Inter (clean sans). Menggantikan Geist & Space Grotesk |
| **Border Radius** | `0rem` (Tajam - Referensi) | Semua sudut kotak murni, tanpa kelengkungan. Khas luxury fashion |
| **Warna Aksen** | Monokrom + Champagne Gold JUICY | Layout dominan hitam/putih seperti referensi, tapi mempertahankan aksen emas champagne OKLCH sebagai identitas JUICY |
| **Home Page Sections** | PromoStrip + CollectionGrid | Mempertahankan PromoStrip (unik JUICY) + menambah CollectionGrid asimetris dari referensi. EditorialSection & Grid Produk Tambahan TIDAK dipakai |

---

## 🔍 Status Saat Ini: Apa yang Sudah Di-Apply

| Komponen | File Aktif | Status |
|---|---|---|
| HeroSection | `src/features/home/components/HeroSection.tsx` | ✅ Sudah di-apply |
| HeritageSection | `src/features/home/components/Heritage.tsx` | ✅ Sudah di-apply |
| SmoothScroll (Lenis) | `src/components/layout/SmoothScroll.tsx` | ✅ Sudah di-apply |
| PremiumFooter | `src/features/home/components/premium-footer.tsx` | ✅ Sudah di-apply |
| navigation.tsx | `src/components/layout/Navbar.tsx` | ✅ Sudah di-apply (Navbar.tsx diubah jadi luxury) |
| CollectionGrid | `src/features/home/components/CollectionGrid.tsx` | ✅ Sudah di-apply |
| Heritage Page | `src/features/heritage/HeritagePage.tsx` | ✅ Sudah di-apply (buat halaman statis full) |
| Global Top Padding | `Semua Halaman Konten` | ✅ Sudah di-apply (`pt-24 lg:pt-32` untuk fixed Navbar kompensasi) |

---

## 🗺️ Peta Perbandingan Lengkap: Referensi vs Aktif

### Komponen (referensi → aktif)

| Komponen Referensi | File Referensi | Padanan di Kode Aktif | Status |
|---|---|---|---|
| `hero-section.tsx` | `components/hero-section.tsx` | `features/home/components/HeroSection.tsx` | ✅ Applied |
| `heritage-section.tsx` | `components/heritage-section.tsx` | `features/home/components/Heritage.tsx` | ✅ Applied |
| `collection-grid.tsx` | `components/collection-grid.tsx` | — (tidak ada padanan) | ❌ Belum |
| `navigation.tsx` | `components/navigation.tsx` | `components/layout/Navbar.tsx` | 🔶 Perlu harmonisasi |
| `premium-footer.tsx` | `components/premium-footer.tsx` | `features/home/components/premium-footer.tsx` | ✅ Applied |
| `mini-cart.tsx` | `components/mini-cart.tsx` | Inline di Navbar | 🔶 Perlu penyesuaian |
| `product-card.tsx` | `components/product-card.tsx` | `features/shop/components/ProductCard.tsx` | ❌ Belum |
| `product-gallery.tsx` | `components/product-gallery.tsx` | `features/shop/components/ProductImageGallery.tsx` | ❌ Belum |
| `size-selector.tsx` | `components/size-selector.tsx` | `features/shop/components/VariantSelector.tsx` | ❌ Belum |
| `color-selector.tsx` | `components/color-selector.tsx` | `features/shop/components/VariantSelector.tsx` | ❌ Belum |
| `product-details-accordion.tsx` | `components/product-details-accordion.tsx` | — (pakai shadcn accordion) | ❌ Belum |
| `related-products.tsx` | `components/related-products.tsx` | — | ❌ Belum |
| `account-sidebar.tsx` | `components/account-sidebar.tsx` | — (pakai tabs) | ❌ Belum |
| `smooth-scroll-provider.tsx` | `components/smooth-scroll-provider.tsx` | `components/layout/SmoothScroll.tsx` | ✅ Applied |

### Halaman (referensi → aktif)

| Halaman Referensi | Padanan Aktif | Status |
|---|---|---|
| `Home.tsx` (Hero + CollectionGrid + Heritage + Footer) | `HomePage.tsx` (Hero + PromoStrip + Heritage) | 🔶 Perlu tambah CollectionGrid |
| `Shop.tsx` (hero banner + filter bar + product grid) | `CollectionPage.tsx` | ❌ Perlu re-style |
| `ProductDetail.tsx` (gallery + selectors + accordion + reviews) | `ProductPage.tsx` | ❌ Perlu re-style |
| `Heritage.tsx` (timeline + values + craftsmen) | — (tidak ada route) | ❌ Belum ada |
| `Checkout.tsx` (2-step: shipping → payment) | `CheckoutPage.tsx` | ❌ Perlu re-style |
| `auth/Login.tsx` | `LoginPageCust.tsx` | ❌ Perlu re-style |
| `auth/Register.tsx` | `RegisterPage.tsx` | ❌ Perlu re-style |
| `account/Profile.tsx` | `ProfilePage.tsx` (tabs-based) | ❌ Perlu re-style |
| `account/Orders.tsx` | `OrderHistoryPage.tsx` | ❌ Perlu re-style |
| `account/Addresses.tsx` | — (dalam ProfilePage) | ❌ Perlu re-style |
| `account/Settings.tsx` | — | ❌ Belum ada |

---

## 🏗️ Fase Implementasi

### Phase 1: Fondasi Desain & Tipografi (Global Styles)
> **Tujuan:** Mengubah dasar visual seluruh aplikasi dalam satu langkah.

**Yang dikerjakan:**
1. **Install font baru**: `@fontsource/playfair-display` dan `@fontsource/inter` (atau via Google Fonts import)
2. **Update `client/src/index.css`**:
   - Ganti `--font-sans` → `'Inter', sans-serif`
   - Ganti `--font-heading` → `'Playfair Display', serif`
   - Tambah `--font-serif` → `'Playfair Display', serif`
   - Ubah `--radius` → `0rem`
   - Pertahankan token warna gold OKLCH (`--color-gold`, `--color-gold-muted`, dll.)
   - Sesuaikan warna background/foreground agar lebih mendekati monokrom referensi tapi tetap dengan aksen gold
3. **Update animasi**: Pastikan motion variants di `lib/animations.ts` mencakup pattern referensi:
   - Page entry: `initial={{ opacity: 0, y: 20 }}` → `animate={{ opacity: 1, y: 0 }}`
   - Custom easing: `[0.16, 1, 0.3, 1]`
   - Staggered children: `delay: index * 0.05`
   - Scroll-triggered: `whileInView` dengan `viewport={{ once: true }}`

**File Kunci:**
- `client/src/index.css`
- `client/src/lib/animations.ts`
- `client/package.json` (install fonts)

**Estimasi:** ~30 menit

---

### Phase 2: Navbar & Home Page
> **Tujuan:** Halaman pertama yang dilihat user harus mencerminkan desain baru.

**Yang dikerjakan:**

#### 2A. Navbar (`Navbar.tsx`)
Mengadopsi gaya `navigation.tsx` referensi ke `Navbar.tsx` aktif:
- Layout: Logo kiri, nav links tengah (uppercase, tracking lebar), icons kanan
- Animasi: `AnimatePresence` untuk mobile menu, motion untuk dropdown
- Border tipis di bawah navbar
- **Tetap pertahankan**: Search logic (`debouncedSearchQuery`), auth state, cart badge, wishlist icon, mobile drawer, category ribbon on scroll

#### 2B. Home Page (`HomePage.tsx`)
Struktur final:
```
1. HeroSection          ✅ (sudah ada)
2. PromoStrip           ✅ (sudah ada, dipertahankan)
3. CollectionGrid       🆕 (buat baru dari referensi)
4. HeritageSection      ✅ (sudah ada)
5. PremiumFooter        ✅ (sudah ada)
```

- **CollectionGrid baru**: Buat komponen `CollectionGrid.tsx` di `features/home/components/` yang mengadopsi layout asimetris referensi (`lg:pt-12`, `lg:pt-24`, `lg:-mt-8` untuk efek staggered). Hubungkan ke API produk aktif via React Query hook yang sudah ada.
- **Hapus/comment out** section yang tidak dipakai: EditorialSection, FeaturedSection, TrendingNow, NewArrivals, WhyJuicy, RecentlyViewedSection, CollectionPreview

**File Kunci:**
- `client/src/components/layout/Navbar.tsx`
- `client/src/features/home/HomePage.tsx`
- `client/src/features/home/components/CollectionGrid.tsx` (baru)

**Referensi untuk dibaca:**
- `referensi style ui/components/navigation.tsx`
- `referensi style ui/components/collection-grid.tsx`
- `referensi style ui/pages/Home.tsx`

**Estimasi:** ~1-2 jam

---

### Phase 3: Shop & Product Detail Page
> **Tujuan:** Halaman katalog dan detail produk mendapat sentuhan luxury.

**Yang dikerjakan:**

#### 3A. ProductCard (Reusable)
- Implementasi **hover image-swap**: Saat hover, gambar produk cross-fade ke gambar kedua
- Tipografi: nama produk uppercase, tracking lebar, harga clean
- Animasi: `whileHover={{ y: -4 }}`, staggered reveal di grid
- Referensi: `referensi style ui/components/product-card.tsx`

#### 3B. CollectionPage (Shop)
- Tambah **Hero Banner** di atas (gambar full-width dengan overlay teks serif)
- Filter kategori → horizontal bar minimalis (bukan dropdown/sidebar)
- Product grid → 4 kolom responsif dengan ProductCard baru
- **Pertahankan**: search params logic, infinite scroll/pagination, sorting
- Referensi: `referensi style ui/pages/Shop.tsx`

#### 3C. ProductPage (Detail)
- **ProductImageGallery** → Layout thumbnail rail vertikal (thumbnails di kiri, gambar besar di kanan) seperti `product-gallery.tsx` referensi
- **VariantSelector** → Pisah jadi visual ColorSelector (swatch bulat dengan check) dan SizeSelector (kotak dengan border, disabled state) seperti referensi
- **Product Details** → Gunakan accordion border-bottom-only dari `product-details-accordion.tsx` referensi
- **Related Products** → Grid 4 kolom dengan ProductCard baru
- **Reviews** → Pertahankan ReviewsSection aktif tapi sesuaikan typography
- Referensi: `referensi style ui/pages/ProductDetail.tsx`

**File Kunci:**
- `client/src/features/shop/components/ProductCard.tsx`
- `client/src/features/shop/CollectionPage.tsx`
- `client/src/features/shop/ProductPage.tsx`
- `client/src/features/shop/components/ProductImageGallery.tsx`
- `client/src/features/shop/components/VariantSelector.tsx`

**Estimasi:** ~2-3 jam

---

### Phase 4: Auth, Account & Checkout
> **Tujuan:** Area fungsional mendapat polish final.

**Yang dikerjakan:**

#### 4A. Auth Pages (Login & Register)
- Form centered di tengah halaman
- Heading besar serif (Playfair Display)
- Input minimalis (border bawah saja atau border tipis, sudut tajam)
- Link "Already have an account?" / "Create account" dengan style luxury
- Referensi: `referensi style ui/pages/auth/Login.tsx`, `Register.tsx`

#### 4B. Account Pages (Profile & Orders)
- Ganti navigasi **tabs** → **AccountSidebar** (sidebar kiri dengan menu items, active indicator menggunakan `layoutId` framer-motion)
- Profile, Orders, Addresses → konten di sisi kanan sidebar
- Styling form/tabel mengikuti pola referensi (typography serif untuk heading, border tipis)
- Referensi: `referensi style ui/components/account-sidebar.tsx`, `pages/account/*`

#### 4C. Checkout Page
- Layout 2-step: **Shipping** → **Payment**
- Progress indicator di atas
- Order summary di sidebar kanan
- Form input minimalis konsisten dengan auth pages
- Referensi: `referensi style ui/pages/Checkout.tsx`

**File Kunci:**
- `client/src/features/auth/LoginPageCust.tsx`
- `client/src/features/auth/RegisterPage.tsx`
- `client/src/features/auth/components/LoginForm.tsx`
- `client/src/features/auth/components/RegisterForm.tsx`
- `client/src/features/profile/ProfilePage.tsx`
- `client/src/features/orders/OrderHistoryPage.tsx`
- `client/src/features/checkout/CheckoutPage.tsx`

**Estimasi:** ~2-3 jam

---

## 📐 Pola Desain Referensi (Cheat Sheet)

### Animasi Motion (framer-motion) yang Dipakai Referensi

```tsx
// Page entry
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}

// Scroll reveal
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}

// Stagger children
transition={{ delay: index * 0.05 }}

// Parallax (heritage section)
useScroll() + useTransform()

// Hover pada produk/tombol
whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}

// Scroll indicator bounce
animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}

// AnimatePresence untuk mount/unmount
<AnimatePresence mode="wait"> ... </AnimatePresence>
```

### Pola Tipografi

```
Heading: font-serif text-4xl lg:text-5xl tracking-tight
Subtitle: text-lg text-muted-foreground max-w-2xl
Nav link: text-xs tracking-[0.2em] uppercase
Button: text-sm tracking-[0.15em] uppercase
Label: text-xs tracking-[0.15em] uppercase text-muted-foreground
Price: text-lg font-light
```

### Pola Layout

```
Container: max-w-7xl mx-auto px-6 lg:px-8
Section spacing: py-24 lg:py-32
Full-screen: min-h-screen
Product grid: grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12
Asymmetric offset: lg:pt-12, lg:pt-24, lg:-mt-8
```

### Pola Warna (Monokrom + Gold JUICY)

```
Background: bg-background (off-white / near-black dark)
Foreground: text-foreground (near-black / off-white dark)
Muted: text-muted-foreground (gray-500)
Accent: Champagne gold (oklch 0.75 0.07 85) untuk CTA, highlight, hover
Border: border-border (gray-200 / dark-gray)
```

---

## 🛠️ Langkah Verifikasi (Per Phase)

1. **Setelah Phase 1**: `npm run dev` → cek semua teks berubah font, sudut tajam, warna konsisten
2. **Setelah Phase 2**: Cek navbar responsive + mobile drawer. Cek Home page flow (Hero → Promo → Grid → Heritage → Footer). Cek CollectionGrid menampilkan data produk dari API
3. **Setelah Phase 3**: Buka Shop → filter/sort masih jalan. Buka product detail → gallery, variant selector, accordion berfungsi. Add to cart masih bekerja
4. **Setelah Phase 4**: Login/Register flow. Profile edit + change password. Order history. Checkout end-to-end

---

## 📝 Catatan Penting

- **JANGAN** mengubah business logic, hooks, API calls, atau state management
- **JANGAN** mengganti brand "JUICY" menjadi "Maison" — hanya adopsi style-nya
- Semua route tetap menggunakan konstanta `ROUTES.*` dari `constants/routes.ts`
- Jika referensi menggunakan mock data, ganti dengan hook/API call yang sudah ada di kode aktif
- Komponen UI shadcn (`components/ui/*`) tidak perlu diubah — mereka otomatis mengikuti CSS variables global
