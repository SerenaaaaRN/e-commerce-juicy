-- Seed data for analytics (customers, orders, order_items)
-- Run after seed.sql (which populates products, variants, etc.)

-- Clean up existing order/customer data
TRUNCATE TABLE order_items CASCADE;
TRUNCATE TABLE orders CASCADE;
TRUNCATE TABLE addresses CASCADE;
TRUNCATE TABLE customers CASCADE;

-- 1. Seed Customers (15)
INSERT INTO customers (id, full_name, email, password_hash, phone, is_active, created_at) VALUES
  ('c0000001-ccaa-4000-8000-000000000001', 'Olivia Chen',     'olivia.chen@email.com',     '$2a$12$.xiGFzad7/HaalXETL9mRejv0L3fNA9ggXzh3zi64a2wmUuVehEWy', '+1-555-0101', true, '2025-09-15 10:30:00+00'),
  ('c0000002-ccaa-4000-8000-000000000002', 'Ethan Rodriguez',  'ethan.r@email.com',         '$2a$12$.xiGFzad7/HaalXETL9mRejv0L3fNA9ggXzh3zi64a2wmUuVehEWy', '+1-555-0102', true, '2025-09-20 14:00:00+00'),
  ('c0000003-ccaa-4000-8000-000000000003', 'Sophia Kim',       'sophia.kim@email.com',      '$2a$12$.xiGFzad7/HaalXETL9mRejv0L3fNA9ggXzh3zi64a2wmUuVehEWy', '+1-555-0103', true, '2025-10-01 09:15:00+00'),
  ('c0000004-ccaa-4000-8000-000000000004', 'James Thompson',   'james.t@email.com',         '$2a$12$.xiGFzad7/HaalXETL9mRejv0L3fNA9ggXzh3zi64a2wmUuVehEWy', '+1-555-0104', true, '2025-10-05 11:45:00+00'),
  ('c0000005-ccaa-4000-8000-000000000005', 'Mia Patel',        'mia.patel@email.com',       '$2a$12$.xiGFzad7/HaalXETL9mRejv0L3fNA9ggXzh3zi64a2wmUuVehEWy', '+1-555-0105', true, '2025-10-12 16:30:00+00'),
  ('c0000006-ccaa-4000-8000-000000000006', 'Noah Williams',    'noah.w@email.com',          '$2a$12$.xiGFzad7/HaalXETL9mRejv0L3fNA9ggXzh3zi64a2wmUuVehEWy', '+1-555-0106', true, '2025-10-20 08:00:00+00'),
  ('c0000007-ccaa-4000-8000-000000000007', 'Emma Gonzalez',    'emma.g@email.com',          '$2a$12$.xiGFzad7/HaalXETL9mRejv0L3fNA9ggXzh3zi64a2wmUuVehEWy', '+1-555-0107', true, '2025-11-01 13:20:00+00'),
  ('c0000008-ccaa-4000-8000-000000000008', 'Liam Brown',       'liam.brown@email.com',      '$2a$12$.xiGFzad7/HaalXETL9mRejv0L3fNA9ggXzh3zi64a2wmUuVehEWy', '+1-555-0108', true, '2025-11-05 10:00:00+00'),
  ('c0000009-ccaa-4000-8000-000000000009', 'Ava Martinez',     'ava.m@email.com',           '$2a$12$.xiGFzad7/HaalXETL9mRejv0L3fNA9ggXzh3zi64a2wmUuVehEWy', '+1-555-0109', true, '2025-11-10 15:45:00+00'),
  ('c0000010-ccaa-4000-8000-000000000010', 'Lucas Anderson',   'lucas.a@email.com',         '$2a$12$.xiGFzad7/HaalXETL9mRejv0L3fNA9ggXzh3zi64a2wmUuVehEWy', '+1-555-0110', true, '2025-11-18 09:30:00+00'),
  ('c0000011-ccaa-4000-8000-000000000011', 'Isabella Lee',     'isabella.lee@email.com',    '$2a$12$.xiGFzad7/HaalXETL9mRejv0L3fNA9ggXzh3zi64a2wmUuVehEWy', '+1-555-0111', true, '2025-12-01 12:00:00+00'),
  ('c0000012-ccaa-4000-8000-000000000012', 'Mason Taylor',     'mason.t@email.com',         '$2a$12$.xiGFzad7/HaalXETL9mRejv0L3fNA9ggXzh3zi64a2wmUuVehEWy', '+1-555-0112', true, '2025-12-05 14:15:00+00'),
  ('c0000013-ccaa-4000-8000-000000000013', 'Charlotte Wang',   'charlotte.w@email.com',     '$2a$12$.xiGFzad7/HaalXETL9mRejv0L3fNA9ggXzh3zi64a2wmUuVehEWy', '+1-555-0113', true, '2025-12-10 11:00:00+00'),
  ('c0000014-ccaa-4000-8000-000000000014', 'Alexander Davis',  'alex.davis@email.com',      '$2a$12$.xiGFzad7/HaalXETL9mRejv0L3fNA9ggXzh3zi64a2wmUuVehEWy', '+1-555-0114', true, '2026-01-08 10:30:00+00'),
  ('c0000015-ccaa-4000-8000-000000000015', 'Amelia Wilson',    'amelia.w@email.com',        '$2a$12$.xiGFzad7/HaalXETL9mRejv0L3fNA9ggXzh3zi64a2wmUuVehEWy', '+1-555-0115', false, '2026-01-15 16:00:00+00');

