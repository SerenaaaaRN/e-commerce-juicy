-- Seed file for Juicy database
-- Clean up existing seed data if necessary
TRUNCATE TABLE reviews CASCADE;
TRUNCATE TABLE order_items CASCADE;
TRUNCATE TABLE orders CASCADE;
TRUNCATE TABLE cart_items CASCADE;
TRUNCATE TABLE product_variants CASCADE;
TRUNCATE TABLE product_images CASCADE;
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE categories CASCADE;
TRUNCATE TABLE addresses CASCADE;
TRUNCATE TABLE customers CASCADE;
TRUNCATE TABLE admins CASCADE;

-- 1. Seed Admin
INSERT INTO admins (username, email, password_hash)
VALUES (
  'admin',
  'admin@juicy.com',
  '$2a$12$.xiGFzad7/HaalXETL9mRejv0L3fNA9ggXzh3zi64a2wmUuVehEWy' -- bcrypt hash of 'admin123'
);

-- 2. Seed Categories
INSERT INTO categories (id, name, slug, description, display_order) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Tops', 'tops', 'Warm editorial crop shirts, wrap blouses, and premium linen tops.', 1),
  ('22222222-2222-2222-2222-222222222222', 'Bottoms', 'bottoms', 'Linen trousers, silk slip skirts, and tailored wool shorts.', 2),
  ('33333333-3333-3333-3333-333333333333', 'Dresses', 'dresses', 'Elegant column dresses, asymmetric drape designs, and backless midis.', 3),
  ('44444444-4444-4444-4444-444444444444', 'Outerwear', 'outerwear', 'Oversized canvas trenches, linen blazers, and double breasted coats.', 4),
  ('55555555-5555-5555-5555-555555555555', 'Accessories', 'accessories', 'Premium leather bags, wide straw hats, and handcrafted jewellery.', 5),
  ('66666666-6666-6666-6666-666666666666', 'Sets', 'sets', 'Coordinated linen loungewear and structural suit pairings.', 6);

