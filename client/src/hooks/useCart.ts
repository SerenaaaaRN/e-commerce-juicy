import { useMemo } from "react"
import { useCartStore } from "@/stores/cartStore"

export const useCart = () => {
  const items = useCartStore((s) => s.items)
  const isLoading = useCartStore((s) => s.isLoading)
  const error = useCartStore((s) => s.error)
  const fetchCart = useCartStore((s) => s.fetchCart)
  const addItem = useCartStore((s) => s.addItem)
  const updateQty = useCartStore((s) => s.updateQty)
  const removeItem = useCartStore((s) => s.removeItem)
  const clearCart = useCartStore((s) => s.clearCart)
  const totalItemsFn = useCartStore((s) => s.totalItems)
  const totalPriceFn = useCartStore((s) => s.totalPrice)

  const itemCount = useMemo(() => totalItemsFn(), [items, totalItemsFn])
  const totalPriceValue = useMemo(() => totalPriceFn(), [items, totalPriceFn])

  return useMemo(
    () => ({ items, itemCount, totalPrice: totalPriceValue, isLoading, error, fetchCart, addItem, updateQty, removeItem, clearCart }),
    [items, itemCount, totalPriceValue, isLoading, error, fetchCart, addItem, updateQty, removeItem, clearCart]
  )
}

export default useCart
