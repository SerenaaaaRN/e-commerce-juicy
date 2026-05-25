# API.md — Juicy
> Full REST API contract. All endpoints, methods, auth requirements, and request/response shapes.

---

## Base URL

- **Development:** `http://localhost:8080/api`
- **Production:** `https://<railway-domain>/api`

---

## Response Envelope

```json
// Success (single)
{ "success": true, "data": { ... }, "message": "optional" }

// Success (list)
{ "success": true, "data": [ ... ] }

// Success (paginated)
{ "success": true, "data": [ ... ], "meta": { "page": 1, "per_page": 20, "total": 100, "total_pages": 5 } }

// Error
{ "success": false, "error": "Human-readable message", "code": "MACHINE_CODE" }
```

---

## Auth

**Admin routes:** `Authorization: Bearer <admin_access_token>` — all `/api/admin/*` routes except login/refresh.

**Customer routes:** `Authorization: Bearer <customer_token>` — all `/api/customers/*`, `/api/cart`, `/api/orders`, `/api/addresses`, `/api/wishlist`, `/api/reviews` routes.

---

## Endpoints

---

### 🔐 Admin Auth

#### `POST /admin/login`
```json
// Request
{ "email": "admin@juicy.com", "password": "yourpassword" }

// Response 200 — sets HttpOnly refresh_token cookie
{
  "success": true,
  "data": {
    "token": "<access_token>",
    "admin": { "id": "uuid", "username": "admin", "email": "admin@juicy.com" }
  }
}
```
**Errors:** `401 INVALID_CREDENTIALS`

---

#### `POST /admin/refresh`
*Empty body. Reads `refresh_token` cookie.*
```json
// Response 200
{ "success": true, "data": { "token": "<new_access_token>", "admin": { ... } } }
```

---

#### `POST /admin/logout`
*Requires active access token. Clears `refresh_token` cookie.*
```json
// Response 200
{ "success": true, "data": null, "message": "Logged out successfully" }
```

---

### 👤 Customer Auth

#### `POST /customers/register`
```json
// Request
{ "full_name": "Jane Doe", "email": "jane@example.com", "password": "min8chars", "phone": "+62812345678" }

// Response 201
{ "success": true, "data": { "token": "<customer_token>", "customer": { "id": "uuid", "full_name": "Jane Doe", "email": "jane@example.com" } } }
```
**Errors:** `409 EMAIL_TAKEN`, `422 VALIDATION_ERROR`

---

#### `POST /customers/login`
```json
// Request
{ "email": "jane@example.com", "password": "min8chars" }

// Response 200
{ "success": true, "data": { "token": "<customer_token>", "customer": { "id": "uuid", "full_name": "Jane Doe", "email": "jane@example.com" } } }
```
**Errors:** `401 INVALID_CREDENTIALS`

---

### 👤 Customer Profile (Protected — Customer)

#### `GET /customers/profile`
```json
// Response 200
{ "success": true, "data": { "id": "uuid", "full_name": "Jane Doe", "email": "...", "phone": "...", "created_at": "..." } }
```

#### `PUT /customers/profile`
```json
// Request
{ "full_name": "Jane Smith", "phone": "+62812345679" }
```

#### `PUT /customers/profile/password`
```json
// Request
{ "current_password": "oldpass", "new_password": "newpass" }
```
**Errors:** `401 WRONG_PASSWORD`

---

### 📦 Customer Addresses (Protected — Customer)

#### `GET /addresses`
```json
// Response 200
{ "success": true, "data": [ { "id": "uuid", "label": "Home", "recipient_name": "...", "city": "...", "is_default": true, ... } ] }
```

#### `GET /addresses/:id`
Single address detail.

#### `POST /addresses`
```json
// Request
{ "label": "Home", "recipient_name": "Jane Doe", "phone": "+62812345678", "address_line": "Jl. Sudirman No. 1", "city": "Jakarta", "province": "DKI Jakarta", "postal_code": "10110", "is_default": true }
```

#### `PUT /addresses/:id`
Update address fields.

#### `DELETE /addresses/:id`

#### `PUT /addresses/:id/default`
Sets this address as default; unsets all others.

---

### 🛍️ Shop — Public

#### `GET /shop/categories`
All active categories.
```json
{ "success": true, "data": [ { "id": "uuid", "name": "Dresses", "slug": "dresses", "display_order": 3 } ] }
```

Response includes nested subcategories and product count:
```json
{
  "id": "uuid", "name": "Dresses", "slug": "dresses", "display_order": 3,
  "parent_id": null,
  "product_count": 24,
  "children": [
    { "id": "uuid", "name": "Maxi Dresses", "slug": "maxi-dresses", "parent_id": "...", "product_count": 8 }
  ]
}
```

