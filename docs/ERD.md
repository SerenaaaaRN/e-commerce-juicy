# ERD.md — Juicy
> Database schema, relationships, enums, and migration order.

---

## Entity Relationship Diagram

```
┌──────────────────┐
│     admins       │
├──────────────────┤
│ id               │ PK, UUID
│ username         │ VARCHAR(50), UNIQUE, NOT NULL
│ email            │ VARCHAR(255), UNIQUE, NOT NULL
│ password_hash    │ TEXT, NOT NULL
│ created_at       │ TIMESTAMPTZ
│ updated_at       │ TIMESTAMPTZ
└──────────────────┘

┌──────────────────────┐
│      customers       │
├──────────────────────┤
│ id                   │ PK, UUID
│ full_name            │ VARCHAR(255), NOT NULL
│ email                │ VARCHAR(255), UNIQUE, NOT NULL
│ password_hash        │ TEXT, NOT NULL
│ phone                │ VARCHAR(30)
│ is_active            │ BOOLEAN DEFAULT true
│ created_at           │ TIMESTAMPTZ
│ updated_at           │ TIMESTAMPTZ
└──────────┬───────────┘
           │ 1
           │
           ├──────────────────────────────► addresses (N)
           ├──────────────────────────────► orders (N)
           ├──────────────────────────────► cart_items (N)
           └──────────────────────────────► reviews (N)

┌──────────────────────┐
│      addresses       │
├──────────────────────┤
│ id                   │ PK, UUID
│ customer_id          │ FK → customers.id
│ label                │ VARCHAR(100)  -- e.g. "Home", "Office"
│ recipient_name       │ VARCHAR(255), NOT NULL
│ phone                │ VARCHAR(30), NOT NULL
│ address_line         │ TEXT, NOT NULL
│ city                 │ VARCHAR(100), NOT NULL
│ province             │ VARCHAR(100), NOT NULL
│ postal_code          │ VARCHAR(20), NOT NULL
│ is_default           │ BOOLEAN DEFAULT false
│ created_at           │ TIMESTAMPTZ
│ updated_at           │ TIMESTAMPTZ
└──────────────────────┘

┌──────────────────────┐         ┌──────────────────────────────────┐
│      categories      │         │            products              │
├──────────────────────┤         ├──────────────────────────────────┤
│ id                   │ PK UUID │ id                               │ PK, UUID
│ name                 │ VARCHAR │ category_id                      │ FK → categories.id
│ slug                 │ VARCHAR │ name                             │ VARCHAR(255), NOT NULL
│ description          │ TEXT    │ slug                             │ VARCHAR(255), UNIQUE, NOT NULL
│ display_order        │ INT     │ description                      │ TEXT
│ is_active            │ BOOLEAN │ price                            │ NUMERIC(12,2), NOT NULL
│ created_at           │ TSTZ    │ compare_at_price                 │ NUMERIC(12,2) -- original/crossed-out price
│ updated_at           │ TSTZ    │ is_available                     │ BOOLEAN DEFAULT true
└──────────┬───────────┘         │ is_featured                      │ BOOLEAN DEFAULT false
           │                     │ tags                             │ JSONB DEFAULT '[]'
           │ 1                   │ display_order                    │ INT DEFAULT 0
           └────────────────────►│ created_at                       │ TIMESTAMPTZ
                              N  │ updated_at                       │ TIMESTAMPTZ
                                 └──────────┬───────────────────────┘
                                            │ 1
                                            │
                            ┌───────────────┼───────────────────────┐
                            ▼               ▼                       ▼
                   product_images   product_variants            reviews
                   (N)              (N)                         (N)

┌──────────────────────────────┐
│       product_images         │
├──────────────────────────────┤
│ id                           │ PK, UUID
│ product_id                   │ FK → products.id
│ image_url                    │ TEXT, NOT NULL (Cloudinary secure_url)
│ cloudinary_public_id         │ TEXT, NOT NULL
│ alt_text                     │ VARCHAR(255)
│ display_order                │ INT DEFAULT 0
│ is_primary                   │ BOOLEAN DEFAULT false
│ created_at                   │ TIMESTAMPTZ
└──────────────────────────────┘

┌──────────────────────────────┐
│       product_variants       │
├──────────────────────────────┤
│ id                           │ PK, UUID
│ product_id                   │ FK → products.id
│ size                         │ VARCHAR(20), NOT NULL  -- XS, S, M, L, XL, XXL, or numeric
│ color                        │ VARCHAR(50), NOT NULL
│ color_hex                    │ VARCHAR(7)             -- e.g. #ffffff for color swatch
│ sku                          │ VARCHAR(100), UNIQUE, NOT NULL
│ stock                        │ INT NOT NULL DEFAULT 0
│ additional_price             │ NUMERIC(12,2) DEFAULT 0  -- price delta from base
│ is_active                    │ BOOLEAN DEFAULT true
│ created_at                   │ TIMESTAMPTZ
│ updated_at                   │ TIMESTAMPTZ
└──────────────────────────────┘

┌──────────────────────────────┐
│          cart_items          │
├──────────────────────────────┤
│ id                           │ PK, UUID
│ customer_id                  │ FK → customers.id
│ variant_id                   │ FK → product_variants.id
│ quantity                     │ INT NOT NULL DEFAULT 1
│ created_at                   │ TIMESTAMPTZ
│ updated_at                   │ TIMESTAMPTZ
└──────────────────────────────┘

┌──────────────────────────────┐         ┌──────────────────────────────┐
│           orders             │         │          order_items          │
├──────────────────────────────┤         ├──────────────────────────────┤
│ id                           │ PK UUID │ id                           │ PK, UUID
│ customer_id                  │ FK      │ order_id                     │ FK → orders.id
│ address_id                   │ FK      │ variant_id                   │ FK → product_variants.id
│ order_number                 │ VARCHAR │ product_name                 │ VARCHAR (snapshot)
│ status                       │ ENUM    │ variant_size                 │ VARCHAR (snapshot)
│ subtotal                     │ NUMERIC │ variant_color                │ VARCHAR (snapshot)
│ shipping_fee                 │ NUMERIC │ image_url                    │ TEXT (snapshot)
│ total                        │ NUMERIC │ quantity                     │ INT NOT NULL
│ payment_status               │ ENUM    │ unit_price                   │ NUMERIC (snapshot at time of purchase)
│ payment_method               │ VARCHAR │ created_at                   │ TIMESTAMPTZ
│ notes                        │ TEXT    └──────────────────────────────┘
│ shipped_at                   │ TIMESTAMPTZ
│ delivered_at                 │ TIMESTAMPTZ
│ created_at                   │ TIMESTAMPTZ
│ updated_at                   │ TIMESTAMPTZ
└──────────────────────────────┘

┌──────────────────────────────┐
│           reviews            │
├──────────────────────────────┤
│ id                           │ PK, UUID
│ product_id                   │ FK → products.id
│ customer_id                  │ FK → customers.id
│ order_id                     │ FK → orders.id  -- must have purchased to review
│ rating                       │ SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5)
│ body                         │ TEXT
│ is_published                 │ BOOLEAN DEFAULT true
│ created_at                   │ TIMESTAMPTZ
│ updated_at                   │ TIMESTAMPTZ
└──────────────────────────────┘
```

