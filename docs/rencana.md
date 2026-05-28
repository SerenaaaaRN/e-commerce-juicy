# Laporan: Zustand → TanStack Query ✅

> **Status: SELESAI** — Server state sudah dimigrasi dari Zustand stores ke TanStack Query.
> Auth (client state) tetap pakai Zustand.

---

## 1. Hasil Migrasi

### Store Classification — Final

| Store | Lines | Type | Status |
|---|---|---|---|
| `productStore.ts` | 100 | Server state | 🗑️ **Dihapus** → `useProductQueries` |
| `cartStore.ts` | 148 | Server state | 🗑️ **Dihapus** → `useCartQueries` + `useCartMutations` |
| `orderStore.ts` | 70 | Server state (dead code) | 🗑️ **Dihapus** — tidak ada consumers |
| `reviewStore.ts` | 48 | Server state (dead code) | 🗑️ **Dihapus** — tidak ada consumers |
| `wishlistStore.ts` | 75 | Server state | 🗑️ **Dihapus** → `useWishlistQueries` + `useWishlistMutations` |
| `useCart.ts` | 25 | Thin wrapper (unused) | 🗑️ **Dihapus** |
| `useProduct.ts` | 25 | Thin wrapper (unused) | 🗑️ **Dihapus** |
| `useOrder.ts` | 42 | Thin wrapper (unused) | 🗑️ **Dihapus** |
| `customerAuthStore.ts` | 59 | **Client state** | ✅ Tetap (auth) |
| `adminAuthStore.ts` | 53 | **Client state** | ✅ Tetap (auth) |

### Problems Solved

| Problem | Sebelum | Sesudah |
|---|---|---|
| Boilerplate | Manual `isLoading` / `error` / `try-catch` per action | Auto dari `useQuery` / `useMutation` |
| Caching | None — mount ulang = fetch ulang | `staleTime: 30s`, `gcTime: 5m` |
| Deduplication | Navbar + CollectionPage fetch categories 2x | 1 request untuk query key yang sama |
| Cart wasteful pattern | `addItem` → `getCart()` re-fetch seluruh items | Mutation → `invalidateQueries(['cart'])` |
| Devtools | None | `ReactQueryDevtools` di main.tsx |

### Manfaat TanStack Query

| Feature | Sebelum (Zustand) | Sesudah (TanStack Query) |
|---|---|---|
| Loading / error states | Manual per store | Auto dari `useQuery` / `useMutation` |
| Caching | None | `staleTime: 30s`, `gcTime: 5m` |
| Deduplication | None | Same query key = 1 request |
| Refetch on focus/mount | Manual | Auto (configurable) |
| Pagination / infinite | Manual state + append logic | `useInfiniteQuery` di CollectionPage |
| Optimistic updates | Manual rollback | `invalidateQueries` on mutation success |
| Cache invalidation | None | `queryClient.invalidateQueries` |
| Devtools | None | ReactQueryDevtools |

---

## 2. Yang Dilakukan

### ✅ Phase 1: Setup + Query Hooks

- Installed `@tanstack/react-query` + `@tanstack/react-query-devtools`
- Added `QueryClientProvider` + `ReactQueryDevtools` in `client/src/main.tsx`
- Global defaults: `staleTime: 30_000`, `gcTime: 5 * 60_000`, `refetchOnWindowFocus: false`

#### Query hooks created:
| File | Query Keys | Functions |
|---|---|---|
| `features/shop/hooks/useProductQueries.ts` | `['categories']`, `['products', params]`, `['products', 'featured']`, `['product', slug]`, `['reviews', slug]`, `['products', 'infinite', params]` | `useCategoriesQuery`, `useProductsQuery`, `useFeaturedProductsQuery`, `useProductQuery`, `useProductReviewsQuery`, `useInfiniteProductsQuery` |
| `features/cart/hooks/useCartQueries.ts` | `['cart']` | `useCartQuery` (enabled param for auth-gating) |
| `features/wishlist/hooks/useWishlistQueries.ts` | `['wishlist']` | `useWishlistQuery` (returns `items` + `wishlistIds Set`) |

### ✅ Phase 2: Mutation Hooks

| File | Mutations |
|---|---|
| `features/cart/hooks/useCartMutations.ts` | `useAddCartItemMutation`, `useUpdateCartItemMutation`, `useRemoveCartItemMutation`, `useClearCartMutation` |
| `features/wishlist/hooks/useWishlistMutations.ts` | `useAddWishlistItemMutation`, `useRemoveWishlistItemMutation` |

