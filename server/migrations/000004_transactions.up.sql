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
