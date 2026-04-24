import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
    <div className="flex flex-col gap-4 text-left w-full">
      
      {/* Header Row */}
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold tracking-tight text-foreground uppercase">
          Shipping Address
        </h3>
        {addresses.length > 0 && (
          <Button
            variant="link"
            size="sm"
            onClick={onAddNewTrigger}
            className="p-0 h-auto cursor-pointer font-semibold"
          >
            + Add New Address
          </Button>
        )}
      </div>

      {addresses.length === 0 ? (
        <div className="flex flex-col gap-4 items-center justify-center p-8 border border-dashed border-border/80 rounded-lg text-center bg-muted/10">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            No saved shipping addresses found.
          </p>
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
          className="flex flex-col gap-3 items-stretch w-full"
        >
          {addresses.map((addr) => {
            return (
              <ToggleGroupItem
                key={addr.id}
                value={addr.id}
                className="p-5 h-auto justify-start text-left flex flex-col items-start w-full border cursor-pointer hover:bg-muted/50 data-[state=on]:bg-accent/40 data-[state=on]:border-primary transition-all rounded-md"
              >
                <div className="flex justify-between items-center w-full">
                  <span className="font-semibold text-xs uppercase tracking-wider text-primary">
                    {addr.label}
                  </span>
                  {addr.is_default && (
                    <Badge variant="secondary" className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                      DEFAULT
                    </Badge>
                  )}
                </div>
                
                <span className="font-bold text-sm text-foreground pt-2">
                  {addr.recipient_name}
                </span>
                
                <span className="text-xs text-muted-foreground pt-1 leading-relaxed leading-relaxed font-sans">
                  {addr.address_line}, {addr.city}, {addr.province}, {addr.postal_code}
                </span>

                <span className="text-xs font-mono font-medium text-foreground pt-1">
                  Phone: {addr.phone}
                </span>

              </ToggleGroupItem>
            )
          })}
        </ToggleGroup>
      )}

    </div>
  )
}

export default AddressSelector
