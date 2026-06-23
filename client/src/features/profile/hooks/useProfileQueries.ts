import { customerApi } from "@/lib/api/customer"
import { ordersApi } from "@/lib/api/orders"
import type { Address } from "@/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

// Profile Hooks
export const useUpdateProfileMutation = () => {
  return useMutation({
    mutationFn: async (payload: { full_name: string; phone?: string }) => {
      const res = await customerApi.updateProfile(payload)
      if (!res.success) {
        throw new Error(res.message || "Failed to update profile details.")
      }
      return res.data
    },
  })
}

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: async (payload: Parameters<typeof customerApi.changePassword>[0]) => {
      const res = await customerApi.changePassword(payload)
      if (!res.success) {
        throw new Error(res.message || "Failed to change password.")
      }
      return res
    },
  })
}

export const useAddressesQuery = () => {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const res = await ordersApi.getAddresses()
      if (!res.success) {
        throw new Error(res.message || "Failed to retrieve shipping address list.")
      }
      return res.data as Address[]
    },
  })
}

export const useDeleteAddressMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await ordersApi.deleteAddress(id)
      if (!res.success) {
        throw new Error(res.message || "Failed to remove shipping address.")
      }
      return res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] })
    },
  })
}

export const useSetDefaultAddressMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await ordersApi.setDefaultAddress(id)
      if (!res.success) {
        throw new Error(res.message || "Failed to update default shipping selection.")
      }
      return res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] })
    },
  })
}
