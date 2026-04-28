import { client } from "./client"
import type {
  ApiResponse,
  PaginatedResponse,
  Category,
  ProductDetail,
  ProductVariant,
  AdminOrder,
  OrderDetail,
  AdminReview,
} from "@/types"
import type { ClientStatistics } from "@/features/admin/types"

// Analytics response shapes
export type AnalyticsOverview = {
  orders: { total: number; pending: number; processing: number; this_month: number }
  revenue: { total: number; this_month: number }
  customers: { total: number; new_this_month: number }
  products: { total: number; out_of_stock: number }
}

export type AnalyticsChartItem = {
  month: string
  order_count: number
  revenue: number
}

// Params for queries
export type ProductQueryParams = {
  page?: number
  per_page?: number
  category?: string
  available?: boolean
  admin?: boolean
}

export type OrderQueryParams = {
  page?: number
  per_page?: number
  status?: string
  payment_status?: string
  search?: string
}

export type CustomerQueryParams = {
  page?: number
  per_page?: number
  search?: string
}

export type ReviewQueryParams = {
  page?: number
  per_page?: number
  product_id?: string
  published?: boolean
}

export const adminApi = {
  // --- AUTH ---
  login: async (payload: Record<string, string>): Promise<ApiResponse<{ token: string; admin: { id: string; username: string; email: string } }>> => {
    const response = await client.post<ApiResponse<{ token: string; admin: { id: string; username: string; email: string } }>>("/admin/login", payload)
    return response.data
  },

  refresh: async (): Promise<ApiResponse<{ token: string; admin: { id: string; username: string; email: string } }>> => {
    const response = await client.post<ApiResponse<{ token: string; admin: { id: string; username: string; email: string } }>>("/admin/refresh")
    return response.data
  },

  logout: async (): Promise<ApiResponse<null>> => {
    const response = await client.post<ApiResponse<null>>("/admin/logout")
    return response.data
  },

  // --- ANALYTICS ---
  getAnalyticsOverview: async (): Promise<ApiResponse<AnalyticsOverview>> => {
    const response = await client.get<ApiResponse<AnalyticsOverview>>("/admin/analytics/overview")
    return response.data
  },

  getAnalyticsOrdersChart: async (): Promise<ApiResponse<AnalyticsChartItem[]>> => {
    const response = await client.get<ApiResponse<AnalyticsChartItem[]>>("/admin/analytics/orders/chart")
    return response.data
  },

  // --- CATEGORIES ---
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    const response = await client.get<ApiResponse<Category[]>>("/admin/categories")
    return response.data
  },

  createCategory: async (payload: Omit<Category, "id">): Promise<ApiResponse<Category>> => {
    const response = await client.post<ApiResponse<Category>>("/admin/categories", payload)
    return response.data
  },

  updateCategory: async (id: string, payload: Partial<Category>): Promise<ApiResponse<Category>> => {
    const response = await client.put<ApiResponse<Category>>(`/admin/categories/${id}`, payload)
    return response.data
  },

  deleteCategory: async (id: string): Promise<ApiResponse<null>> => {
    const response = await client.delete<ApiResponse<null>>(`/admin/categories/${id}`)
    return response.data
  },

  // --- PRODUCTS ---
  getProducts: async (params?: ProductQueryParams): Promise<PaginatedResponse<ProductDetail>> => {
    const response = await client.get<PaginatedResponse<ProductDetail>>("/admin/products", { params })
    return response.data
  },

  createProduct: async (payload: Record<string, unknown>): Promise<ApiResponse<ProductDetail>> => {
    const response = await client.post<ApiResponse<ProductDetail>>("/admin/products", payload)
    return response.data
  },

  updateProduct: async (id: string, payload: Record<string, unknown>): Promise<ApiResponse<ProductDetail>> => {
    const response = await client.put<ApiResponse<ProductDetail>>(`/admin/products/${id}`, payload)
    return response.data
  },

  deleteProduct: async (id: string): Promise<ApiResponse<null>> => {
    const response = await client.delete<ApiResponse<null>>(`/admin/products/${id}`)
    return response.data
  },

  // --- PRODUCT IMAGES ---
  uploadProductImages: async (id: string, formData: FormData): Promise<ApiResponse<ProductDetail>> => {
    const response = await client.post<ApiResponse<ProductDetail>>(`/admin/products/${id}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data
  },

  deleteProductImage: async (id: string, imageId: string): Promise<ApiResponse<null>> => {
    const response = await client.delete<ApiResponse<null>>(`/admin/products/${id}/images/${imageId}`)
    return response.data
  },

  setPrimaryImage: async (id: string, imageId: string): Promise<ApiResponse<null>> => {
    const response = await client.patch<ApiResponse<null>>(`/admin/products/${id}/images/${imageId}/primary`)
    return response.data
  },

  // --- PRODUCT VARIANTS ---
  getVariants: async (id: string): Promise<ApiResponse<ProductVariant[]>> => {
    const response = await client.get<ApiResponse<ProductVariant[]>>(`/admin/products/${id}/variants`)
    return response.data
  },

  addVariant: async (id: string, payload: Omit<ProductVariant, "id" | "product_id" | "created_at" | "updated_at">): Promise<ApiResponse<ProductVariant>> => {
    const response = await client.post<ApiResponse<ProductVariant>>(`/admin/products/${id}/variants`, payload)
    return response.data
  },

  updateVariant: async (id: string, variantId: string, payload: Partial<ProductVariant>): Promise<ApiResponse<ProductVariant>> => {
    const response = await client.put<ApiResponse<ProductVariant>>(`/admin/products/${id}/variants/${variantId}`, payload)
    return response.data
  },

  deleteVariant: async (id: string, variantId: string): Promise<ApiResponse<null>> => {
    const response = await client.delete<ApiResponse<null>>(`/admin/products/${id}/variants/${variantId}`)
    return response.data
  },

  // --- ORDERS ---
  getOrders: async (params?: OrderQueryParams): Promise<PaginatedResponse<AdminOrder>> => {
    const response = await client.get<PaginatedResponse<AdminOrder>>("/admin/orders", { params })
    return response.data
  },

  getOrderDetail: async (id: string): Promise<ApiResponse<OrderDetail>> => {
    const response = await client.get<ApiResponse<OrderDetail>>(`/admin/orders/${id}`)
    return response.data
  },

  updateOrderStatus: async (id: string, status: string): Promise<ApiResponse<null>> => {
    const response = await client.patch<ApiResponse<null>>(`/admin/orders/${id}/status`, { status })
    return response.data
  },

  updateOrderPaymentStatus: async (id: string, paymentStatus: string): Promise<ApiResponse<null>> => {
    const response = await client.patch<ApiResponse<null>>(`/admin/orders/${id}/payment`, { payment_status: paymentStatus })
    return response.data
  },

  // --- CUSTOMERS ---
  getCustomers: async (params?: CustomerQueryParams): Promise<PaginatedResponse<ClientStatistics>> => {
    const response = await client.get<PaginatedResponse<ClientStatistics>>("/admin/customers", { params })
    return response.data
  },

  getCustomerDetail: async (id: string): Promise<ApiResponse<ClientStatistics & { order_history?: AdminOrder[] }>> => {
    const response = await client.get<ApiResponse<ClientStatistics & { order_history?: AdminOrder[] }>>(`/admin/customers/${id}`)
    return response.data
  },

  toggleCustomerStatus: async (id: string, isActive: boolean): Promise<ApiResponse<null>> => {
    const response = await client.patch<ApiResponse<null>>(`/admin/customers/${id}/status`, { is_active: isActive })
    return response.data
  },

  // --- REVIEWS ---
  getReviews: async (params?: ReviewQueryParams): Promise<PaginatedResponse<AdminReview>> => {
    const response = await client.get<PaginatedResponse<AdminReview>>("/admin/reviews", { params })
    return response.data
  },

  toggleReviewPublish: async (id: string, isPublished: boolean): Promise<ApiResponse<null>> => {
    const response = await client.patch<ApiResponse<null>>(`/admin/reviews/${id}/publish`, { is_published: isPublished })
    return response.data
  },

  deleteReview: async (id: string): Promise<ApiResponse<null>> => {
    const response = await client.delete<ApiResponse<null>>(`/admin/reviews/${id}`)
    return response.data
  },
}

export default adminApi
