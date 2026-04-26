import { useState, useEffect } from "react"
import { AddressCard } from "./AddressCard"
import { AddressFormModal } from "./AddressFormModal"
import { ordersApi } from "@/lib/api/orders"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia } from "@/components/ui/empty"
import { HugeiconsIcon } from "@hugeicons/react"
import { ShoppingBag01Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"
import { useConfirm } from "@/hooks/useConfirm"
import type { Address } from "@/types"

export const AddressList = () => {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | undefined>(undefined)
  const { confirm: confirmDelete, dialog: confirmDialog } = useConfirm()

  const loadAddresses = async () => {
    setLoading(true)
    try {
      const res = await ordersApi.getAddresses()
      if (res.success) {
        setAddresses(res.data)
      }
    } catch {
      toast.error("Failed to retrieve shipping address list.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAddresses()
  }, [])

  const handleDelete = async (id: string) => {
    const confirmed = await confirmDelete(
      "Are you sure you want to delete this shipping address? This action cannot be undone."
    )
    if (!confirmed) return

    try {
      const res = await ordersApi.deleteAddress(id)
      if (res.success) {
        toast.success("Shipping address removed.")
        loadAddresses()
      } else {
        toast.error(res.message || "Failed to remove shipping address.")
      }
    } catch {
      toast.error("Failed to execute request.")
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      const res = await ordersApi.setDefaultAddress(id)
      if (res.success) {
        toast.success("Default address updated.")
        loadAddresses()
      } else {
        toast.error(res.message || "Failed to update default shipping selection.")
      }
    } catch {
      toast.error("Failed to execute request.")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner className="text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 text-left">
      
      {/* List Header */}
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-sm font-semibold tracking-tight text-foreground uppercase">
            Shipping Destinations
          </h3>
          <span className="text-[11px] text-muted-foreground uppercase tracking-widest font-semibold">
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
        <Empty className="border-none max-w-md mx-auto bg-transparent">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="bg-primary/5 text-primary size-12 rounded-full mb-3 flex items-center justify-center">
              <HugeiconsIcon icon={ShoppingBag01Icon} strokeWidth={1.8} className="size-6 text-primary" />
            </EmptyMedia>
            <EmptyTitle className="text-xl font-bold tracking-tight">
              No Addresses Saved
            </EmptyTitle>
            <EmptyDescription className="text-sm text-muted-foreground mt-2">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
