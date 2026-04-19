import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field"
import { ordersApi } from "@/lib/api/orders"
import { toast } from "sonner"

type AddressFormProps = {
  onSubmitSuccess: () => void
  onCancel?: () => void
}

export const AddressForm = ({ onSubmitSuccess, onCancel }: AddressFormProps) => {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Form states
  const [formData, setFormData] = useState({
    label: "",
    recipient_name: "",
    phone: "",
    address_line: "",
    city: "",
    province: "",
    postal_code: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const res = await ordersApi.createAddress(formData)
      if (res.success) {
        toast.success("Shipping address saved successfully.")
        onSubmitSuccess()
      } else {
        toast.error(res.message || "Failed to save shipping address.")
      }
    } catch {
      toast.error("Failed to save shipping address. Please check your inputs.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="text-left w-full">
      <FieldGroup>
        
        {/* Label */}
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

        {/* Recipient Name */}
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

        {/* Phone */}
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

        {/* Address Line */}
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

        {/* City & Province & Postal Code Split Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
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

        {/* Actions Row */}
        <div className="flex gap-3 justify-end pt-4 border-t border-border/60">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="cursor-pointer"
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={loading} className="cursor-pointer">
            {loading ? "Saving..." : "Save Address"}
          </Button>
        </div>

      </FieldGroup>
    </form>
  )
}

export default AddressForm
