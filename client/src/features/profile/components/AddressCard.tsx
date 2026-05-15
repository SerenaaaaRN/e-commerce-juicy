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
    <Card className="relative border border-border/80 shadow-sm transition-all duration-200 hover:shadow-md">
      <CardContent className="flex flex-col items-start gap-2.5 p-5 text-left">
        {/* Header row */}
        <header className="flex w-full items-center justify-between">
          <span className="text-xs font-semibold tracking-wider text-primary uppercase">{address.label}</span>
          {address.is_default && (
            <Badge variant="secondary" className="border-none px-1.5 py-0.5 text-[9px] font-bold">
              DEFAULT
            </Badge>
          )}
        </header>

        {/* Recipient info details */}
        <div className="flex flex-col pt-1">
          <span className="text-sm font-bold text-foreground">{address.recipient_name}</span>
          <span className="pt-1 font-sans text-xs leading-relaxed text-muted-foreground">
            {address.address_line}, {address.city}, {address.province}, {address.postal_code}
          </span>
          <span className="pt-1.5 font-mono text-xs font-medium text-foreground">Phone: {address.phone}</span>
        </div>

        {/* Actions bar */}
        <div className="mt-1 flex w-full gap-2 border-t border-border/40 pt-3">
          {!address.is_default && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSetDefault(address.id)}
              className="h-8 cursor-pointer text-[10px] font-semibold uppercase"
            >
              Set Default
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(address)}
            className="h-8 cursor-pointer text-[10px] font-semibold text-muted-foreground uppercase hover:text-foreground"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(address.id)}
            className="h-8 cursor-pointer text-[10px] font-semibold text-muted-foreground uppercase hover:text-destructive"
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default AddressCard
