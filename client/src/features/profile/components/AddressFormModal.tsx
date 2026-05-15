import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { AddressForm } from "@/features/checkout/components/AddressForm"
import type { Address } from "@/types"

type AddressFormModalProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  initialData?: Address
}

export const AddressFormModal = ({ isOpen, onClose, onSuccess, initialData }: AddressFormModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader className="flex flex-col gap-1 text-left">
          <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
            {initialData ? "Edit Shipping Address" : "Create Shipping Address"}
          </DialogTitle>
          <DialogDescription className="font-sans text-xs text-muted-foreground">
            {initialData
              ? "Update your delivery destination details."
              : "Add a new delivery destination for checkout order placement."}
          </DialogDescription>
        </DialogHeader>

        <div className="pt-4">
          <AddressForm
            initialData={initialData}
            onSubmitSuccess={() => {
              onSuccess()
              onClose()
            }}
            onCancel={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddressFormModal
