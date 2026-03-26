export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  display_order: number;
  is_active: boolean;
};

export type ProductImage = {
  id: string;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  display_order: number;
};

export type ProductVariant = {
  id: string;
  size: "XS" | "S" | "M" | "L";
  color: string;
  color_hex: string;
  sku: string;
  stock: number;
  additional_price: number;
  is_active: boolean;
};

export type Review = {
  id: string;
  rating: number;
  body: string;
  customer_name: string;
  created_at: string;
  product_id?: string;
  order_id?: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  is_featured: boolean;
  is_available: boolean;
  tags: string[];
  primary_image: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  category_name?: string; // helper
  images: ProductImage[];
  variants: ProductVariant[];
  reviews: Review[];
  avg_rating: number;
  review_count: number;
  display_order: number;
  created_at: string;
};
