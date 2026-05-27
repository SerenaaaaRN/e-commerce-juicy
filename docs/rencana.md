# Rencana: Zustand → TanStack Query

> Target: Migrate server state dari Zustand stores ke TanStack Query.
> Auth (client state) tetap pakai Zustand.

---

## 1. Analisis Saat Ini

### Store Classification

| Store | Lines | Type | Pindah? | Alasan |
|---|---|---|---|---|
| `productStore.ts` | 100 | Server state | ✅ | produk, kategori, featured |
| `cartStore.ts` | 148 | Server state | ✅ | cart CRUD via API |
| `orderStore.ts` | 70 | Server state | ✅ | order history, detail, checkout |
| `reviewStore.ts` | 48 | Server state | ✅ | fetch & submit review |
| `wishlistStore.ts` | 75 | Server state | ✅ | wishlist CRUD + Set lookup |
| `customerAuthStore.ts` | 59 | **Client state** (persist) | ❌ | token + profile di localStorage |
| `adminAuthStore.ts` | 53 | **Client state** (persist) | ❌ | token + admin di localStorage |

### Problems Today

- Manual `isLoading` / `error` / `try-catch` boilerplate di setiap action
- Tidak ada caching — mount ulang = fetch ulang
- Tidak ada request deduplication (navbar + collection page fetch categories 2x)
- Cart store punya wasteful pattern: `addItem` → `getCart()` re-fetch seluruh items
- Tidak ada background refetch — data bisa basi
- Tidak ada devtools untuk tracking query state

### Why TanStack Query

| Feature | Zustand (manual) | TanStack Query |
|---|---|---|
| Loading / error states | Manual per store | Auto dari `useQuery` / `useMutation` |
| Caching | None | Configurable staleTime / gcTime |
| Deduplication | None | Same query key = 1 request |
| Refetch on focus/mount | Manual | Auto (configurable) |
| Pagination / infinite | Manual state + append logic | `useInfiniteQuery` built-in |
| Optimistic updates | Manual rollback | `onMutate` / `onError` / `onSettled` |
| Cache invalidation | None | `queryClient.invalidateQueries` |
| Devtools | None | ReactQueryDevtools |

---

## 2. Queue

- **Phase 1** — Setup + Query hooks (read-only)
- **Phase 2** — Mutation hooks (write)
- **Phase 3** — Component migration
- **Phase 4** — Cleanup (hapus stores)

### Phase 1: Setup + Query Hooks

#### 1.1 Install & Provider

```
npm install @tanstack/react-query
npm install -D @tanstack/react-query-devtools
```

- Add `QueryClientProvider` + `ReactQueryDevtools` in `client/src/main.tsx`
- Set global defaults: `staleTime: 30_000`, `gcTime: 5 * 60_000`, `refetchOnWindowFocus: false`

#### 1.2 Product Queries

```typescript
// hooks/useProductQueries.ts

queryKey: ['products', params]
  → productApi.getProducts(params)

queryKey: ['product', slug]
  → productApi.getProductBySlug(slug)

queryKey: ['products', 'featured']
  → productApi.getProducts({ featured: true, per_page: 8 })

queryKey: ['categories']
  → productApi.getCategories()
```

- `fetchProducts(params, append=true)` → `useInfiniteQuery` untuk infinite scroll di CollectionPage
- `clearCurrentProduct()` → handle via query key, gak perlu `.remove()` manual

#### 1.3 Cart Queries

```typescript
// hooks/useCartQueries.ts

queryKey: ['cart']
  → cartApi.getCart()
  select: (res) => res.data  // extract items
```

- `totalPrice()` / `totalItems()` → computed dari `data` via `select` atau inline

#### 1.4 Order Queries

```typescript
// hooks/useOrderQueries.ts

queryKey: ['orders', 'customer']
  → ordersApi.getCustomerOrders()

queryKey: ['order', orderNumber]
  → ordersApi.getOrderDetail(orderNumber)
```

