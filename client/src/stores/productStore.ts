import { create } from "zustand"
import { productApi, type ProductFiltersParams } from "@/lib/api/products"
import type { Category, CatalogProduct, ProductDetail } from "@/types"

type ProductState = {
  products: CatalogProduct[]
  featuredProducts: CatalogProduct[]
  categories: Category[]
  currentProduct: ProductDetail | null
  isLoading: boolean
  error: string | null
  meta: {
    page: number
    per_page: number
    total: number
    total_pages: number
  } | null

  fetchCategories: () => Promise<void>
  fetchProducts: (params?: ProductFiltersParams, append?: boolean) => Promise<void>
  fetchFeaturedProducts: () => Promise<void>
  fetchProductBySlug: (slug: string) => Promise<void>
  clearCurrentProduct: () => void
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  featuredProducts: [],
  categories: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  meta: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await productApi.getCategories()
      if (res.success) {
        set({ categories: res.data, isLoading: false })
      } else {
        set({ error: res.message || "Failed to load categories", isLoading: false })
      }
    } catch {
      set({ error: "Failed to load categories", isLoading: false })
    }
  },

  fetchProducts: async (params, append = false) => {
    set({ isLoading: true, error: null })
    try {
      const res = await productApi.getProducts(params)
      if (res.success) {
        set((state) => ({
          products: append ? [...state.products, ...res.data] : res.data,
          meta: res.meta,
          isLoading: false,
        }))
      } else {
        set({ error: "Failed to load products", isLoading: false })
      }
    } catch {
      set({ error: "Failed to load products", isLoading: false })
    }
  },

  fetchFeaturedProducts: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await productApi.getProducts({ featured: true, per_page: 8 })
      if (res.success) {
        set({ featuredProducts: res.data, isLoading: false })
      } else {
        set({ error: "Failed to load featured products", isLoading: false })
      }
    } catch {
      set({ error: "Failed to load featured products", isLoading: false })
    }
  },

  fetchProductBySlug: async (slug) => {
    set({ isLoading: true, currentProduct: null, error: null })
    try {
      const res = await productApi.getProductBySlug(slug)
      if (res.success) {
        set({ currentProduct: res.data, isLoading: false })
      } else {
        set({ error: res.message || "Failed to load product details", isLoading: false })
      }
    } catch {
      set({ error: "Failed to load product details", isLoading: false })
    }
  },

  clearCurrentProduct: () => {
    set({ currentProduct: null })
  },
}))

export default useProductStore
