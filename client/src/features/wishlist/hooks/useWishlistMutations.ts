import { useMutation, useQueryClient } from "@tanstack/react-query"
import { wishlistApi } from "@/lib/api/wishlist"

export const useAddWishlistItemMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (variantId: string) => wishlistApi.addItem(variantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] })
    },
  })
}

export const useRemoveWishlistItemMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (variantId: string) => wishlistApi.removeItem(variantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] })
    },
  })
}
