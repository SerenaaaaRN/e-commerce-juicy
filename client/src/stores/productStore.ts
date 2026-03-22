import { create } from "zustand";
import { productsApi, withFallback } from "@/lib/api";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mockData";
import type { Product, Category } from "@/features/shop/shop.types";
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
  products: MOCK_PRODUCTS,
  categories: MOCK_CATEGORIES,
  loading: false,

  fetchProducts: async (params) => {
    set({ loading: true });
    try {
      const data = await withFallback(
        () => productsApi.listProducts(params),
        () => {
          let filtered = [...MOCK_PRODUCTS];
          if (params?.category) {
            filtered = filtered.filter((p) => p.category?.slug === params.category);
          }
          if (params?.featured === "true") {
            filtered = filtered.filter((p) => p.is_featured);
          }
          if (params?.tag) {
            filtered = filtered.filter((p) => p.tags?.includes(params.tag!));
          }
          if (params?.sort === "price_asc") {
            filtered.sort((a, b) => a.price - b.price);
          } else if (params?.sort === "price_desc") {
            filtered.sort((a, b) => b.price - a.price);
          } else if (params?.sort === "popular") {
            filtered.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0));
          }
          return filtered;
        },
      );
      set({ products: data.map(mapProductSummary), loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const data = await withFallback(
        () => productsApi.listCategories(),
        () => MOCK_CATEGORIES,
      );
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
      // keep existing
    }
  },
}));
