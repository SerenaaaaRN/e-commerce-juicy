import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Address } from "@/types"

type AddressCardProps = {
  address: Address
  onDelete: (id: string) => void
  onSetDefault: (id: string) => void
  onEdit: (address: Address) => void
}

export const AddressCard = ({ address, onDelete, onSetDefault, onEdit }: AddressCardProps) => {
  return (
    <Card className="border border-border/80 shadow-sm relative hover:shadow-md transition-all duration-200">
      <CardContent className="p-5 flex flex-col items-start text-left gap-2.5">
        
        {/* Header row */}
        <div className="flex justify-between items-center w-full">
          <span className="text-xs font-semibold tracking-wider text-primary uppercase">
            {address.label}
          </span>
          {address.is_default && (
            <Badge variant="secondary" className="font-bold text-[9px] px-1.5 py-0.5 border-none">
              DEFAULT
            </Badge>
          )}
        </div>

        {/* Recipient info details */}
        <div className="flex flex-col pt-1">
          <span className="font-bold text-sm text-foreground">
            {address.recipient_name}
          </span>
          <span className="text-xs text-muted-foreground pt-1 leading-relaxed font-sans">
            {address.address_line}, {address.city}, {address.province}, {address.postal_code}
          </span>
          <span className="text-xs font-mono font-medium text-foreground pt-1.5">
            Phone: {address.phone}
          </span>
        </div>

        {/* Actions bar */}
        <div className="flex gap-2 w-full pt-3 mt-1 border-t border-border/40">
          {!address.is_default && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSetDefault(address.id)}
              className="text-[10px] uppercase font-semibold h-8 cursor-pointer"
            >
              Set Default
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(address)}
            className="text-[10px] uppercase font-semibold text-muted-foreground hover:text-foreground h-8 cursor-pointer"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(address.id)}
            className="text-[10px] uppercase font-semibold text-muted-foreground hover:text-destructive h-8 cursor-pointer"
          >
            Delete
          </Button>
        </div>

      </CardContent>
    </Card>
  )
}

export default AddressCard
