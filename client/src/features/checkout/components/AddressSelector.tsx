import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { Address } from "@/types"

type AddressSelectorProps = {
  addresses: Address[]
  selectedAddressId: string
  onSelectAddress: (id: string) => void
  onAddNewTrigger: () => void
}

export const AddressSelector = ({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddNewTrigger,
}: AddressSelectorProps) => {
  return (
    <div className="flex w-full flex-col gap-4 text-left">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-tight text-foreground uppercase">Shipping Address</h3>
        {addresses.length > 0 && (
          <Button
            variant="link"
            size="sm"
            onClick={onAddNewTrigger}
            className="h-auto cursor-pointer p-0 font-semibold"
          >
            + Add New Address
          </Button>
        )}
      </div>

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border/80 bg-muted/10 p-8 text-center">
          <p className="text-xs tracking-wider text-muted-foreground uppercase">No saved shipping addresses found.</p>
          <Button onClick={onAddNewTrigger} size="sm" className="cursor-pointer">
            Create Shipping Address
          </Button>
        </div>
      ) : (
        <ToggleGroup
          type="single"
          variant="outline"
          value={selectedAddressId}
          onValueChange={(val) => val && onSelectAddress(val)}
          className="flex w-full flex-col items-stretch gap-3"
        >
          {addresses.map((addr) => {
            return (
              <ToggleGroupItem
                key={addr.id}
                value={addr.id}
                className="flex h-auto w-full cursor-pointer flex-col items-start justify-start rounded-md border p-5 text-left transition-all hover:bg-muted/50 data-[state=on]:border-primary data-[state=on]:bg-accent/40"
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-xs font-semibold tracking-wider text-primary uppercase">{addr.label}</span>
                  {addr.is_default && (
                    <Badge variant="secondary" className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase">
                      DEFAULT
                    </Badge>
                  )}
                </div>

                <span className="pt-2 text-sm font-bold text-foreground">{addr.recipient_name}</span>

                <span className="pt-1 font-sans text-xs leading-relaxed text-muted-foreground">
                  {addr.address_line}, {addr.city}, {addr.province}, {addr.postal_code}
                </span>

                <span className="pt-1 font-mono text-xs font-medium text-foreground">Phone: {addr.phone}</span>
              </ToggleGroupItem>
            )
          })}
        </ToggleGroup>
      )}
    </div>
  )
}

export default AddressSelector
