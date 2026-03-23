import { apiClient } from "./client";
import type {
  ApiResponse,
  PaginatedResponse,
  AdminLoginResponse,
  CustomerProfile,
  ProductSummary,
  ProductDetail,
  ProductVariant,
  Category,
  AdminOrderSummary,
  OrderDetail,
  AdminReview,
  AnalyticsOverview,
  ChartDataPoint,
} from "./types";

export async function adminLogin(email: string, password: string): Promise<AdminLoginResponse> {
  const res = await apiClient.post<ApiResponse<AdminLoginResponse>>("/admin/login", { email, password });
  return res.data.data;
}

export async function adminRefresh(): Promise<AdminLoginResponse> {
  const res = await apiClient.post<ApiResponse<AdminLoginResponse>>("/admin/refresh");
  return res.data.data;
}

export async function adminLogout(): Promise<void> {
  await apiClient.post("/admin/logout");
}

export async function getAdminProfile(): Promise<{ id: string; username: string; email: string }> {
  const res = await apiClient.get<ApiResponse<{ id: string; username: string; email: string }>>("/admin/profile");
  return res.data.data;
}

export async function listAdminCustomers(params?: {
  page?: number;
  per_page?: number;
  search?: string;
}): Promise<{ customers: CustomerProfile[]; meta: { total: number; page: number; per_page: number } }> {
  const res = await apiClient.get("/admin/customers", { params });
  return { customers: res.data.data, meta: res.data.meta };
}

export async function getAdminCustomer(id: string): Promise<CustomerProfile> {
  const res = await apiClient.get<ApiResponse<CustomerProfile>>(`/admin/customers/${id}`);
  return res.data.data;
}

export async function updateCustomerStatus(id: string, isActive: boolean): Promise<void> {
  await apiClient.put(`/admin/customers/${id}/status`, { is_active: isActive });
}

export async function listAdminCategories(): Promise<Category[]> {
  const res = await apiClient.get<ApiResponse<Category[]>>("/admin/categories");
  return res.data.data;
}

export async function getAdminCategory(id: string): Promise<Category> {
  const res = await apiClient.get<ApiResponse<Category>>(`/admin/categories/${id}`);
  return res.data.data;
}

export async function createAdminCategory(data: {
  name: string;
  slug: string;
  description?: string | null;
  display_order?: number;
  is_active?: boolean;
}): Promise<Category> {
  const res = await apiClient.post<ApiResponse<Category>>("/admin/categories", data);
  return res.data.data;
}

export async function updateAdminCategory(
  id: string,
  data: {
    name?: string;
    slug?: string;
    description?: string | null;
    display_order?: number;
    is_active?: boolean;
  },
): Promise<Category> {
  const res = await apiClient.put<ApiResponse<Category>>(`/admin/categories/${id}`, data);
  return res.data.data;
}

export async function deleteAdminCategory(id: string): Promise<void> {
  await apiClient.delete(`/admin/categories/${id}`);
}

export async function listAdminProducts(params?: {
  page?: number;
  per_page?: number;
  category?: string;
}): Promise<ProductSummary[]> {
  const res = await apiClient.get<PaginatedResponse<ProductSummary>>("/admin/products", { params });
  return res.data.data;
}

export async function getAdminProduct(id: string): Promise<ProductDetail> {
  const res = await apiClient.get<ApiResponse<ProductDetail>>(`/admin/products/${id}`);
  return res.data.data;
}

export async function createAdminProduct(data: {
  category_id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  compare_at_price?: number | null;
  is_available?: boolean;
  is_featured?: boolean;
  tags?: string[];
  display_order?: number;
}): Promise<{ id: string }> {
  const res = await apiClient.post<ApiResponse<{ id: string }>>("/admin/products", data);
  return res.data.data;
}

export async function updateAdminProduct(
  id: string,
  data: {
    category_id?: string;
    name?: string;
    slug?: string;
    description?: string | null;
    price?: number;
    compare_at_price?: number | null;
    is_available?: boolean;
    is_featured?: boolean;
    tags?: string[];
    display_order?: number;
  },
): Promise<void> {
  await apiClient.put(`/admin/products/${id}`, data);
}

export async function deleteAdminProduct(id: string): Promise<void> {
  await apiClient.delete(`/admin/products/${id}`);
}

export async function getProductVariants(productId: string): Promise<ProductVariant[]> {
  const res = await apiClient.get<ApiResponse<ProductVariant[]>>(`/admin/products/${productId}/variants`);
  return res.data.data;
}

export async function addProductVariant(
  productId: string,
  data: {
    size: string;
    color: string;
    color_hex?: string | null;
    sku: string;
    stock?: number;
    additional_price?: number;
    is_active?: boolean;
  },
): Promise<ProductVariant> {
  const res = await apiClient.post<ApiResponse<ProductVariant>>(`/admin/products/${productId}/variants`, data);
  return res.data.data;
}

export async function updateProductVariant(
  productId: string,
  variantId: string,
  data: {
    size?: string;
    color?: string;
    color_hex?: string | null;
    sku?: string;
    stock?: number;
    additional_price?: number;
    is_active?: boolean;
  },
): Promise<ProductVariant> {
  const res = await apiClient.put<ApiResponse<ProductVariant>>(
    `/admin/products/${productId}/variants/${variantId}`,
    data,
  );
  return res.data.data;
}

export async function deleteProductVariant(productId: string, variantId: string): Promise<void> {
  await apiClient.delete(`/admin/products/${productId}/variants/${variantId}`);
}

export async function listAdminOrders(params?: {
  status?: string;
  payment_status?: string;
  search?: string;
  page?: number;
  per_page?: number;
}): Promise<{ orders: AdminOrderSummary[]; meta: { total: number; page: number; per_page: number } }> {
  const res = await apiClient.get("/admin/orders", { params });
  return { orders: res.data.data, meta: res.data.meta };
}

export async function getAdminOrder(id: string): Promise<OrderDetail> {
  const res = await apiClient.get<ApiResponse<OrderDetail>>(`/admin/orders/${id}`);
  return res.data.data;
}

export async function updateOrderStatus(id: string, status: string): Promise<void> {
  await apiClient.put(`/admin/orders/${id}/status`, { status });
}

export async function updateOrderPayment(id: string, paymentStatus: string): Promise<void> {
  await apiClient.put(`/admin/orders/${id}/payment`, { payment_status: paymentStatus });
}

export async function listAdminReviews(params?: {
  product_id?: string;
  published?: string;
  page?: number;
  per_page?: number;
}): Promise<{ reviews: AdminReview[]; meta: { total: number; page: number; per_page: number } }> {
  const res = await apiClient.get("/admin/reviews", { params });
  return { reviews: res.data.data, meta: res.data.meta };
}

export async function updateReviewPublishStatus(id: string, isPublished: boolean): Promise<void> {
  await apiClient.put(`/admin/reviews/${id}/publish`, { is_published: isPublished });
}

export async function deleteAdminReview(id: string): Promise<void> {
  await apiClient.delete(`/admin/reviews/${id}`);
}

export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  const res = await apiClient.get<ApiResponse<AnalyticsOverview>>("/admin/analytics/overview");
  return res.data.data;
}

export async function getAnalyticsChart(): Promise<ChartDataPoint[]> {
  const res = await apiClient.get<ApiResponse<ChartDataPoint[]>>("/admin/analytics/chart");
  return res.data.data;
}
