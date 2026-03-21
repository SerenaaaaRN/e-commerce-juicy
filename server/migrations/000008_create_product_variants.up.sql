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
