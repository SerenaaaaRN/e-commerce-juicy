import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field"
import { useCustomerAuthStore } from "@/stores/customerAuthStore"
import { customerApi } from "@/lib/api/customer"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"

export const LoginForm = () => {
  const navigate = useNavigate()
  const { login } = useCustomerAuthStore()

  // State
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!email.trim()) {
      newErrors.email = "Email address is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const res = await customerApi.login({ email, password })
      if (res.success && res.data) {
        const { token, customer } = res.data
        login(token, customer)
        toast.success(`Welcome back, ${customer.full_name}!`)
        navigate("/shop")
      } else {
        toast.error(res.message || "Invalid credentials. Please try again.")
      }
    } catch {
      toast.error("Failed to authenticate. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="text-left w-full">
      <FieldGroup className="gap-6">
        
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

        {/* Password Field */}
        <Field data-invalid={!!errors.password}>
          <div className="flex justify-between items-center w-full">
            <FieldLabel htmlFor="password">Password</FieldLabel>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (errors.password) setErrors((prev) => ({ ...prev, password: "" }))
            }}
            placeholder="••••••••"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
          />
          {errors.password && <FieldError>{errors.password}</FieldError>}
        </Field>

        {/* Action Trigger */}
        <Button
          type="submit"
          disabled={loading}
          size="lg"
          className="w-full mt-2 font-medium uppercase tracking-widest text-xs py-6 h-auto cursor-pointer"
        >
          {loading && <Spinner data-icon="inline-start" />}
          {loading ? "Authenticating..." : "Sign In to Account"}
        </Button>

      </FieldGroup>
    </form>
  )
}

export default LoginForm
