export type ApiError = {
  message: string
  code: string
  details?: string
}

export type ApiResponse<T> = {
  success: boolean
  data: T
  message?: string
  error?: ApiError
}

export type PaginatedResponse<T> = {
  success: boolean
  data: T[]
  error?: ApiError
  meta: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
}

export type Category = {
  id: string
  name: string
  slug: string
  description?: string
  display_order: number
  is_active?: boolean
  parent_id?: string | null
  product_count?: number
  children?: Category[]
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
  stock: number
  additional_price: number
  is_active: boolean
}

export type CatalogProduct = {
  id: string
  category_id: string
  name: string
  slug: string
  description?: string | null
  price: number
  compare_at_price?: number
  is_available: boolean
  is_featured: boolean
  tags: string[]
  display_order: number
  primary_image: string
  category_name: string
  images?: ProductImage[]
  category?: {
    id: string
    name: string
    slug: string
  }
  avg_rating: number
  review_count: number
  variants?: ProductVariant[]
}

export type ProductDetail = {
  id: string
  category_id: string
  name: string
  slug: string
  description?: string
  price: number
  compare_at_price?: number
  is_available: boolean
  is_featured: boolean
  tags: string[]
  display_order: number
  primary_image: string
  category: {
    id: string
    name: string
    slug: string
  }
  category_name: string
  images: ProductImage[]
  variants: ProductVariant[]
  avg_rating: number
  review_count: number
}

export type Customer = {
  id: string
  full_name: string
  email: string
  phone?: string | null
  is_active?: boolean
  order_count?: number
  total_spent?: number
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
  image_url: string | null
  unit_price: number
  quantity: number
  subtotal: number
}

export type Cart = {
  items: CartItem[]
  total: number
}

export type OrdersListResponse = {
  items: Order[]
  meta: {
    total: number
    page: number
    per_page: number
  }
}

export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "returned"
export type PaymentStatus = "unpaid" | "paid" | "refunded"

export type Order = {
  id: string
  order_number: string
  status: OrderStatus
  payment_status: PaymentStatus
  total: number
  item_count?: number
  notes?: string
  created_at: string
}

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
  notes?: string | null
  shipped_at?: string | null
  delivered_at?: string | null
  created_at: string
  address: OrderAddressInfo
  items: OrderItem[]
}

export type Review = {
  id: string
  product_id?: string
  customer_id?: string
  order_id?: string
  rating: number
  body: string | null
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
