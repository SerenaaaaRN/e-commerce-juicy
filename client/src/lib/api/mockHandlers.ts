import { mockCategories, mockProducts } from "@/data/mockData"
import type { CatalogProduct, Category, ProductDetail, ProductImage, ProductVariant } from "@/types"
import type { MockCategory, MockProduct, MockProductImage, MockProductVariant } from "@/types/mock.types"
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios"

// Data Mappers
const transformCategory = (mc: MockCategory): Category => {
  return {
    id: mc.id,
    name: mc.name,
    slug: mc.slug,
    description: mc.description || undefined,
    display_order: mc.display_order || 0,
    is_active: mc.is_active,
    parent_id: mc.parent_id,
    product_count: 0,
    children: mc.children ? mc.children.map(transformCategory) : undefined,
  }
}

const transformProductImage = (mpi: MockProductImage): ProductImage => {
  return {
    id: mpi.id,
    image_url: mpi.image_url,
    alt_text: mpi.alt_text || undefined,
    display_order: mpi.display_order || 0,
    is_primary: mpi.is_primary,
  }
}

const transformProductVariant = (mpv: MockProductVariant): ProductVariant => {
  return {
    id: mpv.id,
    size: mpv.size,
    color: mpv.color,
    stock: mpv.stock,
    additional_price: mpv.additional_price,
    is_active: mpv.is_active,
  }
}

const parseTags = (tagsStr: string | null): string[] => {
  if (!tagsStr) return []
  try {
    return JSON.parse(tagsStr)
  } catch (e) {
    return []
  }
}

const transformToCatalogProduct = (mp: MockProduct): CatalogProduct => {
  const images = mp.images ? mp.images.map(transformProductImage) : []
  const primaryImg = images.find((i) => i.is_primary) || images[0]

  return {
    id: mp.id,
    category_id: mp.category_id,
    name: mp.name,
    slug: mp.slug,
    description: mp.description ?? undefined,
    price: mp.price,
    compare_at_price: mp.compare_at_price || undefined,
    is_available: mp.is_available,
    is_featured: mp.is_featured,
    tags: parseTags(mp.tags),
    display_order: mp.display_order || 0,
    primary_image: primaryImg ? primaryImg.image_url : "",
    category_name: mp.category?.name || "",
    avg_rating: 0,
    review_count: 0,
    images: images,
    variants: mp.variants ? mp.variants.map(transformProductVariant) : [],
  }
}

const transformToProductDetail = (mp: MockProduct): ProductDetail => {
  const catalogProduct = transformToCatalogProduct(mp)
  return {
    ...catalogProduct,
    description: catalogProduct.description ?? undefined,
    category: catalogProduct.category || { id: "", name: "", slug: "" },
    images: mp.images ? mp.images.map(transformProductImage) : [],
    variants: mp.variants ? mp.variants.map(transformProductVariant) : [],
  }
}

// Router
export const getMockResponse = (config: InternalAxiosRequestConfig): AxiosResponse | null => {
  const url = config.url || ""
  const method = (config.method || "get").toLowerCase()

  // Helper to create a fake successful AxiosResponse
  const createResponse = (data: any): AxiosResponse => ({
    data,
    status: 200,
    statusText: "OK",
    headers: {} as any,
    config,
  })

  // GET Requests matching patterns
  if (method === "get") {
    if (url.includes("/shop/categories")) {
      return createResponse({
        success: true,
        data: mockCategories.map(transformCategory),
      })
    }

    if (url.includes("/shop/products") && !url.match(/\/shop\/products\/.*\/reviews/)) {
      // Check if it's getting a single product by slug (e.g. /shop/products/my-slug)
      const parts = url.split("?")[0].split("/")
      const slug = parts[parts.length - 1]

      if (slug && slug !== "products") {
        const product = mockProducts.find((p) => p.slug === slug)
        if (product) {
          return createResponse({
            success: true,
            data: transformToProductDetail(product),
          })
        }
        return createResponse({ success: false, error: { message: "Product not found", code: "404" } })
      }

      // Otherwise it's the list
      return createResponse({
        success: true,
        data: mockProducts.map(transformToCatalogProduct),
        meta: { page: 1, per_page: 999, total: mockProducts.length, total_pages: 1 },
      })
    }

    if (url.match(/\/shop\/products\/.*\/reviews/)) {
      return createResponse({
        success: true,
        data: [],
        meta: { page: 1, per_page: 10, total: 0, total_pages: 0 },
      })
    }

    // Default catch-all for other GET requests (Cart, Wishlist, Profile)
    // Return empty arrays or null depending on common expectations
    return createResponse({
      success: true,
      data: url.includes("wishlist") || url.includes("addresses") || url.includes("orders") ? [] : null,
    })
  }

  // POST / PUT / DELETE / PATCH Requests
  // Just return success for mutations to prevent UI crashes
  return createResponse({ success: true, data: null })
}
