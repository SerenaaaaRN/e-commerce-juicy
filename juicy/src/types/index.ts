// API response envelopes
export type ApiResponse<T> = {
  success: boolean
  data: T
  message?: string
  error?: string
  code?: string
}

export type PaginatedResponse<T> = {
  success: boolean
  data: T[]
  meta: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
}

// Domain types
export type Category = {
  id: string
  name: string
  slug: string
  description?: string
  display_order: number
  is_active?: boolean
}

export type ProductImage = {
  id: string
  image_url: string
  alt_text?: string
  is_primary: boolean
  display_order: number
}

export type ProductVariant = {
  id: string
  size: string
  color: string
  color_hex?: string
  sku: string
  stock: number
  additional_price: number
  is_active: boolean
}

// Product representation used in list responses
export type CatalogProduct = {
  id: string
  name: string
  slug: string
  price: number
  compare_at_price?: number
  is_featured: boolean
  tags: string[]
  primary_image: string
  category_name: string
  avg_rating: number
  review_count: number
}

// Product representation used in detail response (PDP + Admin)
export type ProductDetail = {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  compare_at_price?: number
  is_available: boolean
  is_featured: boolean
  tags: string[]
  display_order: number
  category_id: string
  created_at: string
  updated_at: string
  category?: Category
  images?: ProductImage[]
  variants?: ProductVariant[]
  avg_rating: number
  review_count: number
}

export type Customer = {
  id: string
  full_name: string
  email: string
  phone?: string
  created_at?: string
}

export type Address = {
  id: string
  customer_id?: string
  label: string
  recipient_name: string
  phone: string
  address_line: string
  city: string
  province: string
  postal_code: string
  is_default: boolean
  created_at?: string
  updated_at?: string
}

export type CartItem = {
  id: string
  variant_id: string
  product_name: string
  variant_size: string
  variant_color: string
  image_url: string
  unit_price: number
  quantity: number
  subtotal: number
}

export type Cart = {
  items: CartItem[]
  total: number
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered'
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded'

export type Order = {
  id: string
  order_number: string
  status: OrderStatus
  payment_status: PaymentStatus
  total: number
  item_count?: number
  created_at: string
}

// Order address info shape matching Go's OrderAddressInfo DTO
export type OrderAddressInfo = {
  recipient_name: string
  phone: string
  address_line: string
  city: string
  province: string
  postal_code: string
}

export type OrderItem = {
  product_id?: string
  product_name: string
  variant_size: string
  variant_color: string
  image_url?: string
  quantity: number
  unit_price: number
  subtotal: number
}

export type OrderDetail = {
  id: string
  order_number: string
  status: OrderStatus
  payment_status: PaymentStatus
  subtotal: number
  shipping_fee: number
  total: number
  notes?: string
  shipped_at?: string
  created_at: string
  updated_at?: string
  address: OrderAddressInfo
  items: OrderItem[]
}

export type Review = {
  id: string
  product_id?: string
  customer_id?: string
  order_id?: string
  rating: number
  body: string
  customer_name: string
  is_published?: boolean
  created_at: string
}

// --- Admin-specific response types (Option A) ---
// These match Go's admin DTO shapes which return richer data

export type AdminOrder = {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  status: OrderStatus
  payment_status: PaymentStatus
  total: number
  item_count: number
  created_at: string
}

export type AdminReview = {
  id: string
  product_id: string
  product_name: string
  customer_id: string
  customer_name: string
  customer_email: string
  rating: number
  body?: string
  is_published: boolean
  created_at: string
}
