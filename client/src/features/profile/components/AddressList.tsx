import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import { useConfirm } from "@/hooks/useConfirm"
import type { Address } from "@/types"
import { ShoppingBag01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"
import { toast } from "sonner"
import { useAddressesQuery, useDeleteAddressMutation, useSetDefaultAddressMutation } from "../hooks/useProfileQueries"
import { AddressCard } from "./AddressCard"
import { AddressFormModal } from "./AddressFormModal"

export const AddressList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | undefined>(undefined)
  const { confirm: confirmDelete, dialog: confirmDialog } = useConfirm()

  const { data: addresses = [], isLoading: loading, refetch: loadAddresses } = useAddressesQuery()
  const deleteAddressMutation = useDeleteAddressMutation()
  const setDefaultAddressMutation = useSetDefaultAddressMutation()

  const handleDelete = async (id: string) => {
    const confirmed = await confirmDelete(
      "Are you sure you want to delete this shipping address? This action cannot be undone."
    )
    if (!confirmed) return

    try {
      await deleteAddressMutation.mutateAsync(id)
      toast.success("Shipping address removed.")
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to execute request."
      toast.error(errMsg)
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddressMutation.mutateAsync(id)
      toast.success("Default address updated.")
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to execute request."
      toast.error(errMsg)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* List Header */}
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-sm font-semibold tracking-tight text-foreground uppercase">Shipping Destinations</h3>
          <span className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
            Manage your delivery profile addresses ({addresses.length} saved)
          </span>
        </div>

        {addresses.length > 0 && (
          <Button onClick={() => setIsModalOpen(true)} size="sm" className="cursor-pointer">
            + New Address
          </Button>
        )}
      </div>

      {/* Main Address Cards Grid */}
      {addresses.length === 0 ? (
        <Empty className="mx-auto max-w-md border-none bg-transparent">
          <EmptyHeader>
            <EmptyMedia
              variant="icon"
              className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary/5 text-primary"
            >
              <HugeiconsIcon icon={ShoppingBag01Icon} strokeWidth={1.8} className="size-6 text-primary" />
            </EmptyMedia>
            <EmptyTitle className="text-xl font-bold tracking-tight">No Addresses Saved</EmptyTitle>
            <EmptyDescription className="mt-2 text-sm text-muted-foreground">
              You haven't saved any delivery destinations yet. Add a new address to speed up your checkout flow.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="mt-6">
            <Button onClick={() => setIsModalOpen(true)} size="lg" className="cursor-pointer">
              Add New Address
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
              onEdit={(addr) => {
                setEditingAddress(addr)
                setIsModalOpen(true)
              }}
            />
          ))}
        </div>
      )}

      {/* modal overlay trigger */}
      <AddressFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingAddress(undefined)
        }}
        onSuccess={loadAddresses}
        initialData={editingAddress}
      />

      {confirmDialog}
    </div>
  )
}

export default AddressList
