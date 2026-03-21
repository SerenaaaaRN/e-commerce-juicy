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
