import { customerClient } from "./customerClient";
import type {
  ApiResponse,
  CustomerLoginResponse,
  CustomerProfile,
  Address,
  CartResponse,
  OrderSummary,
  OrderDetail,
  Review,
} from "./types";

export async function customerLogin(email: string, password: string): Promise<CustomerLoginResponse> {
  const res = await customerClient.post<ApiResponse<CustomerLoginResponse>>("/customers/login", {
    email,
    password,
  });
  return res.data.data;
}

export async function customerRegister(data: {
  full_name: string;
  email: string;
  password: string;
  phone?: string | null;
}): Promise<CustomerLoginResponse> {
  const res = await customerClient.post<ApiResponse<CustomerLoginResponse>>("/customers/register", data);
  return res.data.data;
}

export async function getCustomerProfile(): Promise<CustomerProfile> {
  const res = await customerClient.get<ApiResponse<CustomerProfile>>("/customers/profile");
  return res.data.data;
}

export async function updateCustomerProfile(data: {
  full_name: string;
  phone?: string | null;
}): Promise<CustomerProfile> {
  const res = await customerClient.put<ApiResponse<CustomerProfile>>("/customers/profile", data);
  return res.data.data;
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await customerClient.put("/customers/profile/password", {
    current_password: currentPassword,
    new_password: newPassword,
  });
}

export async function listAddresses(): Promise<Address[]> {
  const res = await customerClient.get<ApiResponse<Address[]>>("/addresses");
  return res.data.data;
}

export async function getAddress(id: string): Promise<Address> {
  const res = await customerClient.get<ApiResponse<Address>>(`/addresses/${id}`);
  return res.data.data;
}

export async function createAddress(data: {
  label?: string | null;
  recipient_name: string;
  phone: string;
  address_line: string;
  city: string;
  province: string;
  postal_code: string;
  is_default?: boolean;
}): Promise<Address> {
  const res = await customerClient.post<ApiResponse<Address>>("/addresses", data);
  return res.data.data;
}

export async function updateAddress(
  id: string,
  data: {
    label?: string | null;
    recipient_name: string;
    phone: string;
    address_line: string;
    city: string;
    province: string;
    postal_code: string;
    is_default?: boolean;
  },
): Promise<Address> {
  const res = await customerClient.put<ApiResponse<Address>>(`/addresses/${id}`, data);
  return res.data.data;
}

export async function deleteAddress(id: string): Promise<void> {
  await customerClient.delete(`/addresses/${id}`);
}

export async function setDefaultAddress(id: string): Promise<void> {
  await customerClient.put(`/addresses/${id}/default`);
}

export async function getCart(): Promise<CartResponse> {
  const res = await customerClient.get<ApiResponse<CartResponse>>("/cart");
  return res.data.data;
}

export async function addCartItem(variantId: string, quantity: number): Promise<void> {
  await customerClient.post("/cart/items", { variant_id: variantId, quantity });
}

export async function updateCartItem(itemId: string, quantity: number): Promise<void> {
  await customerClient.put(`/cart/items/${itemId}`, { quantity });
}

export async function removeCartItem(itemId: string): Promise<void> {
  await customerClient.delete(`/cart/items/${itemId}`);
}

export async function clearCart(): Promise<void> {
  await customerClient.delete("/cart");
}

export async function checkout(data: {
  address_id: string;
  notes?: string | null;
  payment_method: string;
}): Promise<{ id: string; order_number: string; status: string; total: number }> {
  const res = await customerClient.post<
    ApiResponse<{ id: string; order_number: string; status: string; total: number }>
  >("/orders/checkout", data);
  return res.data.data;
}

export async function listOrders(params?: {
  page?: number;
  per_page?: number;
}): Promise<{ orders: OrderSummary[]; meta: { total: number; page: number; per_page: number } }> {
  const res = await customerClient.get("/orders", { params });
  return { orders: res.data.data, meta: res.data.meta };
}

export async function getOrderDetail(orderNumber: string): Promise<OrderDetail> {
  const res = await customerClient.get<ApiResponse<OrderDetail>>(`/orders/${orderNumber}`);
  return res.data.data;
}

export async function submitReview(data: {
  product_id: string;
  order_id: string;
  rating: number;
  body?: string | null;
}): Promise<Review> {
  const res = await customerClient.post<ApiResponse<Review>>("/reviews", data);
  return res.data.data;
}
