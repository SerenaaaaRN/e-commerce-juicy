CREATE TYPE order_status AS ENUM (
  'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'
);

CREATE TYPE payment_status AS ENUM (
  'unpaid', 'paid', 'refunded'
);