---

#### `GET /shop/products`
All available products. Supports filtering, sorting, and pagination.

**Query params:**
- `category` — category slug
- `featured` — `true` for featured only
- `tag` — single tag string (e.g. `new-arrival`)
- `sort` — `price_asc | price_desc | newest | popular`
- `page`, `per_page`
- `sizes` — comma-separated size filter (e.g. `sizes=S,M,L`). Filters products that have at least one active variant matching any of the specified sizes.
- `search` — keyword search across `name` and `description` fields (case-insensitive LIKE).

```json
// Response 200 (paginated)
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Linen Wrap Dress",
      "slug": "linen-wrap-dress",
      "price": 1250000,
      "compare_at_price": 1800000,
      "is_featured": true,
      "tags": ["new-arrival", "sale"],
      "primary_image": "https://res.cloudinary.com/...",
      "category_name": "Dresses",
      "avg_rating": 4.7,
      "review_count": 23
    }
  ],
  "meta": { "page": 1, "per_page": 24, "total": 80, "total_pages": 4 }
}
```

---

#### `GET /shop/products/:slug`
Single product detail.
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Linen Wrap Dress",
    "slug": "linen-wrap-dress",
    "description": "...",
    "price": 1250000,
    "compare_at_price": 1800000,
    "tags": ["new-arrival", "sale"],
    "category": { "id": "uuid", "name": "Dresses", "slug": "dresses" },
    "images": [
      { "id": "uuid", "image_url": "...", "alt_text": "...", "is_primary": true, "display_order": 0 }
    ],
    "variants": [
      { "id": "uuid", "size": "S", "color": "Ivory", "color_hex": "#fffff0", "sku": "LWD-S-IVY", "stock": 5, "additional_price": 0, "is_active": true }
    ],
    "avg_rating": 4.7,
    "review_count": 23
  }
}
```

---

#### `GET /shop/products/:slug/reviews`
Reviews for a product. Supports pagination.

**Query params:** `page`, `per_page`

```json
{
  "success": true,
  "data": [
    { "id": "uuid", "rating": 5, "body": "Absolutely gorgeous!", "customer_name": "Jane D.", "created_at": "..." }
  ],
  "meta": { "page": 1, "per_page": 10, "total": 23, "total_pages": 3 }
}
```

---

### 🛒 Cart (Protected — Customer)

#### `GET /cart`
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "variant_id": "uuid",
        "product_name": "Linen Wrap Dress",
        "variant_size": "S",
        "variant_color": "Ivory",
        "image_url": "...",
        "unit_price": 1250000,
        "quantity": 2,
        "subtotal": 2500000
      }
    ],
    "total": 2500000
  }
}
```

---

#### `POST /cart/items`
Add item to cart. Upserts on conflict (same customer + variant).
```json
// Request
{ "variant_id": "uuid", "quantity": 1 }
```
**Errors:** `404 VARIANT_NOT_FOUND`, `409 INSUFFICIENT_STOCK`

---

#### `PUT /cart/items/:id`
Update quantity of a cart item.
```json
// Request
{ "quantity": 3 }
```

---

#### `DELETE /cart/items/:id`
Remove item from cart.

---

#### `DELETE /cart`
Clear entire cart.

---

---

### ❤️ Wishlist (Protected — Customer)

#### `GET /wishlist`
Returns all wishlist items for the authenticated customer.
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "variant_id": "uuid",
      "product_id": "uuid",
      "product_name": "Linen Wrap Dress",
      "product_slug": "linen-wrap-dress",
      "variant_size": "S",
      "variant_color": "Ivory",
      "image_url": "https://res.cloudinary.com/...",
      "price": 1250000,
      "additional_price": 0,
      "stock": 5,
      "created_at": "..."
    }
  ]
}
```

---

#### `GET /wishlist/check/:variantId`
Check if a specific variant is in the customer's wishlist.
```json
{ "success": true, "data": { "in_wishlist": true } }
```

---

#### `POST /wishlist/items`
Add a variant to wishlist.
```json
// Request
{ "variant_id": "uuid" }

// Response 201
{ "success": true, "message": "Added to wishlist" }
```
**Errors:** `409 ALREADY_IN_WISHLIST`

---

#### `DELETE /wishlist/items/:variantId`
Remove a variant from wishlist.
```json
// Response 200
{ "success": true, "message": "Removed from wishlist" }
```

---

### 📋 Orders — Customer (Protected)

#### `POST /orders/checkout`
Checkout — creates an order from current cart.
```json
// Request
{ "address_id": "uuid", "notes": "Leave at door", "payment_method": "cod" }

