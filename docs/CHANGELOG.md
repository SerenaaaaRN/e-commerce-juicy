# CHANGELOG.md — Juicy
> Session checkpoint: 2026-05-26

---

## Session Summary

**Latest Updates (Product Categories & Image Gallery Fixes):**
- **GORM Association Gotcha Fix**: Fixed a bug where editing product details successfully saved but silently cleared/wiped out the product's category in the database. Solved by clearing preloaded GORM `Category` struct in `UpdateProduct` before calling GORM Save.
- **`category_id` Mapping Fix**: Added `category_id` (`CategoryID`) to the backend `dto.ProductResponse` and `ListProducts` service mapper, enabling the edit modal to correctly pre-select the current category instead of showing empty.
- **Empty Image Assets Gallery Fix**: Fixed the image modal showing "No photographic graphics uploaded yet" by changing `openImages` and `openVariants` in `ProductsPage.tsx` to fetch full product details (including images and variants) by ID via `getProductByID`, rather than relying on the incomplete list representation.
- **Product Thumbnail Display Fix**: Updated the main product inventory table in `ProductsPage.tsx` to read the flat `primary_image` field returned by the list API, so product cover images render beautifully on the grid.
- **Instant Media Upload Sync**: Updated backend `AddProductImages` handler to fetch and return the fully updated product model under the `data` JSON response field, matching frontend expectations for instant UI updates.
- **Paste Image URL Option**: Implemented a new feature allowing users to register catalog image assets via direct internet URLs (e.g. from Unsplash) instead of files upload. Added a backend endpoint `POST /api/v1/admin/products/:id/images/url`, updated frontend hooks and API definitions, and redesigned `ImageManagerDialog` to offer side-by-side local upload and URL input options.

**Previous Session Focus:** Priority 3 bug fixes & feature completion — Edit Address, Edit Category, Edit Variant, Cancel Order, Recently Viewed, Wishlist, Delete Category fix, Admin product listing pagination/admin flag fix.

---

## Changes

### Bug Fixes

- **`client/src/stores/orderStore.ts`** — `placeOrder()` now sends `payment_method` to `ordersApi.checkout()`, fixing 422 Unprocessable Entity.
- **`client/src/components/layout/AdminLayout.tsx`** — Admin logout now calls `adminApi.logout()` before clearing store.
- **`client/src/features/shop/ProductPage.tsx`** — Fixed duplicate `try` block in `handleAddToCart` that caused Vite 500 parse error.
- **`server/internal/service/category.go`** — `DeleteCategory` now checks for referencing products before deleting (returns `ErrCategoryHasProducts`).
- **`client/src/features/admin/hooks/useProducts.ts`** — Removed `startTransition` from async API calls; fixed catch blocks to extract actual error messages from axios error responses.
- **`client/src/features/admin/hooks/useProducts.ts`** — `loadData` now passes `admin=true&per_page=9999` so admin dashboard shows all products (unavailable + beyond page 1).
- **`client/src/lib/api/admin.ts`** — Added `admin?: boolean` to `ProductQueryParams`.

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

#### Delete Category
- `server/internal/service/category.go` — Added `ErrCategoryHasProducts` error; `DeleteCategory` now counts products referencing the category before allowing deletion.
- `server/internal/handler/category.go` — Added handler for `ErrCategoryHasProducts` → HTTP 409 Conflict with clear message.

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

#### Delete Category & Error Handling
- `client/src/features/admin/hooks/useProducts.ts` — Removed `startTransition` from async delete API calls; fixed catch blocks to extract actual error messages from axios error responses (shows backend error message instead of generic fallback).

#### Admin Product Listing
- `client/src/features/admin/hooks/useProducts.ts` — `loadData` now calls `adminApi.getProducts({ admin: true, per_page: 9999 })` so backend doesn't filter by `is_available` and pagination doesn't hide products.
- `client/src/lib/api/admin.ts` — Added `admin?: boolean` to `ProductQueryParams`.

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
| `server/internal/service/category.go` | DeleteCategory: check for referencing products |
| `server/internal/handler/category.go` | DeleteCategory: handle ErrCategoryHasProducts |
| `server/internal/dto/product.go` | Added CategoryID to ProductResponse DTO |
| `server/internal/service/product.go` | ListProducts: Map CategoryID; UpdateProduct: Clear preloaded Category struct |
| `server/internal/handler/product.go` | AddProductImages: return updated product details in data field |

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
| `client/src/features/admin/ProductsPage.tsx` | Category edit + icon cleanup; fetch full product details in openImages and openVariants |
| `client/src/features/admin/components/VariantManagerDialog.tsx` | Variant edit + icon cleanup |
| `client/src/features/admin/hooks/useProducts.ts` | editingCategory state + fix delete handlers & error catching + admin=true per_page=9999 |
| `client/src/lib/api/admin.ts` | Added admin to ProductQueryParams, added getProductByID |
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
