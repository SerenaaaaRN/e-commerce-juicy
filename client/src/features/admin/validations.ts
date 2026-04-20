import { z } from "zod"

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Product slug is required"),
  description: z.string().optional(),
  category_id: z.string().min(1, "Category assignment is required"),
  price: z.coerce.number().positive("Valid base price is required"),
  compare_at_price: z.coerce.number().optional(),
  is_available: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  tags: z.string().optional(),
  display_order: z.coerce.number().default(10),
})

export const variantSchema = z.object({
  size: z.string().min(1, "Size identifier is required (e.g. 250ml)"),
  color: z.string().optional(),
  color_hex: z.string().optional(),
  sku: z.string().min(1, "Unique SKU is required"),
  stock: z.coerce.number().min(0, "Valid non-negative stock quantity is required"),
  additional_price: z.coerce.number().default(0),
})

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Category slug is required"),
  description: z.string().optional(),
  display_order: z.coerce.number().default(1),
})