-- 3. Seed Products
INSERT INTO products (id, category_id, name, slug, description, price, compare_at_price, is_available, is_featured, tags, display_order) VALUES
  -- Tops
  ('a1010101-1010-1010-1010-101010101010', '11111111-1111-1111-1111-111111111111', 
   'Linen Boxy Shirt', 'linen-boxy-shirt', 
   'A relaxed, boxy shirt cut from organic linen. Featuring a clean collar, drop shoulders, and mother-of-pearl buttons. Designed for a light, breezy look.', 
   120.00, 150.00, true, true, '["new-arrival", "sustainable"]'::jsonb, 1),

  ('a1020202-1020-1020-1020-102010201020', '11111111-1111-1111-1111-111111111111', 
   'Silk Wrap Blouse', 'silk-wrap-blouse', 
   'Crafted from fluid mulberry silk, this wrap blouse contours beautifully. Features elongated cuffs and a delicate waist tie for structural elegance.', 
   180.00, NULL, true, false, '["limited-edition"]'::jsonb, 2),

  ('a1030303-1030-1030-1030-103010301030', '11111111-1111-1111-1111-111111111111', 
   'Ribbed Knit Tank', 'ribbed-knit-tank', 
   'An essential layering piece knit from a premium cotton-silk blend. Form-fitting ribbed texture with a classic scoop neckline.', 
   75.00, 90.00, true, false, '["bestseller"]'::jsonb, 3),

  -- Bottoms
  ('b2010101-2010-2010-2010-201020102010', '22222222-2222-2222-2222-222222222222', 
   'Tailored Linen Trouser', 'tailored-linen-trouser', 
   'High-waisted linen trousers featuring wide legs, double front pleats, and side slip pockets. A perfect structural matching piece for hot summer afternoons.', 
   210.00, NULL, true, true, '["sustainable", "new-arrival"]'::jsonb, 1),

  ('b2020202-2020-2020-2020-202020202020', '22222222-2222-2222-2222-222222222222', 
   'Silk Slip Skirt', 'silk-slip-skirt', 
   'An elegant, bias-cut midi skirt made from heavy silk satin. Elasticated waist for comfort, draping smoothly to a raw midi hem.', 
   195.00, NULL, true, false, '["bestseller"]'::jsonb, 2),

  ('b2030303-2030-2030-2030-203020302030', '22222222-2222-2222-2222-222222222222', 
   'Pleated Wool Short', 'pleated-wool-short', 
   'Tailored shorts crafted from a lightweight wool-crepe blend. High-rise fit with crisp pressed creases and an adjustable tab waist.', 
   160.00, 220.00, true, false, '["sale"]'::jsonb, 3),

  -- Dresses
  ('c3010101-3010-3010-3010-301030103010', '33333333-3333-3333-3333-333333333333', 
   'Asymmetric Drape Dress', 'asymmetric-drape-dress', 
   'A sculptural midi dress showcasing an asymmetric neckline and elegant side draping. Crafted from dry wool-crepe for an architectural silhouette.', 
   340.00, NULL, true, true, '["limited-edition", "new-arrival"]'::jsonb, 1),

  ('c3020202-3020-3020-3020-302030203020', '33333333-3333-3333-3333-333333333333', 
   'Backless Linen Midi', 'backless-linen-midi', 
   'Summer standard dress with a plunging open back and delicate crossover straps. Made from breathable sand-washed linen.', 
   280.00, NULL, true, false, '["bestseller", "sustainable"]'::jsonb, 2),

  ('c3030303-3030-3030-3030-303030303030', '33333333-3333-3333-3333-333333333333', 
   'Knit Column Dress', 'knit-column-dress', 
   'Floor-length, form-fitting dress in a fine open-knit cotton. Features a high collar, sleeveless design, and slide split hem.', 
   310.00, 380.00, true, false, '["new-arrival"]'::jsonb, 3),

  -- Outerwear
  ('d4010101-4010-4010-4010-401040104010', '44444444-4444-4444-4444-444444444444', 
   'Oversized Canvas Trench', 'oversized-canvas-trench', 
   'A bold reimagining of the classic trench coat. Made from structural cotton canvas with wide lapels, storm flaps, and an adjustable waist belt.', 
   450.00, NULL, true, true, '["new-arrival", "bestseller"]'::jsonb, 1),

  ('d4020202-4020-4020-4020-402040204020', '44444444-4444-4444-4444-444444444444', 
   'Cropped Linen Blazer', 'cropped-linen-blazer', 
   'A sharp, collarless cropped blazer in heavy linen. Padded shoulders add clean structural lines to a relaxed summer silhouette.', 
   320.00, NULL, true, false, '["sustainable"]'::jsonb, 2),

  ('d4030303-4030-4030-4030-403040304030', '44444444-4444-4444-4444-444444444444', 
   'Wool Double Breasted Coat', 'wool-double-breasted-coat', 
   'A heavy winter essential made from virgin wool. Double breasted layout, oversized notch collars, and deep patch pockets.', 
   580.00, 720.00, true, false, '["sale", "limited-edition"]'::jsonb, 3),

  -- Accessories
  ('e5010101-5010-5010-5010-501050105010', '55555555-5555-5555-5555-555555555555', 
   'Le Rond Leather Bag', 'le-rond-leather-bag', 
   'A signature circular leather handbag with a structured top handle. Crafted from smooth vegetable-tanned calfskin with gold hardware.', 
   420.00, NULL, true, true, '["bestseller", "limited-edition"]'::jsonb, 1),

  ('e5020202-5020-5020-5020-502050205020', '55555555-5555-5555-5555-555555555555', 
   'Wide Brim Straw Hat', 'wide-brim-straw-hat', 
   'Hand-woven from natural palm straw. Features a dramatically oversized flat brim and a terracotta cotton ribbon under the chin.', 
   140.00, NULL, true, false, '["new-arrival"]'::jsonb, 2),

  ('e5030303-5030-5030-5030-503050305030', '55555555-5555-5555-5555-555555555555', 
   'Chunky Link Necklace', 'chunky-link-necklace', 
   'A statement necklace featuring interlocking hammered brass links dipped in 24k gold. Handcrafted by local artisans.', 
   95.00, 120.00, true, false, '["handcrafted"]'::jsonb, 3),

  -- Sets
  ('f6010101-6010-6010-6010-601060106010', '66666666-6666-6666-6666-666666666666', 
   'Linen Lounge Set', 'linen-lounge-set', 
   'A matching summer set comprising a relaxed drop-shoulder button-down and comfortable drawstring shorts. Cut from washed breathable linen.', 
   290.00, 340.00, true, true, '["bestseller", "sustainable"]'::jsonb, 1),

  ('f6020202-6020-6020-6020-602060206020', '66666666-6666-6666-6666-666666666666', 
   'Ribbed Knit Lounge Set', 'ribbed-knit-lounge-set', 
   'Cozy matching duo featuring a fine-knit sleeveless top and loose-fit palazzo trousers in our signature cream shade.', 
   260.00, NULL, true, false, '["new-arrival"]'::jsonb, 2),

  ('f6030303-6030-6030-6030-603060306030', '66666666-6666-6666-6666-666666666666', 
   'Tailored Blazer Suit Set', 'tailored-blazer-suit-set', 
   'The ultimate editorial power suit. Combines a structural peak-lapel double-breasted blazer and matching high-waisted wide-leg trousers.', 
   680.00, NULL, true, false, '["limited-edition"]'::jsonb, 3);

