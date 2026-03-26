import { create } from "zustand";
import { productsApi } from "@/lib/api";
import type { Product, Category } from "@/types/shop.types";
import type { ProductSummary } from "@/lib/api/types";

const mapProductSummary = (p: ProductSummary): Product => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  description: "",
  price: p.price,
  compare_at_price: p.compare_at_price,
  is_featured: p.is_featured,
  is_available: true,
  tags: p.tags || [],
  primary_image: p.primary_image || "",
  category: { id: "", name: p.category_name, slug: "" },
  category_name: p.category_name,
  images: [],
  variants: [],
  reviews: [],
  avg_rating: p.avg_rating || 0,
  review_count: p.review_count || 0,
  display_order: 0,
  created_at: "",
});

type ProductStoreState = {
  products: Product[];
  categories: Category[];
  loading: boolean;
  fetchProducts: (params?: { category?: string; featured?: string; tag?: string; sort?: string }) => Promise<void>;
  fetchCategories: () => Promise<void>;
};

export const useProductStore = create<ProductStoreState>((set) => ({
  products: [],
  categories: [],
  loading: false,

  fetchProducts: async (params) => {
    set({ loading: true });
    try {
      const data = await productsApi.listProducts(params);
      set({ products: data.map(mapProductSummary), loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const data = await productsApi.listCategories();
      set({
        categories: data.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description || undefined,
          display_order: c.display_order,
          is_active: c.is_active,
        })),
      });
    } catch {
      // silent
    }
  },
}));
