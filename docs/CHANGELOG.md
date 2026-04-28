# CHANGELOG.md — Juicy
> Session checkpoint: 2026-05-26

---

## Session Summary

**Focus:** Priority 3 bug fixes & feature completion — Edit Address, Edit Category, Edit Variant, Cancel Order, Recently Viewed, Wishlist.

---

## Changes

### Bug Fixes

- **`client/src/stores/orderStore.ts`** — `placeOrder()` now sends `payment_method` to `ordersApi.checkout()`, fixing 422 Unprocessable Entity.
- **`client/src/components/layout/AdminLayout.tsx`** — Admin logout now calls `adminApi.logout()` before clearing store.
- **`client/src/features/shop/ProductPage.tsx`** — Fixed duplicate `try` block in `handleAddToCart` that caused Vite 500 parse error.

### Backend

#### Address
- `server/internal/handler/address.go` — Added `UpdateAddress` handler (PUT).
- `server/internal/service/address.go` — Added `UpdateAddress` method.
- `server/internal/repository/address.go` — Added `Update` method.
- `server/internal/router/router.go` — Added `PUT /customer/addresses/:id`.

#### Cancel Order
- `server/internal/repository/order.go` — `CancelOrder` method with stock restore in transaction.
- `server/internal/service/order.go` — `CancelOrder` validates ownership & cancellable status.
- `server/internal/handler/order.go` — `CancelOrder` handler.
- `server/internal/router/router.go` — `POST /orders/:orderNumber/cancel` (customer auth).

#### Wishlist
- `server/migrations/000014_create_wishlist_items.up.sql` — New table.
- `server/internal/model/wishlist.go` — `WishlistItem` model.
- `server/internal/dto/wishlist.go` — DTOs.
- `server/internal/repository/wishlist.go` — CRUD (FindByCustomerID with preloads, Exists, Add, Remove).
- `server/internal/service/wishlist.go` — Business logic with duplicate check.
- `server/internal/handler/wishlist.go` — 4 endpoints (Get, Check, Add, Remove).
- `server/internal/router/router.go` — Wishlist routes under customer auth.
- `server/cmd/main.go` — WishlistHandler injection.
- `server/internal/model/product.go` — Added `Product *Product` association to `ProductVariant` for preload chain.

### Frontend

#### Address (Edit)
- `client/src/features/profile/components/AddressForm.tsx` — Added `onSubmit` prop for edit mode.
- `client/src/features/profile/components/AddressCard.tsx` — Added edit button.
- `client/src/features/profile/components/AddressList.tsx` — Integrated edit flow + delete confirmation dialog.
- `client/src/features/profile/components/AddressFormModal.tsx` — Modal wrapping AddressForm.

#### Category & Variant Edit
- `client/src/features/admin/hooks/useProducts.ts` — Added `editingCategory` state + handlers.
- `client/src/features/admin/ProductsPage.tsx` — Category edit button, form pre-fill, cancel.
- `client/src/features/admin/hooks/useVariants.ts` — Added `editingVariant` state + handlers.
- `client/src/features/admin/components/VariantManagerDialog.tsx` — Variant edit form (pre-fill + cancel).

#### Shadcn Rule Compliance
- `client/src/features/admin/components/VariantManagerDialog.tsx` — Removed `size-5`, `text-muted-foreground` from icons inside `Button size="icon"`.
- `client/src/features/admin/ProductsPage.tsx` — Same cleanup.

#### Recently Viewed
- `client/src/hooks/useRecentlyViewed.ts` — New hook (localStorage, max 8 items, FIFO eviction).
- `client/src/features/shop/ProductPage.tsx` — Track views on mount (adds to recently viewed).
- `client/src/features/home/components/RecentlyViewedSection.tsx` — Card grid on HomePage (uses shadcn `Card` + `CardContent`).

