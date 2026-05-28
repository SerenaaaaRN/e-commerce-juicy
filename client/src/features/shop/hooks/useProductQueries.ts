import { useQuery, useInfiniteQuery } from "@tanstack/react-query"
import { productApi, type ProductFiltersParams } from "@/lib/api/products"
import type { Category, CatalogProduct, ProductDetail, Review } from "@/types"

export const useCategoriesQuery = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await productApi.getCategories()
      return res.data as Category[]
    },
  })

export const useProductsQuery = (params?: ProductFiltersParams, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const res = await productApi.getProducts(params)
      return { products: res.data as CatalogProduct[], meta: res.meta }
    },
    enabled: options?.enabled ?? true,
  })

export const useFeaturedProductsQuery = () =>
  useQuery({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      const res = await productApi.getProducts({ featured: true, per_page: 8 })
      return res.data as CatalogProduct[]
    },
  })

export const useProductQuery = (slug: string) =>
  useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const res = await productApi.getProductBySlug(slug)
      return res.data as ProductDetail
    },
    enabled: !!slug,
  })

export const useProductReviewsQuery = (slug: string, page: number = 1) =>
  useQuery({
    queryKey: ["reviews", slug, { page }],
    queryFn: async () => {
      const res = await productApi.getProductReviews(slug, { page, per_page: 5 })
      return { reviews: res.data as Review[], meta: res.meta }
    },
    enabled: !!slug,
  })

export const useInfiniteProductsQuery = (params?: Omit<ProductFiltersParams, "page">) =>
  useInfiniteQuery({
    queryKey: ["products", "infinite", params],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await productApi.getProducts({ ...params, page: pageParam })
      return { products: res.data as CatalogProduct[], meta: res.meta }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.meta || lastPage.meta.page >= lastPage.meta.total_pages) return undefined
      return lastPage.meta.page + 1
    },
  })