// Response 201
{
  "success": true,
  "data": {
    "id": "uuid",
    "order_number": "JUICY-20250525-A3F7K2",
    "status": "pending",
    "total": 2500000
  },
  "message": "Order placed successfully. Check your email for confirmation."
}
```
**Errors:** `409 OUT_OF_STOCK`, `404 CART_EMPTY`, `422 VALIDATION_ERROR`

---

#### `GET /orders`
Customer's order history.
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "order_number": "JUICY-20250525-A3F7K2",
      "status": "shipped",
      "total": 2500000,
      "item_count": 2,
      "created_at": "..."
    }
  ],
  "meta": { ... }
}
```

---

#### `GET /orders/:order_number`
Order detail + tracking.
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "order_number": "JUICY-20250525-A3F7K2",
    "status": "shipped",
    "payment_status": "paid",
    "subtotal": 2500000,
    "shipping_fee": 25000,
    "total": 2525000,
    "shipped_at": "2025-05-26T10:00:00Z",
    "address": { "recipient_name": "...", "address_line": "...", "city": "...", ... },
    "items": [
      { "product_name": "Linen Wrap Dress", "variant_size": "S", "variant_color": "Ivory", "image_url": "...", "quantity": 2, "unit_price": 1250000 }
    ],
    "created_at": "..."
  }
}
```

---

#### `POST /orders/:order_number/cancel`
Cancel an order. Only allowed when status is `pending` or `confirmed`. Restores stock automatically.
```json
// Response 200
{ "success": true, "message": "Order cancelled successfully" }
```
**Errors:** `404 ORDER_NOT_FOUND`, `409 CANNOT_CANCEL_ORDER`

---

#### `POST /orders/:order_number/complete`
Mark an order as completed/received by the customer. Only allowed when status is `delivered`.
```json
// Response 200
{ "success": true, "message": "Order completed successfully" }
```
**Errors:** `404 ORDER_NOT_FOUND`, `409 CANNOT_COMPLETE_ORDER`
```

---

### ⭐ Reviews (Protected — Customer)

#### `POST /reviews`
Submit a review. Customer must have a delivered order containing this product.
```json
// Request
{ "product_id": "uuid", "order_id": "uuid", "rating": 5, "body": "Amazing quality!" }

// Response 201
{ "success": true, "data": { "id": "uuid", "rating": 5, "body": "Amazing quality!", "created_at": "..." } }
```
**Errors:** `403 NOT_PURCHASED`, `403 ORDER_NOT_DELIVERED`, `409 ALREADY_REVIEWED`

---

### 🗂️ Admin — Profile (Protected — Admin)

#### `GET /admin/profile`
```json
{
  "success": true,
  "data": { "id": "uuid", "username": "admin", "email": "admin@juicy.com" }
}
```

---

### 🗂️ Admin — Products (Protected — Admin)

#### `GET /admin/products`
All products (including unavailable). Supports pagination + filters.

**Query params:** `page`, `per_page`, `category`, `available`

---

#### `POST /admin/products`
Create product. `multipart/form-data`.
```
name            string
slug            string
category_id     uuid
description     string
price           float
compare_at_price float (optional)
is_available    bool
is_featured     bool
tags            string (JSON array, e.g. '["new-arrival"]')
display_order   int
images[]        files (multiple, optional)
```
**Response 201:** `{ "success": true, "data": { ...product } }`

---

#### `PUT /admin/products/:id`
Update product metadata. `multipart/form-data` (same fields as POST).

#### `DELETE /admin/products/:id`
Delete product + all Cloudinary images.

---

#### `POST /admin/products/:id/images`
Upload additional images to an existing product. `multipart/form-data`.
```
images[]        files (multiple)
```

#### `POST /admin/products/:id/images/url`
Add an image to an existing product via a direct web/internet URL. `application/json`.
```json
// Request
{
  "image_url": "https://images.unsplash.com/photo-1546173152-318e7b25572c"
}

// Response 200
{
  "success": true,
  "message": "Product image URL added successfully",
  "data": { ...refreshed_product_details }
}
```

#### `DELETE /admin/products/:id/images/:image_id`
Delete a single product image + Cloudinary cleanup.

#### `PUT /admin/products/:id/images/:image_id/primary`
Set an image as the primary image.

---

#### `GET /admin/products/:id/variants`
All variants for a product.

#### `POST /admin/products/:id/variants`
Add a variant.
```json
{ "size": "L", "color": "Sand", "color_hex": "#c9b99a", "sku": "LWD-L-SND", "stock": 10, "additional_price": 0 }
```

