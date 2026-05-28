import { useQuery } from "@tanstack/react-query"
import { wishlistApi, type WishlistItem } from "@/lib/api/wishlist"

export const useWishlistQuery = (enabled: boolean = true) =>
  useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const res = await wishlistApi.getWishlist()
      const items = res.data as WishlistItem[]
      return {
        items,
        wishlistIds: new Set(items.map((i) => i.variant_id)),
      }
    },
    enabled,
  })