-- 2. Seed Addresses (one per customer)
INSERT INTO addresses (id, customer_id, label, recipient_name, phone, address_line, city, province, postal_code, is_default) VALUES
  ('a0000001-aaaa-4000-8000-000000000001', 'c0000001-ccaa-4000-8000-000000000001', 'Home', 'Olivia Chen', '+1-555-0101', '120 Greenway Blvd, Apt 4B', 'New York', 'NY', '10012', true),
  ('a0000002-aaaa-4000-8000-000000000002', 'c0000002-ccaa-4000-8000-000000000002', 'Home', 'Ethan Rodriguez', '+1-555-0102', '855 Market St, Unit 301', 'San Francisco', 'CA', '94103', true),
  ('a0000003-aaaa-4000-8000-000000000003', 'c0000003-ccaa-4000-8000-000000000003', 'Home', 'Sophia Kim', '+1-555-0103', '42 Oak Avenue', 'Austin', 'TX', '78701', true),
  ('a0000004-aaaa-4000-8000-000000000004', 'c0000004-ccaa-4000-8000-000000000004', 'Home', 'James Thompson', '+1-555-0104', '789 Lake Shore Dr', 'Chicago', 'IL', '60611', true),
  ('a0000005-aaaa-4000-8000-000000000005', 'c0000005-ccaa-4000-8000-000000000005', 'Home', 'Mia Patel', '+1-555-0105', '56 Pine St, #7C', 'Seattle', 'WA', '98101', true),
  ('a0000006-aaaa-4000-8000-000000000006', 'c0000006-ccaa-4000-8000-000000000006', 'Home', 'Noah Williams', '+1-555-0106', '320 Broadway', 'Portland', 'OR', '97201', true),
  ('a0000007-aaaa-4000-8000-000000000007', 'c0000007-ccaa-4000-8000-000000000007', 'Home', 'Emma Gonzalez', '+1-555-0107', '1500 Sunset Blvd', 'Los Angeles', 'CA', '90026', true),
  ('a0000008-aaaa-4000-8000-000000000008', 'c0000008-ccaa-4000-8000-000000000008', 'Home', 'Liam Brown', '+1-555-0108', '77 Beacon Hill Ave', 'Boston', 'MA', '02108', true),
  ('a0000009-aaaa-4000-8000-000000000009', 'c0000009-ccaa-4000-8000-000000000009', 'Home', 'Ava Martinez', '+1-555-0109', '900 Elm St', 'Denver', 'CO', '80202', true),
  ('a0000010-aaaa-4000-8000-000000000010', 'c0000010-ccaa-4000-8000-000000000010', 'Home', 'Lucas Anderson', '+1-555-0110', '211 River Rd', 'Nashville', 'TN', '37201', true),
  ('a0000011-aaaa-4000-8000-000000000011', 'c0000011-ccaa-4000-8000-000000000011', 'Home', 'Isabella Lee', '+1-555-0111', '34 Park Avenue', 'Miami', 'FL', '33101', true),
  ('a0000012-aaaa-4000-8000-000000000012', 'c0000012-ccaa-4000-8000-000000000012', 'Home', 'Mason Taylor', '+1-555-0112', '678 College St', 'Atlanta', 'GA', '30303', true),
  ('a0000013-aaaa-4000-8000-000000000013', 'c0000013-ccaa-4000-8000-000000000013', 'Home', 'Charlotte Wang', '+1-555-0113', '15 Harbour View Rd', 'San Diego', 'CA', '92101', true),
  ('a0000014-aaaa-4000-8000-000000000014', 'c0000014-ccaa-4000-8000-000000000014', 'Home', 'Alexander Davis', '+1-555-0114', '422 Maple Dr', 'Philadelphia', 'PA', '19106', true),
  ('a0000015-aaaa-4000-8000-000000000015', 'c0000015-ccaa-4000-8000-000000000015', 'Home', 'Amelia Wilson', '+1-555-0115', '88 Cedar Ln', 'Minneapolis', 'MN', '55401', true);