#### 1.5 Review Queries

```typescript
// hooks/useReviewQueries.ts

queryKey: ['reviews', productSlug]
  → productApi.getProductReviews(productSlug)
```

#### 1.6 Wishlist Queries

```typescript
// hooks/useWishlistQueries.ts

queryKey: ['wishlist']
  → wishlistApi.getWishlist()
  select: (res) => res.data
```

- `wishlistIds: Set<string>` → computed dari data
- `isInWishlist(variantId)` → helper function, bukan state

### Phase 2: Mutation Hooks

#### 2.1 Cart Mutations

```typescript
useAddCartItemMutation:
  mutationFn: cartApi.addItem
  invalidate: ['cart']

useUpdateCartItemMutation:
  mutationFn: ({ itemId, quantity }) => cartApi.updateQuantity(itemId, { quantity })
  invalidate: ['cart']

useRemoveCartItemMutation:
  mutationFn: cartApi.removeItem
  invalidate: ['cart']

useClearCartMutation:
  mutationFn: cartApi.clearCart
  invalidate: ['cart']
```

#### 2.2 Order Mutation

```typescript
usePlaceOrderMutation:
  mutationFn: ordersApi.checkout
  invalidate: ['cart'], ['orders', 'customer']
```

#### 2.3 Review Mutation

```typescript
useSubmitReviewMutation:
  mutationFn: ordersApi.submitReview
  invalidate: (_, variables) => ['reviews', getProductSlugFromProductId(variables.product_id)]
```

#### 2.4 Wishlist Mutations

```typescript
useAddWishlistItemMutation:
  mutationFn: wishlistApi.addItem
  optimistic update: langsung add ke cache
  rollback: restore cache sebelumnya

useRemoveWishlistItemMutation:
  mutationFn: wishlistApi.removeItem
  optimistic: langsung remove dari cache
```

### Phase 3: Component Migration

**32 files** perlu diubah (dari grep results):

| File | Store → Query Hook |
|---|---|
| `components/layout/Navbar.tsx` | `useProductStore` → `useCategoriesQuery` |
| | `useCartStore.totalItems` → `useCartQuery` + computed |
| `App.tsx` | `useCartStore.fetchCart` → `useCartQuery` (auto-fetch) |
| | `useWishlistStore.fetchWishlist` → `useWishlistQuery` (auto-fetch) |
| `features/cart/CartPage.tsx` | `useCartStore` → `useCartQuery` + mutations |
| `features/checkout/CheckoutPage.tsx` | `useCartStore` → `useCartQuery` + `usePlaceOrderMutation` |
| `features/shop/CollectionPage.tsx` | `useProductStore` → `useProductsQuery` / `useInfiniteQuery` |
| `features/shop/ProductPage.tsx` | `useProductStore` → `useProductQuery` |
| | `useCartStore` → `useAddCartItemMutation` |
| | `useWishlistStore` → `useWishlistQueries` |
| `features/home/components/FeaturedSection.tsx` | `useProductStore` → `useFeaturedProductsQuery` |
| `features/home/components/TrendingNow.tsx` | `useProductStore` → `useFeaturedProductsQuery` |
| `features/home/components/NewArrivals.tsx` | `useProductStore` → ... |
| `features/category/CategoryLandingPage.tsx` | `useProductStore` → `useCategoriesQuery` + `useProductsQuery` |
| `features/category/components/CategoryProducts.tsx` | `useProductStore` → ... |
| `features/orders/OrderHistoryPage.tsx` | `useOrderStore` → `useCustomerOrdersQuery` |
| `features/orders/OrderTrackingPage.tsx` | `useOrderStore` → `useOrderDetailQuery` |
| `features/wishlist/WishlistPage.tsx` | `useWishlistStore` → `useWishlistQuery` + mutations |
| `features/profile/ProfilePage.tsx` | (no store — auth, addresses via customerClient) |

