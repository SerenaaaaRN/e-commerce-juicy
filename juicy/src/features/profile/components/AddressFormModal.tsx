import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { AddressForm } from "@/features/checkout/components/AddressForm"

type AddressFormModalProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export const AddressFormModal = ({ isOpen, onClose, onSuccess }: AddressFormModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl">
        
        <DialogHeader className="text-left flex flex-col gap-1">
          <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
            Create Shipping Address
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground font-sans">
            Add a new delivery destination for checkout order placement.
          </DialogDescription>
        </DialogHeader>

        <div className="pt-4">
          <AddressForm
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
