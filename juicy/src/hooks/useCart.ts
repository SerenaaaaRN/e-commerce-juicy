import { useCartStore } from "@/stores/cartStore"

export const useCart = () => {
  const store = useCartStore()
  
  const itemCount = store.totalItems()
  const totalPrice = store.totalPrice()

  return {
    items: store.items,
    itemCount,
    totalPrice,
    isLoading: store.isLoading,
    error: store.error,
    fetchCart: store.fetchCart,
    addItem: store.addItem,
    updateQty: store.updateQty,
    removeItem: store.removeItem,
    clearCart: store.clearCart,
  }
}

export default useCart