-- 4. Seed Product Variants (Size x Color combos)
-- S: Cream (#f5efe6), M: Terracotta (#b5633a), L: Soil (#3d2e22)
INSERT INTO product_variants (product_id, size, color, color_hex, sku, stock, additional_price) VALUES
  -- Linen Boxy Shirt
  ('a1010101-1010-1010-1010-101010101010', 'S', 'Cream', '#f5efe6', 'TOPS-LN-SHRT-CRM-S', 15, 0.00),
  ('a1010101-1010-1010-1010-101010101010', 'M', 'Terracotta', '#b5633a', 'TOPS-LN-SHRT-TER-M', 10, 0.00),
  ('a1010101-1010-1010-1010-101010101010', 'L', 'Soil', '#3d2e22', 'TOPS-LN-SHRT-SOL-L', 8, 0.00),

  -- Silk Wrap Blouse
  ('a1020202-1020-1020-1020-102010201020', 'S', 'Cream', '#f5efe6', 'TOPS-SLK-WRP-CRM-S', 12, 0.00),
  ('a1020202-1020-1020-1020-102010201020', 'M', 'Terracotta', '#b5633a', 'TOPS-SLK-WRP-TER-M', 8, 0.00),
  ('a1020202-1020-1020-1020-102010201020', 'L', 'Soil', '#3d2e22', 'TOPS-SLK-WRP-SOL-L', 5, 0.00),

  -- Ribbed Knit Tank
  ('a1030303-1030-1030-1030-103010301030', 'S', 'Cream', '#f5efe6', 'TOPS-RB-TNK-CRM-S', 30, 0.00),
  ('a1030303-1030-1030-1030-103010301030', 'M', 'Terracotta', '#b5633a', 'TOPS-RB-TNK-TER-M', 25, 0.00),
  ('a1030303-1030-1030-1030-103010301030', 'L', 'Soil', '#3d2e22', 'TOPS-RB-TNK-SOL-L', 20, 0.00),

  -- Tailored Linen Trouser
  ('b2010101-2010-2010-2010-201020102010', 'S', 'Cream', '#f5efe6', 'BOT-LN-TRSR-CRM-S', 10, 0.00),
  ('b2010101-2010-2010-2010-201020102010', 'M', 'Terracotta', '#b5633a', 'BOT-LN-TRSR-TER-M', 10, 0.00),
  ('b2010101-2010-2010-2010-201020102010', 'L', 'Soil', '#3d2e22', 'BOT-LN-TRSR-SOL-L', 7, 0.00),

  -- Silk Slip Skirt
  ('b2020202-2020-2020-2020-202020202020', 'S', 'Cream', '#f5efe6', 'BOT-SLK-SKRT-CRM-S', 14, 0.00),
  ('b2020202-2020-2020-2020-202020202020', 'M', 'Terracotta', '#b5633a', 'BOT-SLK-SKRT-TER-M', 12, 0.00),
  ('b2020202-2020-2020-2020-202020202020', 'L', 'Soil', '#3d2e22', 'BOT-SLK-SKRT-SOL-L', 6, 0.00),

  -- Pleated Wool Short
  ('b2030303-2030-2030-2030-203020302030', 'S', 'Cream', '#f5efe6', 'BOT-PL-SHRT-CRM-S', 8, 0.00),
  ('b2030303-2030-2030-2030-203020302030', 'M', 'Terracotta', '#b5633a', 'BOT-PL-SHRT-TER-M', 8, 0.00),
  ('b2030303-2030-2030-2030-203020302030', 'L', 'Soil', '#3d2e22', 'BOT-PL-SHRT-SOL-L', 5, 0.00),

  -- Asymmetric Drape Dress
  ('c3010101-3010-3010-3010-301030103010', 'S', 'Cream', '#f5efe6', 'DRS-ASY-DRP-CRM-S', 6, 15.00),
  ('c3010101-3010-3010-3010-301030103010', 'M', 'Terracotta', '#b5633a', 'DRS-ASY-DRP-TER-M', 8, 15.00),
  ('c3010101-3010-3010-3010-301030103010', 'L', 'Soil', '#3d2e22', 'DRS-ASY-DRP-SOL-L', 4, 15.00),

  -- Backless Linen Midi
  ('c3020202-3020-3020-3020-302030203020', 'S', 'Cream', '#f5efe6', 'DRS-BK-MIDI-CRM-S', 15, 0.00),
  ('c3020202-3020-3020-3020-302030203020', 'M', 'Terracotta', '#b5633a', 'DRS-BK-MIDI-TER-M', 10, 0.00),
  ('c3020202-3020-3020-3020-302030203020', 'L', 'Soil', '#3d2e22', 'DRS-BK-MIDI-SOL-L', 8, 0.00),

  -- Knit Column Dress
  ('c3030303-3030-3030-3030-303030303030', 'S', 'Cream', '#f5efe6', 'DRS-KNT-COL-CRM-S', 10, 10.00),
  ('c3030303-3030-3030-3030-303030303030', 'M', 'Terracotta', '#b5633a', 'DRS-KNT-COL-TER-M', 8, 10.00),
  ('c3030303-3030-3030-3030-303030303030', 'L', 'Soil', '#3d2e22', 'DRS-KNT-COL-SOL-L', 5, 10.00),

  -- Oversized Canvas Trench
  ('d4010101-4010-4010-4010-401040104010', 'S', 'Cream', '#f5efe6', 'OUT-OV-TRNC-CRM-S', 5, 20.00),
  ('d4010101-4010-4010-4010-401040104010', 'M', 'Terracotta', '#b5633a', 'OUT-OV-TRNC-TER-M', 6, 20.00),
  ('d4010101-4010-4010-4010-401040104010', 'L', 'Soil', '#3d2e22', 'OUT-OV-TRNC-SOL-L', 4, 20.00),

  -- Cropped Linen Blazer
  ('d4020202-4020-4020-4020-402040204020', 'S', 'Cream', '#f5efe6', 'OUT-CR-BLZ-CRM-S', 10, 0.00),
  ('d4020202-4020-4020-4020-402040204020', 'M', 'Terracotta', '#b5633a', 'OUT-CR-BLZ-TER-M', 8, 0.00),
  ('d4020202-4020-4020-4020-402040204020', 'L', 'Soil', '#3d2e22', 'OUT-CR-BLZ-SOL-L', 5, 0.00),

  -- Wool Double Breasted Coat
  ('d4030303-4030-4030-4030-403040304030', 'S', 'Cream', '#f5efe6', 'OUT-WL-DBCO-CRM-S', 4, 30.00),
  ('d4030303-4030-4030-4030-403040304030', 'M', 'Terracotta', '#b5633a', 'OUT-WL-DBCO-TER-M', 4, 30.00),
  ('d4030303-4030-4030-4030-403040304030', 'L', 'Soil', '#3d2e22', 'OUT-WL-DBCO-SOL-L', 3, 30.00),

  -- Le Rond Leather Bag
  ('e5010101-5010-5010-5010-501050105010', 'O/S', 'Cream', '#f5efe6', 'ACC-RND-BAG-CRM-OS', 10, 0.00),
  ('e5010101-5010-5010-5010-501050105010', 'O/S', 'Terracotta', '#b5633a', 'ACC-RND-BAG-TER-OS', 15, 0.00),
  ('e5010101-5010-5010-5010-501050105010', 'O/S', 'Soil', '#3d2e22', 'ACC-RND-BAG-SOL-OS', 8, 0.00),

  -- Wide Brim Straw Hat
  ('e5020202-5020-5020-5020-502050205020', 'O/S', 'Cream', '#f5efe6', 'ACC-WD-HAT-CRM-OS', 12, 0.00),
  ('e5020202-5020-5020-5020-502050205020', 'O/S', 'Terracotta', '#b5633a', 'ACC-WD-HAT-TER-OS', 8, 0.00),

  -- Chunky Link Necklace
  ('e5030303-5030-5030-5030-503050305030', 'O/S', 'Gold', '#d4af37', 'ACC-CHNK-NKL-GLD-OS', 25, 0.00),

  -- Linen Lounge Set
  ('f6010101-6010-6010-6010-601060106010', 'S', 'Cream', '#f5efe6', 'SET-LN-LNG-CRM-S', 12, 0.00),
  ('f6010101-6010-6010-6010-601060106010', 'M', 'Terracotta', '#b5633a', 'SET-LN-LNG-TER-M', 10, 0.00),
  ('f6010101-6010-6010-6010-601060106010', 'L', 'Soil', '#3d2e22', 'SET-LN-LNG-SOL-L', 6, 0.00),

  -- Ribbed Knit Lounge Set
  ('f6020202-6020-6020-6020-602060206020', 'S', 'Cream', '#f5efe6', 'SET-RB-KNT-CRM-S', 15, 0.00),
  ('f6020202-6020-6020-6020-602060206020', 'M', 'Terracotta', '#b5633a', 'SET-RB-KNT-TER-M', 12, 0.00),
  ('f6020202-6020-6020-6020-602060206020', 'L', 'Soil', '#3d2e22', 'SET-RB-KNT-SOL-L', 8, 0.00),

  -- Tailored Blazer Suit Set
  ('f6030303-6030-6030-6030-603060306030', 'S', 'Cream', '#f5efe6', 'SET-TL-SUIT-CRM-S', 6, 40.00),
  ('f6030303-6030-6030-6030-603060306030', 'M', 'Terracotta', '#b5633a', 'SET-TL-SUIT-TER-M', 6, 40.00),
  ('f6030303-6030-6030-6030-603060306030', 'L', 'Soil', '#3d2e22', 'SET-TL-SUIT-SOL-L', 4, 40.00);

-- 5. Seed Product Images (Primary + Secondary)
INSERT INTO product_images (product_id, image_url, cloudinary_public_id, alt_text, display_order, is_primary) VALUES
  -- Linen Boxy Shirt
  ('a1010101-1010-1010-1010-101010101010', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&auto=format&fit=crop', 'juicy/tops/linen_boxy_primary', 'Linen Boxy Shirt Front View', 1, true),
  ('a1010101-1010-1010-1010-101010101010', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop', 'juicy/tops/linen_boxy_detail', 'Linen Boxy Shirt Fabric Detail', 2, false),

  -- Silk Wrap Blouse
  ('a1020202-1020-1020-1020-102010201020', 'https://images.unsplash.com/photo-1548624149-f8b03d65f528?q=80&w=600&auto=format&fit=crop', 'juicy/tops/silk_wrap_primary', 'Silk Wrap Blouse Front View', 1, true),
  ('a1020202-1020-1020-1020-102010201020', 'https://images.unsplash.com/photo-1589310243389-96a5483213a8?q=80&w=600&auto=format&fit=crop', 'juicy/tops/silk_wrap_detail', 'Silk Wrap Blouse Style Detail', 2, false),

  -- Ribbed Knit Tank
  ('a1030303-1030-1030-1030-103010301030', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop', 'juicy/tops/ribbed_knit_primary', 'Ribbed Knit Tank Model View', 1, true),
  ('a1030303-1030-1030-1030-103010301030', 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=600&auto=format&fit=crop', 'juicy/tops/ribbed_knit_detail', 'Ribbed Knit Tank Detail View', 2, false),

  -- Tailored Linen Trouser
  ('b2010101-2010-2010-2010-201020102010', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop', 'juicy/bottoms/tailored_trouser_primary', 'Tailored Linen Trouser Front View', 1, true),
  ('b2010101-2010-2010-2010-201020102010', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600&auto=format&fit=crop', 'juicy/bottoms/tailored_trouser_detail', 'Tailored Linen Trouser Detail', 2, false),

  -- Silk Slip Skirt
  ('b2020202-2020-2020-2020-202020202020', 'https://images.unsplash.com/photo-1583496661160-fb48862c4a4e?q=80&w=600&auto=format&fit=crop', 'juicy/bottoms/silk_skirt_primary', 'Silk Slip Skirt Model View', 1, true),
  ('b2020202-2020-2020-2020-202020202020', 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=600&auto=format&fit=crop', 'juicy/bottoms/silk_skirt_detail', 'Silk Slip Skirt Movement View', 2, false),

  -- Pleated Wool Short
  ('b2030303-2030-2030-2030-203020302030', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&auto=format&fit=crop', 'juicy/bottoms/pleated_short_primary', 'Pleated Wool Short Front View', 1, true),
  ('b2030303-2030-2030-2030-203020302030', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop', 'juicy/bottoms/pleated_short_detail', 'Pleated Wool Short Model Detail', 2, false),

  -- Asymmetric Drape Dress
  ('c3010101-3010-3010-3010-301030103010', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop', 'juicy/dresses/drape_dress_primary', 'Asymmetric Drape Dress Model View', 1, true),
  ('c3010101-3010-3010-3010-301030103010', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600&auto=format&fit=crop', 'juicy/dresses/drape_dress_detail', 'Asymmetric Drape Dress Texture', 2, false),

  -- Backless Linen Midi
  ('c3020202-3020-3020-3020-302030203020', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600&auto=format&fit=crop', 'juicy/dresses/backless_midi_primary', 'Backless Linen Midi Front View', 1, true),
  ('c3020202-3020-3020-3020-302030203020', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600&auto=format&fit=crop', 'juicy/dresses/backless_midi_back', 'Backless Linen Midi Open Back Detail', 2, false),

  -- Knit Column Dress
  ('c3030303-3030-3030-3030-303030303030', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=600&auto=format&fit=crop', 'juicy/dresses/knit_column_primary', 'Knit Column Dress Front View', 1, true),
  ('c3030303-3030-3030-3030-303030303030', 'https://images.unsplash.com/photo-1618932260643-eee4a2f6c9d6?q=80&w=600&auto=format&fit=crop', 'juicy/dresses/knit_column_detail', 'Knit Column Dress Material Detail', 2, false),

  -- Oversized Canvas Trench
  ('d4010101-4010-4010-4010-401040104010', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop', 'juicy/outerwear/canvas_trench_primary', 'Oversized Canvas Trench Front View', 1, true),
  ('d4010101-4010-4010-4010-401040104010', 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=600&auto=format&fit=crop', 'juicy/outerwear/canvas_trench_back', 'Oversized Canvas Trench Back View', 2, false),

  -- Cropped Linen Blazer
  ('d4020202-4020-4020-4020-402040204020', 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?q=80&w=600&auto=format&fit=crop', 'juicy/outerwear/cropped_blazer_primary', 'Cropped Linen Blazer Model View', 1, true),
  ('d4020202-4020-4020-4020-402040204020', 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600&auto=format&fit=crop', 'juicy/outerwear/cropped_blazer_detail', 'Cropped Linen Blazer Stitch Detail', 2, false),

  -- Wool Double Breasted Coat
  ('d4030303-4030-4030-4030-403040304030', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop', 'juicy/outerwear/wool_coat_primary', 'Wool Double Breasted Coat Front View', 1, true),
  ('d4030303-4030-4030-4030-403040304030', 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=600&auto=format&fit=crop', 'juicy/outerwear/wool_coat_detail', 'Wool Double Breasted Coat Detail', 2, false),

  -- Le Rond Leather Bag
  ('e5010101-5010-5010-5010-501050105010', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop', 'juicy/accessories/leather_bag_primary', 'Le Rond Leather Bag Studio Front', 1, true),
  ('e5010101-5010-5010-5010-501050105010', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600&auto=format&fit=crop', 'juicy/accessories/leather_bag_detail', 'Le Rond Leather Bag Handle Detail', 2, false),

  -- Wide Brim Straw Hat
  ('e5020202-5020-5020-5020-502050205020', 'https://images.unsplash.com/photo-1572451479139-6a308211d8be?q=80&w=600&auto=format&fit=crop', 'juicy/accessories/straw_hat_primary', 'Wide Brim Straw Hat Front View', 1, true),
  ('e5020202-5020-5020-5020-502050205020', 'https://images.unsplash.com/photo-1533827432537-70133748f5c8?q=80&w=600&auto=format&fit=crop', 'juicy/accessories/straw_hat_detail', 'Wide Brim Straw Hat Flat Lay', 2, false),

  -- Chunky Link Necklace
  ('e5030303-5030-5030-5030-503050305030', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop', 'juicy/accessories/link_necklace_primary', 'Chunky Link Necklace Flat View', 1, true),
  ('e5030303-5030-5030-5030-503050305030', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop', 'juicy/accessories/link_necklace_detail', 'Chunky Link Necklace Clasp Detail', 2, false),

  -- Linen Lounge Set
  ('f6010101-6010-6010-6010-601060106010', 'https://images.unsplash.com/photo-1607345366928-199e5760eeaa?q=80&w=600&auto=format&fit=crop', 'juicy/sets/linen_lounge_primary', 'Linen Lounge Set Model Front', 1, true),
  ('f6010101-6010-6010-6010-601060106010', 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600&auto=format&fit=crop', 'juicy/sets/linen_lounge_flat', 'Linen Lounge Set Flat Lay', 2, false),

  -- Ribbed Knit Lounge Set
  ('f6020202-6020-6020-6020-602060206020', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=600&auto=format&fit=crop', 'juicy/sets/knit_lounge_primary', 'Ribbed Knit Lounge Set Model View', 1, true),
  ('f6020202-6020-6020-6020-602060206020', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop', 'juicy/sets/knit_lounge_detail', 'Ribbed Knit Lounge Set Fabric Close-up', 2, false),

  -- Tailored Blazer Suit Set
  ('f6030303-6030-6030-6030-603060306030', 'https://images.unsplash.com/photo-1548624149-f8b03d65f528?q=80&w=600&auto=format&fit=crop', 'juicy/sets/blazer_suit_primary', 'Tailored Blazer Suit Set Front View', 1, true),
  ('f6030303-6030-6030-6030-603060306030', 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600&auto=format&fit=crop', 'juicy/sets/blazer_suit_detail', 'Tailored Blazer Suit Set Model Detail', 2, false);