---

## Enums

```sql
-- Order lifecycle
CREATE TYPE order_status AS ENUM (
  'pending',      -- submitted, awaiting confirmation
  'confirmed',    -- admin confirmed
  'processing',   -- being packed
  'shipped',      -- dispatched to courier
  'delivered',    -- received by customer
  'cancelled',    -- cancelled before ship
  'returned'      -- return requested/completed
);

-- Payment status
CREATE TYPE payment_status AS ENUM (
  'unpaid',       -- not yet paid (COD or pending gateway)
  'paid',         -- payment confirmed
  'refunded'      -- refund issued
);
```

---

## Migration Files (Order)

| Order | File | Description |
|---|---|---|
| 001 | `create_enums` | All custom ENUM types |
| 002 | `create_admins` | Admin accounts table |
| 003 | `create_customers` | Customer accounts table |
| 004 | `create_addresses` | Customer addresses table |
| 005 | `create_categories` | Product categories table |
| 006 | `create_products` | Products table |
| 007 | `create_product_images` | Product images table |
| 008 | `create_product_variants` | Product variants (size × color × stock) |
| 009 | `create_cart_items` | Cart items table |
| 010 | `create_orders` | Orders table |
| 011 | `create_order_items` | Order line items table |
| 012 | `create_reviews` | Product reviews table |

---

## Full SQL — Up Migrations

### 001 — Create Enums
```sql
CREATE TYPE order_status AS ENUM (
  'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'
);

CREATE TYPE payment_status AS ENUM (
  'unpaid', 'paid', 'refunded'
);
```

### 002 — Create Admins
```sql
CREATE TABLE admins (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username      VARCHAR(50)  UNIQUE NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 003 — Create Customers
```sql
CREATE TABLE customers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name     VARCHAR(255) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  phone         VARCHAR(30),
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 004 — Create Addresses
```sql
CREATE TABLE addresses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id     UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  label           VARCHAR(100),
  recipient_name  VARCHAR(255) NOT NULL,
  phone           VARCHAR(30) NOT NULL,
  address_line    TEXT NOT NULL,
  city            VARCHAR(100) NOT NULL,
  province        VARCHAR(100) NOT NULL,
  postal_code     VARCHAR(20) NOT NULL,
  is_default      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_addresses_customer_id ON addresses(customer_id);
```

