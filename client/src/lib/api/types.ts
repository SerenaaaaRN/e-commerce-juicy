export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type ApiErrorDetail = {
  message: string;
  code: string;
};

export type ApiErrorResponse = {
  success: false;
  error: ApiErrorDetail;
};

export type PaginationMeta = {
  total: number;
  page: number;
  per_page: number;
};

export type PaginatedResponse<T> = ApiResponse<T[]> & {
  meta: PaginationMeta;
};

export type CustomerLoginResponse = {
  token: string;
  customer: {
    id: string;
    full_name: string;
    email: string;
  };
};

export type CustomerProfile = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  created_at: string;
};

export type AdminLoginResponse = {
  token: string;
  admin: {
    id: string;
    username: string;
    email: string;
  };
};

export type ProductSummary = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price: number | null;
  is_featured: boolean;
  tags: string[];
  primary_image: string;
  category_name: string;
  avg_rating: number;
  review_count: number;
};

export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
};

export type ProductImage = {
  id: string;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
  display_order: number;
};

export type ProductVariant = {
  id: string;
  size: string;
  color: string;
  color_hex: string | null;
  sku: string;
  stock: number;
  additional_price: number;
  is_active: boolean;
};

export type ProductDetail = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  tags: string[];
  category: ProductCategory;
  images: ProductImage[];
  variants: ProductVariant[];
  avg_rating: number;
  review_count: number;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CartItem = {
  id: string;
  variant_id: string;
  product_name: string;
  variant_size: string;
  variant_color: string;
  image_url: string | null;
  unit_price: number;
  quantity: number;
  subtotal: number;
};

export type CartResponse = {
  items: CartItem[];
  total: number;
};

export type Address = {
  id: string;
  customer_id: string;
  label: string | null;
  recipient_name: string;
  phone: string;
  address_line: string;
  city: string;
  province: string;
  postal_code: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

export type OrderSummary = {
  id: string;
  order_number: string;
  status: string;
  total: number;
  item_count: number;
  created_at: string;
};

export type OrderAddress = {
  recipient_name: string;
  phone: string;
  address_line: string;
  city: string;
  province: string;
  postal_code: string;
};

export type OrderItem = {
  product_name: string;
  variant_size: string;
  variant_color: string;
  image_url: string | null;
  quantity: number;
  unit_price: number;
};

export type OrderDetail = {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  subtotal: number;
  shipping_fee: number;
  total: number;
  shipped_at: string | null;
  delivered_at: string | null;
  address: OrderAddress;
  items: OrderItem[];
  created_at: string;
};

export type Review = {
  id: string;
  rating: number;
  body: string | null;
  customer_name: string;
  created_at: string;
};

export type AdminOrderSummary = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  status: string;
  payment_status: string;
  total: number;
  item_count: number;
  created_at: string;
};

export type AdminReview = {
  id: string;
  product_id: string;
  product_name: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  rating: number;
  body: string | null;
  is_published: boolean;
  created_at: string;
};

export type AnalyticsOverview = {
  orders: {
    total: number;
    pending: number;
    processing: number;
    this_month: number;
  };
  revenue: {
    total: number;
    this_month: number;
  };
  customers: {
    total: number;
    new_this_month: number;
  };
  products: {
    total: number;
    out_of_stock: number;
  };
};

export type ChartDataPoint = {
  month: string;
  order_count: number;
  revenue: number;
};