#### `PUT /admin/products/:id/variants/:variant_id`
Update variant (stock, price, active status).

#### `DELETE /admin/products/:id/variants/:variant_id`
Deactivate variant (soft delete — set `is_active: false`).

---

### 🗂️ Admin — Categories (Protected — Admin)

#### `GET /admin/categories`
#### `GET /admin/categories/:id`
#### `POST /admin/categories`
```json
{ "name": "Dresses", "slug": "dresses", "description": "...", "display_order": 3, "is_active": true }
```
#### `PUT /admin/categories/:id`
#### `DELETE /admin/categories/:id`

---

### 🗂️ Admin — Orders (Protected — Admin)

#### `GET /admin/orders`
All orders. Supports pagination + filtering.

**Query params:** `page`, `per_page`, `status`, `payment_status`, `search` (order_number or customer email)

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "order_number": "JUICY-20250525-A3F7K2",
      "customer_name": "Jane Doe",
      "customer_email": "jane@example.com",
      "status": "pending",
      "payment_status": "unpaid",
      "total": 2525000,
      "item_count": 2,
      "created_at": "..."
    }
  ],
  "meta": { ... }
}
```

#### `GET /admin/orders/:id`
Full order detail including items and address.

#### `PUT /admin/orders/:id/status`
```json
{ "status": "shipped" }
```
**Note:** When status changes to `shipped`, `shipped_at` is set automatically. When `delivered`, `delivered_at` is set. Triggers email to customer on `shipped`.

#### `PUT /admin/orders/:id/payment`
```json
{ "payment_status": "paid" }
```

---

### 🗂️ Admin — Customers (Protected — Admin)

#### `GET /admin/customers`
All customers. Supports pagination + search.

**Query params:** `page`, `per_page`, `search` (name or email)

```json
{
  "success": true,
  "data": [
    { "id": "uuid", "full_name": "Jane Doe", "email": "...", "phone": "...", "order_count": 5, "total_spent": 12500000, "created_at": "..." }
  ],
  "meta": { ... }
}
```

#### `GET /admin/customers/:id`
Customer detail + order history summary.

#### `PATCH /admin/customers/:id/status`
```json
{ "is_active": false }
```

---

### 🗂️ Admin — Reviews (Protected — Admin)

#### `GET /admin/reviews`
All reviews. Supports pagination + filter.

**Query params:** `page`, `per_page`, `product_id`, `published`

#### `PUT /admin/reviews/:id/publish`
```json
{ "is_published": false }
```

#### `DELETE /admin/reviews/:id`

---

### 📊 Analytics — Admin (Protected — Admin)

#### `GET /admin/analytics/overview`
```json
{
  "success": true,
  "data": {
    "orders": { "total": 540, "pending": 12, "processing": 8, "this_month": 65 },
    "revenue": { "total": 675000000, "this_month": 82500000 },
    "customers": { "total": 320, "new_this_month": 28 },
    "products": { "total": 85, "out_of_stock": 3 }
  }
}
```

#### `GET /admin/analytics/orders/chart`
Order counts + revenue grouped by month (last 6 months).
```json
{
  "success": true,
  "data": [
    { "month": "2025-01", "order_count": 72, "revenue": 90000000 },
    { "month": "2025-02", "order_count": 85, "revenue": 106250000 }
  ]
}
```

---

## Error Codes Reference

| Code | HTTP | Meaning |
|---|---|---|
| `INVALID_CREDENTIALS` | 401 | Wrong email or password |
| `UNAUTHORIZED` | 401 | Missing or invalid JWT |
| `FORBIDDEN` | 403 | Valid JWT but insufficient access |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 422 | Request body failed validation |
| `EMAIL_TAKEN` | 409 | Email already registered |
| `ALREADY_REVIEWED` | 409 | Customer already reviewed this product for this order |
| `OUT_OF_STOCK` | 409 | One or more variants out of stock at checkout |
| `INSUFFICIENT_STOCK` | 409 | Requested quantity exceeds available stock |
| `CART_EMPTY` | 404 | Checkout attempted with empty cart |
| `NOT_PURCHASED` | 403 | Customer has not purchased this product |
| `ORDER_NOT_DELIVERED` | 403 | Order not yet delivered — review not allowed |
| `WRONG_PASSWORD` | 401 | Current password incorrect during password change |
| `CONFLICT` | 409 | Generic unique constraint violation |
| `ALREADY_IN_WISHLIST` | 409 | Variant already in customer's wishlist |
| `CANNOT_CANCEL_ORDER` | 409 | Order status does not allow cancellation |
| `INTERNAL_ERROR` | 500 | Unexpected server error |