### 005 — Create Categories
```sql
CREATE TABLE categories (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(100) NOT NULL,
  slug          VARCHAR(100) UNIQUE NOT NULL,
  description   TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 006 — Create Products
```sql
CREATE TABLE products (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id       UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  name              VARCHAR(255) NOT NULL,
  slug              VARCHAR(255) UNIQUE NOT NULL,
  description       TEXT,
  price             NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  compare_at_price  NUMERIC(12, 2) CHECK (compare_at_price >= 0),
  is_available      BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured       BOOLEAN NOT NULL DEFAULT FALSE,
  tags              JSONB NOT NULL DEFAULT '[]',
  display_order     INT NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_is_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_slug ON products(slug);
```

### 007 — Create Product Images
```sql
CREATE TABLE product_images (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id            UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url             TEXT NOT NULL,
  cloudinary_public_id  TEXT NOT NULL,
  alt_text              VARCHAR(255),
  display_order         INT NOT NULL DEFAULT 0,
  is_primary            BOOLEAN NOT NULL DEFAULT FALSE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_images_product_id ON product_images(product_id);
```

### 008 — Create Product Variants
```sql
CREATE TABLE product_variants (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id       UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size             VARCHAR(20) NOT NULL,
  color            VARCHAR(50) NOT NULL,
  color_hex        VARCHAR(7),
  sku              VARCHAR(100) UNIQUE NOT NULL,
  stock            INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  additional_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_variants_product_id ON product_variants(product_id);
CREATE UNIQUE INDEX idx_variants_product_size_color ON product_variants(product_id, size, color);
```

### 009 — Create Cart Items
```sql
CREATE TABLE cart_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  variant_id  UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity    INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (customer_id, variant_id)
);

CREATE INDEX idx_cart_customer_id ON cart_items(customer_id);
```

### 010 — Create Orders
```sql
CREATE TABLE orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id     UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  address_id      UUID REFERENCES addresses(id) ON DELETE SET NULL,
  order_number    VARCHAR(20) UNIQUE NOT NULL,
  status          order_status NOT NULL DEFAULT 'pending',
  subtotal        NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
  shipping_fee    NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (shipping_fee >= 0),
  total           NUMERIC(12, 2) NOT NULL CHECK (total >= 0),
  payment_status  payment_status NOT NULL DEFAULT 'unpaid',
  payment_method  VARCHAR(100),
  notes           TEXT,
  shipped_at      TIMESTAMPTZ,
  delivered_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_number ON orders(order_number);
```

### 011 — Create Order Items
```sql
CREATE TABLE order_items (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id       UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  variant_id     UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  product_name   VARCHAR(255) NOT NULL,
  variant_size   VARCHAR(20) NOT NULL,
  variant_color  VARCHAR(50) NOT NULL,
  image_url      TEXT,
  quantity       INT NOT NULL CHECK (quantity > 0),
  unit_price     NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
```

### 012 — Create Reviews
```sql
CREATE TABLE reviews (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id    UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_id   UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  order_id      UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  rating        SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body          TEXT,
  is_published  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (product_id, customer_id, order_id)
);

CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_customer_id ON reviews(customer_id);
```

---

## Product Tags Reference (JSONB values)

Stored as a JSON array of strings in `products.tags`.

```json
["new-arrival", "bestseller", "limited-edition", "sale", "sustainable", "handcrafted"]
```

---

## Seed Data — Admin Account

```sql
INSERT INTO admins (username, email, password_hash)
VALUES (
  'admin',
  'admin@juicy.com',
  '$2a$12$...'  -- bcrypt hash of your chosen password
);
```

---

## Seed Data — Categories

```sql
INSERT INTO categories (name, slug, display_order) VALUES
  ('Tops',        'tops',        1),
  ('Bottoms',     'bottoms',     2),
  ('Dresses',     'dresses',     3),
  ('Outerwear',   'outerwear',   4),
  ('Accessories', 'accessories', 5),
  ('Sets',        'sets',        6);
```

---

## Key Design Notes

- `order_items` snapshots `product_name`, `variant_size`, `variant_color`, `image_url`, `unit_price` at checkout time — so order history stays accurate even if product is edited or deleted later.
- `cart_items` has a `UNIQUE (customer_id, variant_id)` constraint — duplicate adds increment `quantity` via `ON CONFLICT DO UPDATE`.
- `reviews.order_id` enforces purchase-verified reviews — a customer can only review a product they actually ordered.
- `product_variants` has a composite unique index on `(product_id, size, color)` to prevent duplicate variant combinations.
- Stock decrement happens atomically inside a transaction at order creation — roll back if any variant is out of stock.
