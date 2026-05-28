import { useQuery } from "@tanstack/react-query"
import { cartApi } from "@/lib/api/cart"
import type { CartItem } from "@/types"

export const useCartQuery = (enabled: boolean = true) =>
  useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await cartApi.getCart()
      return {
        items: res.data.items as CartItem[],
        total: res.data.total,
      }
    },
    enabled,
  })
