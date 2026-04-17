import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field"
import { customerApi } from "@/lib/api/customer"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"

export const RegisterForm = () => {
  const navigate = useNavigate()

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!fullName.trim()) newErrors.fullName = "Full name is required"
    
    if (!email.trim()) {
      newErrors.email = "Email address is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const res = await customerApi.register({
        full_name: fullName,
        email,
        phone: phone.trim() || undefined,
        password,
      })

      if (res.success) {
        toast.success("Account created successfully! Please sign in.")
        navigate("/login")
      } else {
        toast.error(res.message || "Failed to create account. Email may already be in use.")
      }
    } catch {
      toast.error("Failed to register. Please review your details and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="text-left w-full">
      <FieldGroup className="gap-5">
        
        {/* Name Field */}
        <Field data-invalid={!!errors.fullName}>
          <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value)
              if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: "" }))
            }}
            placeholder="John Doe"
            autoComplete="name"
            aria-invalid={!!errors.fullName}
          />
          {errors.fullName && <FieldError>{errors.fullName}</FieldError>}
        </Field>

        {/* Email Field */}
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">Email Address</FieldLabel>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) setErrors((prev) => ({ ...prev, email: "" }))
            }}
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
          />
          {errors.email && <FieldError>{errors.email}</FieldError>}
        </Field>

        {/* Phone Field */}
        <Field data-invalid={!!errors.phone}>
          <FieldLabel htmlFor="phone">Phone Number (Optional)</FieldLabel>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value)
            }}
            placeholder="e.g. +62812345678"
            autoComplete="tel"
          />
        </Field>

        {/* Password Field */}
        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (errors.password) setErrors((prev) => ({ ...prev, password: "" }))
            }}
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
          />
          {errors.password && <FieldError>{errors.password}</FieldError>}
        </Field>

        {/* Action Button */}
        <Button
          type="submit"
          disabled={loading}
          size="lg"
          className="w-full mt-2 font-medium uppercase tracking-widest text-xs py-6 h-auto cursor-pointer"
        >
          {loading && <Spinner data-icon="inline-start" />}
          {loading ? "Registering..." : "Create Account"}
        </Button>

      </FieldGroup>
    </form>
  )
}

export default RegisterForm
