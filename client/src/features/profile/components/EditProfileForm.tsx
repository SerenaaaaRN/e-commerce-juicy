import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field"
import { useCustomerAuthStore } from "@/stores/customerAuthStore"
import { customerApi } from "@/lib/api/customer"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"

export const EditProfileForm = () => {
  const customer = useCustomerAuthStore((s) => s.customer)
  const login = useCustomerAuthStore((s) => s.login)
  const token = useCustomerAuthStore((s) => s.token)

  const [fullName, setFullName] = useState(customer?.full_name || "")
  const [phone, setPhone] = useState(customer?.phone || "")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!fullName.trim()) newErrors.fullName = "Full name is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const res = await customerApi.updateProfile({
        full_name: fullName,
        phone: phone.trim() || undefined,
      })
      if (res.success && res.data && token) {
        login(token, res.data) // update global state zustand
        toast.success("Profile details updated successfully.")
      } else {
        toast.error(res.message || "Failed to update profile details.")
      }
    } catch {
      toast.error("Failed to update profile. Please verify your connection.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg text-left">
      <FieldGroup className="gap-5">
        {/* Email Field - Read Only */}
        <Field>
          <FieldLabel htmlFor="profile-email">Email Address (Cannot change)</FieldLabel>
          <Input
            id="profile-email"
            type="email"
            value={customer?.email || ""}
            disabled
            className="cursor-not-allowed bg-muted text-muted-foreground"
          />
        </Field>

        {/* Name Field */}
        <Field data-invalid={!!errors.fullName}>
          <FieldLabel htmlFor="profile-name">Full Name</FieldLabel>
          <Input
            id="profile-name"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value)
              if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: "" }))
            }}
            placeholder="John Doe"
            aria-invalid={!!errors.fullName}
          />
          {errors.fullName && <FieldError>{errors.fullName}</FieldError>}
        </Field>

        {/* Phone Field */}
        <Field>
          <FieldLabel htmlFor="profile-phone">Phone Number</FieldLabel>
          <Input
            id="profile-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+62812345678"
          />
        </Field>

        {/* Submit */}
        <div className="pt-2">
          <Button type="submit" disabled={loading} className="cursor-pointer">
            {loading && <Spinner data-icon="inline-start" />}
            {loading ? "Saving changes..." : "Save Profile Details"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}

export default EditProfileForm