Semua mutations auto-invalidate query cache via `invalidateQueries`.

### ✅ Phase 3: Component Migration

**12 komponen dimigrasi:**

| File | Perubahan |
|---|---|
| `App.tsx` | Auto-fetch cart + wishlist via `useCartQuery(isAuthenticated)` + `useWishlistQuery(isAuthenticated)` — hapus manual `fetchCart`/`fetchWishlist` |
| `Navbar.tsx` | `useCartQuery` + `useCategoriesQuery` — computed `totalItems` inline |
| `ProductPage.tsx` | `useProductQuery(slug)` + cart mutations + wishlist query/mutations |
| `CollectionPage.tsx` | `useCategoriesQuery` + `useProductsQuery` (pagination) + `useInfiniteProductsQuery` (infinite scroll) |
| `CartPage.tsx` | `useCartQuery` + cart mutations |
| `CheckoutPage.tsx` | `useCartQuery` + `useClearCartMutation` |
| `WishlistPage.tsx` | `useWishlistQuery` + `useRemoveWishlistItemMutation` |
| `FeaturedSection.tsx` | `useFeaturedProductsQuery` |
| `TrendingNow.tsx` | `useFeaturedProductsQuery` |
| `NewArrivals.tsx` | `useProductsQuery({ tag: 'new-arrival' })` |
| `CategoryLandingPage.tsx` | `useCategoriesQuery` + `useProductsQuery` |
| `CategoryProducts.tsx` | `useProductsQuery` |

Catatan: `OrderHistoryPage`, `OrderTrackingPage`, `ReviewsSection`, `CheckoutPage` sudah pakai API langsung via `useState` — tidak perlu dimigrasi.

### ✅ Phase 4: Cleanup

**Dihapus (8 files):**
- `src/stores/productStore.ts`, `cartStore.ts`, `wishlistStore.ts`, `orderStore.ts`, `reviewStore.ts`
- `src/hooks/useCart.ts`, `useProduct.ts`, `useOrder.ts`

**Tetap (utility hooks):**
- `useAuth.ts`, `useConfirm.tsx`, `useDebounce.ts`, `useMobile.ts`, `useRecentlyViewed.ts`

---

## 3. Query Hooks Location

Query hooks ditempatkan di `features/<domain>/hooks/` (Opsi A):
- `features/shop/hooks/useProductQueries.ts`
- `features/cart/hooks/useCartQueries.ts` + `useCartMutations.ts`
- `features/wishlist/hooks/useWishlistQueries.ts` + `useWishlistMutations.ts`

Utility hooks tetap di `src/hooks/`: `useAuth`, `useConfirm`, `useDebounce`, `useMobile`, `useRecentlyViewed`.

---

## 4. Risk & Mitigation — Hasil

| Risk | Mitigation | Hasil |
|---|---|---|
| Auth store dependencies (customer token di interceptor) | Auth tetap Zustand | ✅ Aman — interceptor baca `customerAuthStore.getState()` langsung |
| Cart optimistic update conflict | Skip optimistic, pake `invalidateQueries` | ✅ Berhasil — no stale data issues |
| Infinite scroll + filter combination | `useInfiniteQuery` handle pagination | ✅ CollectionPage dual mode (pagination + infinite scroll) |
| Component refactor scale (32 files) | Migrasi per domain | ✅ Hanya 12 komponen (sisanya sudah pakai API langsung) |
| Regression: data not loading on mount | `enabled` option | ✅ Auto-fetch berfungsi |

---

## 5. Final Impact

| Metric | Estimated | Actual |
|---|---|---|
| Boilerplate dihapus | ~340 lines (5 stores) | ~441 lines (5 stores + 3 unused hooks) |
| Query hooks baru | ~150 lines | ~80 lines |
| Mutation hooks baru | ~80 lines | ~70 lines |
| Komponen migrasi | 32 files | 12 files (sisanya sudah API langsung) |
| Backend API perubahan | 0 | 0 ✅ |
| Auth flow perubahan | 0 | 0 ✅ |
| `tsc --noEmit` errors | 0 | 0 ✅ |
| `vite build` errors | 0 | 0 ✅ |

---

## 6. Checklist Final

- [x] `@tanstack/react-query` installed
- [x] QueryClientProvider di main.tsx
- [x] Query hooks selesai
- [x] Mutation hooks selesai
- [x] Semua component terupdate
- [x] Stores + unused hooks dihapus
- [x] `npx tsc --noEmit` — no type errors
- [x] `npx vite build` — no errors
