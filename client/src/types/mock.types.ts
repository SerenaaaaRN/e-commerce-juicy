export interface MockCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  parent_id: string | null;
  children: MockCategory[];
}

export interface MockProductImage {
  id: string;
  product_id: string;
  image_url: string;
  cloudinary_public_id: string | null;
  alt_text: string | null;
  display_order: number | null;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface MockProductVariant {
  id: string;
  product_id: string;
  size: string;
  color: string;
  stock: number;
  additional_price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MockProduct {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  is_available: boolean;
  is_featured: boolean;
  tags: string | null;
  display_order: number | null;
  created_at: string;
  updated_at: string;
  category: MockCategory | null;
  images: MockProductImage[];
  variants: MockProductVariant[];
}
