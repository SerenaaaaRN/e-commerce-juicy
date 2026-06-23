import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ordersApi } from "@/lib/api/orders"
import type { Address } from "@/types"
import { useState, useTransition } from "react"
import { toast } from "sonner"

type AddressFormProps = {
  onSubmitSuccess: () => void
  onCancel?: () => void
  initialData?: Address
}

export const AddressForm = ({ onSubmitSuccess, onCancel, initialData }: AddressFormProps) => {
  const [isPending, startTransition] = useTransition()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isEditing = !!initialData

  const [formData, setFormData] = useState({
    label: initialData?.label || "",
    recipient_name: initialData?.recipient_name || "",
    phone: initialData?.phone || "",
    address_line: initialData?.address_line || "",
    city: initialData?.city || "",
    province: initialData?.province || "",
    postal_code: initialData?.postal_code || "",
  })

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev }
        delete copy[field]
        return copy
      })
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.label.trim()) newErrors.label = "Label is required (e.g. Home, Work)"
    if (!formData.recipient_name.trim()) newErrors.recipient_name = "Recipient name is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.address_line.trim()) newErrors.address_line = "Address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.province.trim()) newErrors.province = "Province is required"
    if (!formData.postal_code.trim()) newErrors.postal_code = "Postal code is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    startTransition(async () => {
      try {
        const res = isEditing
          ? await ordersApi.updateAddress(initialData.id, formData)
          : await ordersApi.createAddress(formData)
        if (res.success) {
          toast.success(isEditing ? "Shipping address updated." : "Shipping address saved.")
          onSubmitSuccess()
        } else {
          toast.error(res.message || "Failed to save shipping address.")
        }
      } catch {
        toast.error("Failed to save shipping address. Please check your inputs.")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="w-full text-left">
      <FieldGroup>
        <Field data-invalid={!!errors.label}>
          <FieldLabel htmlFor="label">Address Label</FieldLabel>
          <Input
            id="label"
            value={formData.label}
            onChange={(e) => handleChange("label", e.target.value)}
            placeholder="e.g. Home, Office"
            aria-invalid={!!errors.label}
          />
          {errors.label && <FieldError>{errors.label}</FieldError>}
        </Field>

        <Field data-invalid={!!errors.recipient_name}>
          <FieldLabel htmlFor="recipient_name">Recipient Name</FieldLabel>
          <Input
            id="recipient_name"
            value={formData.recipient_name}
            onChange={(e) => handleChange("recipient_name", e.target.value)}
            placeholder="Name of recipient"
            aria-invalid={!!errors.recipient_name}
          />
          {errors.recipient_name && <FieldError>{errors.recipient_name}</FieldError>}
        </Field>

        <Field data-invalid={!!errors.phone}>
          <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Recipient's contact number"
            aria-invalid={!!errors.phone}
          />
          {errors.phone && <FieldError>{errors.phone}</FieldError>}
        </Field>

        <Field data-invalid={!!errors.address_line}>
          <FieldLabel htmlFor="address_line">Street Address</FieldLabel>
          <Input
            id="address_line"
            value={formData.address_line}
            onChange={(e) => handleChange("address_line", e.target.value)}
            placeholder="Apartment, suite, unit, street name"
            aria-invalid={!!errors.address_line}
          />
          {errors.address_line && <FieldError>{errors.address_line}</FieldError>}
        </Field>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <Field data-invalid={!!errors.city}>
            <FieldLabel htmlFor="city">City</FieldLabel>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="City name"
              aria-invalid={!!errors.city}
            />
            {errors.city && <FieldError>{errors.city}</FieldError>}
          </Field>

          <Field data-invalid={!!errors.province}>
            <FieldLabel htmlFor="province">Province</FieldLabel>
            <Input
              id="province"
              value={formData.province}
              onChange={(e) => handleChange("province", e.target.value)}
              placeholder="Province name"
              aria-invalid={!!errors.province}
            />
            {errors.province && <FieldError>{errors.province}</FieldError>}
          </Field>

          <Field data-invalid={!!errors.postal_code}>
            <FieldLabel htmlFor="postal_code">Postal Code</FieldLabel>
            <Input
              id="postal_code"
              value={formData.postal_code}
              onChange={(e) => handleChange("postal_code", e.target.value)}
              placeholder="Postal/Zip code"
              aria-invalid={!!errors.postal_code}
            />
            {errors.postal_code && <FieldError>{errors.postal_code}</FieldError>}
          </Field>
        </div>

        <div className="flex justify-end gap-3 border-t border-border/60 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isPending} className="cursor-pointer">
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isPending} className="cursor-pointer">
            {isPending ? "Saving..." : isEditing ? "Update Address" : "Save Address"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}

export default AddressForm