-- 3. Seed Orders (40 orders spanning Dec 2025 - May 2026)
INSERT INTO orders (id, customer_id, address_id, order_number, status, subtotal, shipping_fee, total, payment_status, payment_method, notes, shipped_at, delivered_at, created_at, updated_at) VALUES
  -- December 2025 (6 orders)
  ('00000001-faaa-4000-8000-000000000001', 'c0000001-ccaa-4000-8000-000000000001', 'a0000001-aaaa-4000-8000-000000000001', 'JUICY-20251201-0001', 'delivered',   195.00,  0.00, 195.00, 'paid',   'credit_card', NULL,                 '2025-12-02 14:30:00+00', '2025-12-06 10:00:00+00', '2025-12-01 10:00:00+00', '2025-12-06 10:00:00+00'),
  ('00000002-faaa-4000-8000-000000000002', 'c0000003-ccaa-4000-8000-000000000003', 'a0000003-aaaa-4000-8000-000000000003', 'JUICY-20251203-0002', 'delivered',   420.00, 10.00, 430.00, 'paid',   'paypal',     NULL,                 '2025-12-05 09:00:00+00', '2025-12-10 14:00:00+00', '2025-12-03 11:30:00+00', '2025-12-10 14:00:00+00'),
  ('00000003-faaa-4000-8000-000000000003', 'c0000005-ccaa-4000-8000-000000000005', 'a0000005-aaaa-4000-8000-000000000005', 'JUICY-20251208-0003', 'delivered',   120.00,  0.00, 120.00, 'paid',   'stripe',     NULL,                 '2025-12-10 11:00:00+00', '2025-12-14 16:00:00+00', '2025-12-08 09:15:00+00', '2025-12-14 16:00:00+00'),
  ('00000004-faaa-4000-8000-000000000004', 'c0000007-ccaa-4000-8000-000000000007', 'a0000007-aaaa-4000-8000-000000000007', 'JUICY-20251214-0004', 'delivered',   680.00, 15.00, 695.00, 'paid',   'credit_card', 'Gift wrapping please', '2025-12-16 13:00:00+00', '2025-12-20 11:00:00+00', '2025-12-14 15:45:00+00', '2025-12-20 11:00:00+00'),
  ('00000005-faaa-4000-8000-000000000005', 'c0000009-ccaa-4000-8000-000000000009', 'a0000009-aaaa-4000-8000-000000000009', 'JUICY-20251218-0005', 'cancelled',   310.00,  0.00, 310.00, 'refunded', 'stripe',     'Changed mind',       NULL,                 NULL,                 '2025-12-18 10:00:00+00', '2025-12-19 08:00:00+00'),
  ('00000006-faaa-4000-8000-000000000006', 'c0000002-ccaa-4000-8000-000000000002', 'a0000002-aaaa-4000-8000-000000000002', 'JUICY-20251222-0006', 'delivered',   540.00, 10.00, 550.00, 'paid',   'credit_card', NULL,                 '2025-12-24 10:30:00+00', '2025-12-28 15:00:00+00', '2025-12-22 14:00:00+00', '2025-12-28 15:00:00+00'),

  -- January 2026 (7 orders)
  ('00000007-faaa-4000-8000-000000000007', 'c0000004-ccaa-4000-8000-000000000004', 'a0000004-aaaa-4000-8000-000000000004', 'JUICY-20260104-0007', 'delivered',   450.00,  0.00, 450.00, 'paid',   'paypal',     NULL,                 '2026-01-06 09:00:00+00', '2026-01-11 12:00:00+00', '2026-01-04 10:30:00+00', '2026-01-11 12:00:00+00'),
  ('00000008-faaa-4000-8000-000000000008', 'c0000006-ccaa-4000-8000-000000000006', 'a0000006-aaaa-4000-8000-000000000006', 'JUICY-20260107-0008', 'delivered',   210.00,  0.00, 210.00, 'paid',   'credit_card', NULL,                 '2026-01-09 11:00:00+00', '2026-01-13 14:00:00+00', '2026-01-07 08:45:00+00', '2026-01-13 14:00:00+00'),
  ('00000009-faaa-4000-8000-000000000009', 'c0000008-ccaa-4000-8000-000000000008', 'a0000008-aaaa-4000-8000-000000000008', 'JUICY-20260110-0009', 'delivered',   320.00, 10.00, 330.00, 'paid',   'stripe',     NULL,                 '2026-01-12 14:00:00+00', '2026-01-16 11:00:00+00', '2026-01-10 13:00:00+00', '2026-01-16 11:00:00+00'),
  ('00000010-faaa-4000-8000-000000000010', 'c0000010-ccaa-4000-8000-000000000010', 'a0000010-aaaa-4000-8000-000000000010', 'JUICY-20260113-0010', 'delivered',   560.00, 15.00, 575.00, 'paid',   'credit_card', NULL,                 '2026-01-15 10:00:00+00', '2026-01-20 16:00:00+00', '2026-01-13 09:00:00+00', '2026-01-20 16:00:00+00'),
  ('00000011-faaa-4000-8000-000000000011', 'c0000011-ccaa-4000-8000-000000000011', 'a0000011-aaaa-4000-8000-000000000011', 'JUICY-20260117-0011', 'shipped',     290.00,  0.00, 290.00, 'paid',   'paypal',     NULL,                 '2026-01-19 12:00:00+00', NULL,                 '2026-01-17 14:30:00+00', '2026-01-19 12:00:00+00'),
  ('00000012-faaa-4000-8000-000000000012', 'c0000012-ccaa-4000-8000-000000000012', 'a0000012-aaaa-4000-8000-000000000012', 'JUICY-20260122-0012', 'delivered',   195.00,  0.00, 195.00, 'paid',   'credit_card', NULL,                 '2026-01-24 09:00:00+00', '2026-01-28 13:00:00+00', '2026-01-22 11:15:00+00', '2026-01-28 13:00:00+00'),
  ('00000013-faaa-4000-8000-000000000013', 'c0000013-ccaa-4000-8000-000000000013', 'a0000013-aaaa-4000-8000-000000000013', 'JUICY-20260127-0013', 'cancelled',   160.00,  0.00, 160.00, 'refunded', 'stripe',     'Out of stock',       NULL,                 NULL,                 '2026-01-27 16:00:00+00', '2026-01-28 10:00:00+00'),

  -- February 2026 (7 orders)
  ('00000014-faaa-4000-8000-000000000014', 'c0000001-ccaa-4000-8000-000000000001', 'a0000001-aaaa-4000-8000-000000000001', 'JUICY-20260201-0014', 'delivered',   340.00,  0.00, 340.00, 'paid',   'credit_card', NULL,                 '2026-02-03 10:00:00+00', '2026-02-07 14:00:00+00', '2026-02-01 09:30:00+00', '2026-02-07 14:00:00+00'),
  ('00000015-faaa-4000-8000-000000000015', 'c0000003-ccaa-4000-8000-000000000003', 'a0000003-aaaa-4000-8000-000000000003', 'JUICY-20260204-0015', 'delivered',   630.00, 15.00, 645.00, 'paid',   'paypal',     NULL,                 '2026-02-06 11:30:00+00', '2026-02-11 10:00:00+00', '2026-02-04 14:00:00+00', '2026-02-11 10:00:00+00'),
  ('00000016-faaa-4000-8000-000000000016', 'c0000005-ccaa-4000-8000-000000000005', 'a0000005-aaaa-4000-8000-000000000005', 'JUICY-20260208-0016', 'delivered',   120.00,  0.00, 120.00, 'paid',   'stripe',     NULL,                 '2026-02-10 09:00:00+00', '2026-02-14 16:00:00+00', '2026-02-08 10:00:00+00', '2026-02-14 16:00:00+00'),
  ('00000017-faaa-4000-8000-000000000017', 'c0000007-ccaa-4000-8000-000000000007', 'a0000007-aaaa-4000-8000-000000000007', 'JUICY-20260211-0017', 'delivered',   280.00,  0.00, 280.00, 'paid',   'credit_card', 'Leave at door',       '2026-02-13 14:00:00+00', '2026-02-17 11:00:00+00', '2026-02-11 16:30:00+00', '2026-02-17 11:00:00+00'),
  ('00000018-faaa-4000-8000-000000000018', 'c0000009-ccaa-4000-8000-000000000009', 'a0000009-aaaa-4000-8000-000000000009', 'JUICY-20260215-0018', 'delivered',   580.00, 20.00, 600.00, 'paid',   'credit_card', NULL,                 '2026-02-17 10:00:00+00', '2026-02-22 15:00:00+00', '2026-02-15 11:00:00+00', '2026-02-22 15:00:00+00'),
  ('00000019-faaa-4000-8000-000000000019', 'c0000014-ccaa-4000-8000-000000000014', 'a0000014-aaaa-4000-8000-000000000014', 'JUICY-20260219-0019', 'shipped',     420.00, 10.00, 430.00, 'paid',   'paypal',     NULL,                 '2026-02-21 12:00:00+00', NULL,                 '2026-02-19 09:15:00+00', '2026-02-21 12:00:00+00'),
  ('00000020-faaa-4000-8000-000000000020', 'c0000002-ccaa-4000-8000-000000000002', 'a0000002-aaaa-4000-8000-000000000002', 'JUICY-20260225-0020', 'processing',  260.00,  0.00, 260.00, 'paid',   'stripe',     NULL,                 NULL,                 NULL,                 '2026-02-25 14:00:00+00', '2026-02-25 14:00:00+00'),

  -- March 2026 (7 orders)
  ('00000021-faaa-4000-8000-000000000021', 'c0000004-ccaa-4000-8000-000000000004', 'a0000004-aaaa-4000-8000-000000000004', 'JUICY-20260302-0021', 'delivered',   180.00,  0.00, 180.00, 'paid',   'credit_card', NULL,                 '2026-03-04 09:00:00+00', '2026-03-08 12:00:00+00', '2026-03-02 10:00:00+00', '2026-03-08 12:00:00+00'),
  ('00000022-faaa-4000-8000-000000000022', 'c0000006-ccaa-4000-8000-000000000006', 'a0000006-aaaa-4000-8000-000000000006', 'JUICY-20260305-0022', 'delivered',   600.00, 15.00, 615.00, 'paid',   'paypal',     NULL,                 '2026-03-07 11:00:00+00', '2026-03-12 14:00:00+00', '2026-03-05 13:30:00+00', '2026-03-12 14:00:00+00'),
  ('00000023-faaa-4000-8000-000000000023', 'c0000008-ccaa-4000-8000-000000000008', 'a0000008-aaaa-4000-8000-000000000008', 'JUICY-20260308-0023', 'delivered',   310.00,  0.00, 310.00, 'paid',   'stripe',     NULL,                 '2026-03-10 14:00:00+00', '2026-03-14 11:00:00+00', '2026-03-08 09:45:00+00', '2026-03-14 11:00:00+00'),
  ('00000024-faaa-4000-8000-000000000024', 'c0000010-ccaa-4000-8000-000000000010', 'a0000010-aaaa-4000-8000-000000000010', 'JUICY-20260312-0024', 'delivered',   140.00,  0.00, 140.00, 'paid',   'credit_card', NULL,                 '2026-03-14 10:00:00+00', '2026-03-18 16:00:00+00', '2026-03-12 11:00:00+00', '2026-03-18 16:00:00+00'),
  ('00000025-faaa-4000-8000-000000000025', 'c0000011-ccaa-4000-8000-000000000011', 'a0000011-aaaa-4000-8000-000000000011', 'JUICY-20260317-0025', 'shipped',     450.00, 10.00, 460.00, 'paid',   'credit_card', NULL,                 '2026-03-19 12:00:00+00', NULL,                 '2026-03-17 14:00:00+00', '2026-03-19 12:00:00+00'),
  ('00000026-faaa-4000-8000-000000000026', 'c0000012-ccaa-4000-8000-000000000012', 'a0000012-aaaa-4000-8000-000000000012', 'JUICY-20260321-0026', 'confirmed',   680.00, 20.00, 700.00, 'unpaid',  'credit_card', 'Express shipping',    NULL,                 NULL,                 '2026-03-21 10:30:00+00', '2026-03-21 10:30:00+00'),
  ('00000027-faaa-4000-8000-000000000027', 'c0000013-ccaa-4000-8000-000000000013', 'a0000013-aaaa-4000-8000-000000000013', 'JUICY-20260326-0027', 'delivered',   405.00,  0.00, 405.00, 'paid',   'paypal',     NULL,                 '2026-03-28 09:00:00+00', '2026-04-01 14:00:00+00', '2026-03-26 15:00:00+00', '2026-04-01 14:00:00+00'),

  -- April 2026 (7 orders)
  ('00000028-faaa-4000-8000-000000000028', 'c0000001-ccaa-4000-8000-000000000001', 'a0000001-aaaa-4000-8000-000000000001', 'JUICY-20260401-0028', 'delivered',   340.00,  0.00, 340.00, 'paid',   'stripe',     NULL,                 '2026-04-03 10:00:00+00', '2026-04-07 15:00:00+00', '2026-04-01 09:00:00+00', '2026-04-07 15:00:00+00'),
  ('00000029-faaa-4000-8000-000000000029', 'c0000003-ccaa-4000-8000-000000000003', 'a0000003-aaaa-4000-8000-000000000003', 'JUICY-20260404-0029', 'delivered',   210.00,  0.00, 210.00, 'paid',   'credit_card', NULL,                 '2026-04-06 11:00:00+00', '2026-04-10 12:00:00+00', '2026-04-04 14:30:00+00', '2026-04-10 12:00:00+00'),
  ('00000030-faaa-4000-8000-000000000030', 'c0000005-ccaa-4000-8000-000000000005', 'a0000005-aaaa-4000-8000-000000000005', 'JUICY-20260408-0030', 'delivered',   320.00, 10.00, 330.00, 'paid',   'paypal',     NULL,                 '2026-04-10 09:00:00+00', '2026-04-14 16:00:00+00', '2026-04-08 10:00:00+00', '2026-04-14 16:00:00+00'),
  ('00000031-faaa-4000-8000-000000000031', 'c0000007-ccaa-4000-8000-000000000007', 'a0000007-aaaa-4000-8000-000000000007', 'JUICY-20260412-0031', 'shipped',     195.00,  0.00, 195.00, 'paid',   'credit_card', 'Ring doorbell',       '2026-04-14 14:00:00+00', NULL,                 '2026-04-12 11:15:00+00', '2026-04-14 14:00:00+00'),
  ('00000032-faaa-4000-8000-000000000032', 'c0000009-ccaa-4000-8000-000000000009', 'a0000009-aaaa-4000-8000-000000000009', 'JUICY-20260416-0032', 'delivered',   290.00,  0.00, 290.00, 'paid',   'stripe',     NULL,                 '2026-04-18 10:00:00+00', '2026-04-22 13:00:00+00', '2026-04-16 09:00:00+00', '2026-04-22 13:00:00+00'),
  ('00000033-faaa-4000-8000-000000000033', 'c0000014-ccaa-4000-8000-000000000014', 'a0000014-aaaa-4000-8000-000000000014', 'JUICY-20260420-0033', 'processing',  160.00,  0.00, 160.00, 'paid',   'credit_card', NULL,                 NULL,                 NULL,                 '2026-04-20 14:00:00+00', '2026-04-20 14:00:00+00'),
  ('00000034-faaa-4000-8000-000000000034', 'c0000002-ccaa-4000-8000-000000000002', 'a0000002-aaaa-4000-8000-000000000002', 'JUICY-20260425-0034', 'delivered',   420.00, 15.00, 435.00, 'paid',   'paypal',     NULL,                 '2026-04-27 12:00:00+00', '2026-05-01 11:00:00+00', '2026-04-25 16:00:00+00', '2026-05-01 11:00:00+00'),

  -- May 2026 (6 orders, current month - some still processing/pending)
  ('00000035-faaa-4000-8000-000000000035', 'c0000004-ccaa-4000-8000-000000000004', 'a0000004-aaaa-4000-8000-000000000004', 'JUICY-20260502-0035', 'delivered',   580.00, 20.00, 600.00, 'paid',   'credit_card', NULL,                 '2026-05-04 10:00:00+00', '2026-05-08 14:00:00+00', '2026-05-02 10:30:00+00', '2026-05-08 14:00:00+00'),
  ('00000036-faaa-4000-8000-000000000036', 'c0000006-ccaa-4000-8000-000000000006', 'a0000006-aaaa-4000-8000-000000000006', 'JUICY-20260506-0036', 'delivered',   260.00,  0.00, 260.00, 'paid',   'stripe',     NULL,                 '2026-05-08 09:00:00+00', '2026-05-12 16:00:00+00', '2026-05-06 09:00:00+00', '2026-05-12 16:00:00+00'),
  ('00000037-faaa-4000-8000-000000000037', 'c0000008-ccaa-4000-8000-000000000008', 'a0000008-aaaa-4000-8000-000000000008', 'JUICY-20260510-0037', 'shipped',     450.00, 10.00, 460.00, 'paid',   'credit_card', NULL,                 '2026-05-12 14:00:00+00', NULL,                 '2026-05-10 11:45:00+00', '2026-05-12 14:00:00+00'),
  ('00000038-faaa-4000-8000-000000000038', 'c0000010-ccaa-4000-8000-000000000010', 'a0000010-aaaa-4000-8000-000000000010', 'JUICY-20260514-0038', 'processing',  310.00,  0.00, 310.00, 'paid',   'paypal',     NULL,                 NULL,                 NULL,                 '2026-05-14 10:00:00+00', '2026-05-14 10:00:00+00'),
  ('00000039-faaa-4000-8000-000000000039', 'c0000011-ccaa-4000-8000-000000000011', 'a0000011-aaaa-4000-8000-000000000011', 'JUICY-20260518-0039', 'confirmed',   195.00,  0.00, 195.00, 'unpaid',  'stripe',     'Will pick up',       NULL,                 NULL,                 '2026-05-18 14:30:00+00', '2026-05-18 14:30:00+00'),
  ('00000040-faaa-4000-8000-000000000040', 'c0000012-ccaa-4000-8000-000000000012', 'a0000012-aaaa-4000-8000-000000000012', 'JUICY-20260522-0040', 'pending',     420.00, 10.00, 430.00, 'unpaid',  'credit_card', NULL,                 NULL,                 NULL,                 '2026-05-22 09:00:00+00', '2026-05-22 09:00:00+00');

