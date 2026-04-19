import { useProductStore } from "@/stores/productStore"

export const useProduct = () => {
  const store = useProductStore()

  return {
    products: store.products,
    featuredProducts: store.featuredProducts,
    categories: store.categories,
    currentProduct: store.currentProduct,
    isLoading: store.isLoading,
    error: store.error,
    meta: store.meta,
    fetchProducts: store.fetchProducts,
    fetchFeaturedProducts: store.fetchFeaturedProducts,
    fetchProductBySlug: store.fetchProductBySlug,
    clearCurrentProduct: store.clearCurrentProduct,
  }
}

export default useProduct
