import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field"
import { customerApi } from "@/lib/api/customer"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"

export const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!currentPassword) newErrors.currentPassword = "Current password is required"
    
    if (!newPassword) {
      newErrors.newPassword = "New password is required"
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "New password must be at least 8 characters"
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const res = await customerApi.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      })

      if (res.success) {
        toast.success("Password changed successfully.")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        toast.error(res.message || "Failed to update password. Please check your current password.")
      }
    } catch {
      toast.error("Failed to secure password. Please check your inputs.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="text-left w-full max-w-lg">
      <FieldGroup className="gap-5">
        
        {/* Current Password Field */}
        <Field data-invalid={!!errors.currentPassword}>
          <FieldLabel htmlFor="current-password">Current Password</FieldLabel>
          <Input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value)
              if (errors.currentPassword) setErrors((prev) => ({ ...prev, currentPassword: "" }))
            }}
            placeholder="••••••••"
            aria-invalid={!!errors.currentPassword}
          />
          {errors.currentPassword && <FieldError>{errors.currentPassword}</FieldError>}
        </Field>

        {/* New Password Field */}
        <Field data-invalid={!!errors.newPassword}>
          <FieldLabel htmlFor="new-password">New Password</FieldLabel>
          <Input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value)
              if (errors.newPassword) setErrors((prev) => ({ ...prev, newPassword: "" }))
            }}
            placeholder="Min. 8 characters"
            aria-invalid={!!errors.newPassword}
          />
          {errors.newPassword && <FieldError>{errors.newPassword}</FieldError>}
        </Field>

        {/* Confirm Password Field */}
        <Field data-invalid={!!errors.confirmPassword}>
          <FieldLabel htmlFor="confirm-password">Confirm New Password</FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" }))
            }}
            placeholder="••••••••"
            aria-invalid={!!errors.confirmPassword}
          />
          {errors.confirmPassword && <FieldError>{errors.confirmPassword}</FieldError>}
        </Field>

        {/* Submit */}
        <div className="pt-2">
          <Button type="submit" disabled={loading} className="cursor-pointer">
            {loading && <Spinner data-icon="inline-start" />}
            {loading ? "Securing account..." : "Update Password"}
          </Button>
        </div>

      </FieldGroup>
    </form>
  )
}

export default ChangePasswordForm
