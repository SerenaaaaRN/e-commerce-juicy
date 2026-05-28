import type { Customer } from "@/types"

// --- Product form values (used by react-hook-form) ---
export type ProductFormValues = {
  name: string
  slug: string
  description?: string
  category_id: string
  price: number
  compare_at_price?: number
  is_available: boolean
  is_featured: boolean
  tags?: string
  display_order: number
}

// --- Variant form values ---
export type VariantFormValues = {
  size: string
  color?: string
  stock: number
  additional_price: number
}

// --- Category form values ---
export type CategoryFormValues = {
  name: string
  slug: string
  description?: string
  parent_id?: string
  display_order: number
}

// --- Login form values ---
export type LoginFormValues = {
  email: string
  password: string
}

// --- Customer with admin-specific stats ---
export type ClientStatistics = Customer & {
  order_count: number
  total_spent: number
  is_active?: boolean
  created_at: string
}
