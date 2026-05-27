ALTER TABLE product_images ALTER COLUMN cloudinary_public_id SET NOT NULL;
ALTER TABLE product_images DROP COLUMN IF EXISTS updated_at;