**Pattern perubahan:**

```diff
- const { items, totalPrice, isLoading, error, fetchCart, addItem } = useCartStore()
- useEffect(() => { fetchCart() }, [])

+ const { data: cart, isLoading, error } = useCartQuery()
+ const { mutate: addItem, isPending } = useAddCartItemMutation()
+ const totalPrice = cart?.items.reduce((s, i) => s + i.unit_price * i.quantity, 0) ?? 0
```

### Phase 4: Hapus

**Hapus files:**

- `src/stores/cartStore.ts`
- `src/stores/productStore.ts`
- `src/stores/orderStore.ts`
- `src/stores/reviewStore.ts`
- `src/stores/wishlistStore.ts`

**Update / hapus thin wrapper hooks:**

- `src/hooks/useCart.ts` → HAPUS (ganti import ke query hooks)
- `src/hooks/useProduct.ts` → HAPUS
- `src/hooks/useOrder.ts` → HAPUS (atau refactor jadi query hook wrapper)
- `src/hooks/useAuth.ts` → TETAP (wraps customerAuthStore — client state)
- `src/hooks/useDebounce.ts` → TETAP
- `src/hooks/useConfirm.tsx` → TETAP
- `src/hooks/useIsMobile.ts` → TETAP
- `src/hooks/useRecentlyViewed.ts` → TETAP

**Cleanup package.json:**

- Zustand tetap terinstall — masih dipakai untuk auth stores

---

## 3. Query Hooks Location

Dua opsi:

| Opsi | Lokasi | Pro | Kontra |
|---|---|---|---|
| **A** (recommended) | `features/<domain>/hooks/` | Kolokasi, gampang maintain | Import dari feature lain jadi cross-feature |
| **B** | `hooks/` (root) | Konsisten dengan hybrid saat ini | Membedakan query hooks vs thin wrapper hooks |

**Rekomendasi: Opsi A** — query hooks spesifik per domain.
Contoh:
- `features/shop/hooks/useProductQueries.ts`
- `features/cart/hooks/useCartQueries.ts`
- `features/orders/hooks/useOrderQueries.ts`

Yang tetap di root `hooks/`: utility hooks (useDebounce, useConfirm, useIsMobile, useRecentlyViewed).

---

## 4. Risk & Mitigation

| Risk | Mitigation |
|---|---|
| Auth store dependencies (customer token di interceptor) | Auth tetap Zustand — interceptor baca `customerAuthStore.getState()` langsung, gak kena impact |
| Cart optimistic update conflict | Skip optimistic di awal, pake `invalidateQueries` dulu |
| Infinite scroll + filter combination | `useInfiniteQuery` handle pagination; filter change → `queryClient.resetQueries` |
| Component refactor scale (32 files) | Migrasi per domain: cart → orders → shop → home → wishlist, bukan per file |
| Regression: data not loading on mount | TanStack auto-fetch dengan `enabled` option, gak perlu `useEffect` manual |
| Query key collision | Prefix per domain: `['cart']`, `['products']`, `['orders']`, `['reviews']`, `['wishlist']` |

---

## 5. Estimated Impact

- **~340 lines** boilerplate dihapus (dari 5 stores)
- **~150 lines** query hooks baru
- **~80 lines** mutation hooks baru
- **32 components** berubah import aja (logic mostly sama)
- **0 perubahan** di backend API atau `lib/api/` files
- **0 perubahan** di auth flow

---

## 6. Go / No-Go Checklist

- [ ] `@tanstack/react-query` installed
- [ ] QueryClientProvider di main.tsx
- [ ] Query hooks selesai (Phase 1)
- [ ] Mutation hooks selesai (Phase 2)
- [ ] Semua component terupdate (Phase 3)
- [ ] Stores dihapus (Phase 4)
- [ ] Run `npm run build` — no type errors
- [ ] Test flow: browse → PDP → add to cart → checkout → order history → review