#### Cancel Order (Frontend)
- `client/src/lib/api/orders.ts` — Added `cancelOrder` function.
- `client/src/features/orders/OrderTrackingPage.tsx` — Cancel button with confirm dialog, only for `pending`/`confirmed` status.

#### Wishlist (Frontend)
- `client/src/lib/api/wishlist.ts` — API service (getWishlist, checkWishlist, addItem, removeItem).
- `client/src/stores/wishlistStore.ts` — Zustand store with optimistic `wishlistIds` Set.
- `client/src/features/shop/ProductPage.tsx` — Heart toggle button next to AddToCartButton.
- `client/src/features/wishlist/WishlistPage.tsx` — Wishlist grid page.
- `client/src/App.tsx` — Added `/wishlist` route, import, `fetchWishlist` on auth init.
- `client/src/components/layout/Navbar.tsx` — Added heart icon link to `/wishlist`.

---

## Files Changed

### Backend (Go)
| File | Change |
|---|---|
| `server/cmd/main.go` | Inject WishlistHandler |
| `server/migrations/000014_create_wishlist_items.up.sql` | New migration |
| `server/migrations/000014_create_wishlist_items.down.sql` | New migration |
| `server/internal/model/wishlist.go` | New file |
| `server/internal/model/product.go` | Added Product association to ProductVariant |
| `server/internal/dto/wishlist.go` | New file |
| `server/internal/repository/wishlist.go` | New file |
| `server/internal/repository/order.go` | CancelOrder |
| `server/internal/repository/address.go` | Update |
| `server/internal/service/wishlist.go` | New file |
| `server/internal/service/order.go` | CancelOrder |
| `server/internal/service/address.go` | UpdateAddress |
| `server/internal/handler/wishlist.go` | New file |
| `server/internal/handler/order.go` | CancelOrder handler |
| `server/internal/handler/address.go` | UpdateAddress handler |
| `server/internal/router/router.go` | Wishlist + cancel order routes |

### Frontend (React/TS)
| File | Change |
|---|---|
| `client/src/lib/api/wishlist.ts` | New file |
| `client/src/lib/api/orders.ts` | Added cancelOrder, updateAddress |
| `client/src/lib/api/index.ts` | Export wishlistApi |
| `client/src/stores/wishlistStore.ts` | New file |
| `client/src/stores/orderStore.ts` | Fix: send payment_method |
| `client/src/hooks/useRecentlyViewed.ts` | New file |
| `client/src/features/wishlist/WishlistPage.tsx` | New file |
| `client/src/features/shop/ProductPage.tsx` | Wishlist toggle, recently viewed, fix duplicate try block |
| `client/src/features/home/components/RecentlyViewedSection.tsx` | New file |
| `client/src/features/orders/OrderTrackingPage.tsx` | Cancel button with confirm dialog |
| `client/src/features/profile/components/AddressForm.tsx` | Edit mode |
| `client/src/features/profile/components/AddressCard.tsx` | Edit button |
| `client/src/features/profile/components/AddressList.tsx` | Edit + delete confirm |
| `client/src/features/admin/ProductsPage.tsx` | Category edit + icon cleanup |
| `client/src/features/admin/components/VariantManagerDialog.tsx` | Variant edit + icon cleanup |
| `client/src/features/admin/hooks/useProducts.ts` | editingCategory state |
| `client/src/features/admin/hooks/useVariants.ts` | editingVariant state |
| `client/src/components/layout/Navbar.tsx` | Wishlist link |
| `client/src/components/layout/AdminLayout.tsx` | Admin logout call |
| `client/src/App.tsx` | Wishlist route + fetchWishlist on init |

---

## Database Migrations

- `000014_create_wishlist_items` — Applied ✓

## Verification

- `go build ./...` — Passes
- `npx tsc --noEmit` — Passes (0 errors)
- Migration `000014` applied via golang-migrate

---

## Next Steps

- Priority 4 tasks (Bulk actions, Export CSV, Coupon management, Sales report)
- Wishlist optimistic UI improvements (filled/unfilled heart state)
