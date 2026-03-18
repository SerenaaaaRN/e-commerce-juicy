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