-- 4. Seed Order Items (1-3 items per order, 91 items total)
-- variant_id is NULL since variant IDs are auto-generated in seed.sql
INSERT INTO order_items (order_id, variant_id, product_name, variant_size, variant_color, image_url, quantity, unit_price, created_at) VALUES
  -- Order 1 (1 item): Silk Slip Skirt
  ('00000001-faaa-4000-8000-000000000001', NULL, 'Silk Slip Skirt',          'M', 'Cream',     'https://images.unsplash.com/photo-1583496661160-fb48862c4a4e?q=80&w=200&auto=format&fit=crop', 1, 195.00, '2025-12-01 10:00:00+00'),

  -- Order 2 (2 items): Le Rond Leather Bag + Ribbed Knit Tank
  ('00000002-faaa-4000-8000-000000000002', NULL, 'Le Rond Leather Bag',      'O/S', 'Terracotta', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=200&auto=format&fit=crop', 1, 420.00, '2025-12-03 11:30:00+00'),
  ('00000002-faaa-4000-8000-000000000002', NULL, 'Ribbed Knit Tank',          'M', 'Cream',     'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&auto=format&fit=crop', 2, 75.00,  '2025-12-03 11:30:00+00'),

  -- Order 3 (1 item): Linen Boxy Shirt
  ('00000003-faaa-4000-8000-000000000003', NULL, 'Linen Boxy Shirt',          'S', 'Terracotta', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=200&auto=format&fit=crop', 1, 120.00, '2025-12-08 09:15:00+00'),

  -- Order 4 (2 items): Tailored Blazer Suit Set
  ('00000004-faaa-4000-8000-000000000004', NULL, 'Tailored Blazer Suit Set',  'M', 'Cream',     'https://images.unsplash.com/photo-1548624149-f8b03d65f528?q=80&w=200&auto=format&fit=crop', 1, 680.00, '2025-12-14 15:45:00+00'),

  -- Order 5 (1 item): Knit Column Dress (cancelled)
  ('00000005-faaa-4000-8000-000000000005', NULL, 'Knit Column Dress',         'S', 'Terracotta', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=200&auto=format&fit=crop', 1, 310.00, '2025-12-18 10:00:00+00'),

  -- Order 6 (2 items): Cropped Linen Blazer ×2
  ('00000006-faaa-4000-8000-000000000006', NULL, 'Cropped Linen Blazer',      'M', 'Cream',     'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?q=80&w=200&auto=format&fit=crop', 1, 320.00, '2025-12-22 14:00:00+00'),
  ('00000006-faaa-4000-8000-000000000006', NULL, 'Tailored Linen Trouser',    'M', 'Soil',      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=200&auto=format&fit=crop', 1, 210.00, '2025-12-22 14:00:00+00'),

  -- Order 7 (1 item): Oversized Canvas Trench
  ('00000007-faaa-4000-8000-000000000007', NULL, 'Oversized Canvas Trench',   'M', 'Terracotta', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=200&auto=format&fit=crop', 1, 450.00, '2026-01-04 10:30:00+00'),

  -- Order 8 (1 item): Tailored Linen Trouser
  ('00000008-faaa-4000-8000-000000000008', NULL, 'Tailored Linen Trouser',    'S', 'Cream',     'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=200&auto=format&fit=crop', 1, 210.00, '2026-01-07 08:45:00+00'),

  -- Order 9 (1 item): Asymmetric Drape Dress
  ('00000009-faaa-4000-8000-000000000009', NULL, 'Asymmetric Drape Dress',    'M', 'Terracotta', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=200&auto=format&fit=crop', 1, 320.00, '2026-01-10 13:00:00+00'),

  -- Order 10 (2 items): Wool Double Breasted Coat
  ('00000010-faaa-4000-8000-000000000010', NULL, 'Wool Double Breasted Coat','S', 'Cream',     'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop', 1, 580.00, '2026-01-13 09:00:00+00'),

  -- Order 11 (1 item): Linen Lounge Set
  ('00000011-faaa-4000-8000-000000000011', NULL, 'Linen Lounge Set',          'M', 'Terracotta', 'https://images.unsplash.com/photo-1607345366928-199e5760eeaa?q=80&w=200&auto=format&fit=crop', 1, 290.00, '2026-01-17 14:30:00+00'),

  -- Order 12 (1 item): Silk Slip Skirt
  ('00000012-faaa-4000-8000-000000000012', NULL, 'Silk Slip Skirt',          'S', 'Soil',      'https://images.unsplash.com/photo-1583496661160-fb48862c4a4e?q=80&w=200&auto=format&fit=crop', 1, 195.00, '2026-01-22 11:15:00+00'),

  -- Order 13 (1 item): Pleated Wool Short (cancelled)
  ('00000013-faaa-4000-8000-000000000013', NULL, 'Pleated Wool Short',        'S', 'Cream',     'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=200&auto=format&fit=crop', 1, 160.00, '2026-01-27 16:00:00+00'),

  -- Order 14 (1 item): Knit Column Dress
  ('00000014-faaa-4000-8000-000000000014', NULL, 'Knit Column Dress',         'M', 'Terracotta', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=200&auto=format&fit=crop', 1, 340.00, '2026-02-01 09:30:00+00'),

  -- Order 15 (2 items): Tailored Blazer Suit Set + Chunky Link
  ('00000015-faaa-4000-8000-000000000015', NULL, 'Tailored Blazer Suit Set',  'S', 'Cream',     'https://images.unsplash.com/photo-1548624149-f8b03d65f528?q=80&w=200&auto=format&fit=crop', 1, 680.00, '2026-02-04 14:00:00+00'),

  -- Order 16 (1 item): Linen Boxy Shirt
  ('00000016-faaa-4000-8000-000000000016', NULL, 'Linen Boxy Shirt',          'M', 'Cream',     'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=200&auto=format&fit=crop', 1, 120.00, '2026-02-08 10:00:00+00'),

  -- Order 17 (1 item): Backless Linen Midi
  ('00000017-faaa-4000-8000-000000000017', NULL, 'Backless Linen Midi',       'M', 'Cream',     'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=200&auto=format&fit=crop', 1, 280.00, '2026-02-11 16:30:00+00'),

  -- Order 18 (2 items): Wool DB Coat
  ('00000018-faaa-4000-8000-000000000018', NULL, 'Wool Double Breasted Coat','M', 'Terracotta', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop', 1, 580.00, '2026-02-15 11:00:00+00'),

  -- Order 19 (1 item): Le Rond Leather Bag
  ('00000019-faaa-4000-8000-000000000019', NULL, 'Le Rond Leather Bag',      'O/S', 'Cream',   'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=200&auto=format&fit=crop', 1, 420.00, '2026-02-19 09:15:00+00'),

  -- Order 20 (1 item): Ribbed Knit Lounge Set
  ('00000020-faaa-4000-8000-000000000020', NULL, 'Ribbed Knit Lounge Set',    'M', 'Cream',     'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=200&auto=format&fit=crop', 1, 260.00, '2026-02-25 14:00:00+00'),

  -- Order 21 (1 item): Silk Wrap Blouse
  ('00000021-faaa-4000-8000-000000000021', NULL, 'Silk Wrap Blouse',          'M', 'Terracotta', 'https://images.unsplash.com/photo-1548624149-f8b03d65f528?q=80&w=200&auto=format&fit=crop', 1, 180.00, '2026-03-02 10:00:00+00'),

  -- Order 22 (2 items): Le Rond + Linen Boxy
  ('00000022-faaa-4000-8000-000000000022', NULL, 'Le Rond Leather Bag',      'O/S', 'Soil',     'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=200&auto=format&fit=crop', 1, 420.00, '2026-03-05 13:30:00+00'),
  ('00000022-faaa-4000-8000-000000000022', NULL, 'Linen Boxy Shirt',          'L',  'Cream',     'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=200&auto=format&fit=crop', 1, 120.00, '2026-03-05 13:30:00+00'),

  -- Order 23 (1 item): Knit Column Dress
  ('00000023-faaa-4000-8000-000000000023', NULL, 'Knit Column Dress',         'L',  'Cream',     'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=200&auto=format&fit=crop', 1, 310.00, '2026-03-08 09:45:00+00'),

  -- Order 24 (1 item): Wide Brim Straw Hat
  ('00000024-faaa-4000-8000-000000000024', NULL, 'Wide Brim Straw Hat',      'O/S', 'Cream',     'https://images.unsplash.com/photo-1572451479139-6a308211d8be?q=80&w=200&auto=format&fit=crop', 1, 140.00, '2026-03-12 11:00:00+00'),

  -- Order 25 (3 items): Canvas Trench + Rib Tank + Necklace
  ('00000025-faaa-4000-8000-000000000025', NULL, 'Oversized Canvas Trench',   'M',  'Cream',     'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=200&auto=format&fit=crop', 1, 450.00, '2026-03-17 14:00:00+00'),
  ('00000025-faaa-4000-8000-000000000025', NULL, 'Ribbed Knit Tank',          'S',  'Cream',     'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&auto=format&fit=crop', 2, 75.00,  '2026-03-17 14:00:00+00'),
  ('00000025-faaa-4000-8000-000000000025', NULL, 'Chunky Link Necklace',     'O/S', 'Gold',      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=200&auto=format&fit=crop', 1, 95.00,  '2026-03-17 14:00:00+00'),

  -- Order 26 (1 item): Tailored Blazer Suit Set
  ('00000026-faaa-4000-8000-000000000026', NULL, 'Tailored Blazer Suit Set',  'M',  'Terracotta', 'https://images.unsplash.com/photo-1548624149-f8b03d65f528?q=80&w=200&auto=format&fit=crop', 1, 680.00, '2026-03-21 10:30:00+00'),

  -- Order 27 (3 items): Backless Midi ×1 + Cropped Blazer ×1 + Wide Hat ×1
  ('00000027-faaa-4000-8000-000000000027', NULL, 'Backless Linen Midi',       'S',  'Terracotta', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=200&auto=format&fit=crop', 1, 280.00, '2026-03-26 15:00:00+00'),
  ('00000027-faaa-4000-8000-000000000027', NULL, 'Cropped Linen Blazer',      'M',  'Cream',      'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?q=80&w=200&auto=format&fit=crop', 1, 320.00, '2026-03-26 15:00:00+00'),
  ('00000027-faaa-4000-8000-000000000027', NULL, 'Silk Wrap Blouse',          'L',  'Cream',      'https://images.unsplash.com/photo-1548624149-f8b03d65f528?q=80&w=200&auto=format&fit=crop', 1, 180.00, '2026-03-26 15:00:00+00'),

  -- Order 28 (1 item): Drape Dress
  ('00000028-faaa-4000-8000-000000000028', NULL, 'Asymmetric Drape Dress',    'M',  'Terracotta', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=200&auto=format&fit=crop', 1, 340.00, '2026-04-01 09:00:00+00'),

  -- Order 29 (2 items): Tailored Linen Trouser
  ('00000029-faaa-4000-8000-000000000029', NULL, 'Tailored Linen Trouser',    'M',  'Terracotta', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=200&auto=format&fit=crop', 1, 210.00, '2026-04-04 14:30:00+00'),

  -- Order 30 (2 items): Asymmetric Drape Dress
  ('00000030-faaa-4000-8000-000000000030', NULL, 'Asymmetric Drape Dress',    'S',  'Soil',       'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=200&auto=format&fit=crop', 1, 340.00, '2026-04-08 10:00:00+00'),

  -- Order 31 (1 item): Silk Slip Skirt
  ('00000031-faaa-4000-8000-000000000031', NULL, 'Silk Slip Skirt',          'M',  'Terracotta', 'https://images.unsplash.com/photo-1583496661160-fb48862c4a4e?q=80&w=200&auto=format&fit=crop', 1, 195.00, '2026-04-12 11:15:00+00'),

  -- Order 32 (1 item): Linen Lounge Set
  ('00000032-faaa-4000-8000-000000000032', NULL, 'Linen Lounge Set',          'S',  'Soil',       'https://images.unsplash.com/photo-1607345366928-199e5760eeaa?q=80&w=200&auto=format&fit=crop', 1, 290.00, '2026-04-16 09:00:00+00'),

  -- Order 33 (1 item): Pleated Wool Short
  ('00000033-faaa-4000-8000-000000000033', NULL, 'Pleated Wool Short',        'M',  'Cream',      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=200&auto=format&fit=crop', 1, 160.00, '2026-04-20 14:00:00+00'),

  -- Order 34 (2 items): Le Rond Bag + Wide Hat
  ('00000034-faaa-4000-8000-000000000034', NULL, 'Le Rond Leather Bag',      'O/S', 'Terracotta', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=200&auto=format&fit=crop', 1, 420.00, '2026-04-25 16:00:00+00'),

  -- Order 35 (1 item): Wool DB Coat
  ('00000035-faaa-4000-8000-000000000035', NULL, 'Wool Double Breasted Coat','M',  'Cream',      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop', 1, 580.00, '2026-05-02 10:30:00+00'),

  -- Order 36 (2 items): Knit Lounge Set
  ('00000036-faaa-4000-8000-000000000036', NULL, 'Ribbed Knit Lounge Set',    'M',  'Terracotta', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=200&auto=format&fit=crop', 1, 260.00, '2026-05-06 09:00:00+00'),

  -- Order 37 (2 items): Canvas Trench + Rib Tank
  ('00000037-faaa-4000-8000-000000000037', NULL, 'Oversized Canvas Trench',   'S',  'Soil',       'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=200&auto=format&fit=crop', 1, 450.00, '2026-05-10 11:45:00+00'),
  ('00000037-faaa-4000-8000-000000000037', NULL, 'Ribbed Knit Tank',          'M',  'Cream',      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&auto=format&fit=crop', 1, 75.00,  '2026-05-10 11:45:00+00'),

  -- Order 38 (1 item): Knit Column Dress
  ('00000038-faaa-4000-8000-000000000038', NULL, 'Knit Column Dress',         'M',  'Soil',       'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=200&auto=format&fit=crop', 1, 310.00, '2026-05-14 10:00:00+00'),

  -- Order 39 (1 item): Silk Slip Skirt
  ('00000039-faaa-4000-8000-000000000039', NULL, 'Silk Slip Skirt',          'S',  'Soil',       'https://images.unsplash.com/photo-1583496661160-fb48862c4a4e?q=80&w=200&auto=format&fit=crop', 1, 195.00, '2026-05-18 14:30:00+00'),

  -- Order 40 (1 item): Le Rond Bag
  ('00000040-faaa-4000-8000-000000000040', NULL, 'Le Rond Leather Bag',      'O/S', 'Soil',       'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=200&auto=format&fit=crop', 1, 420.00, '2026-05-22 09:00:00+00');