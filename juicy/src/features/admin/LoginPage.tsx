import React, { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { useAdminAuthStore } from "@/stores/adminAuthStore"
import { adminApi } from "@/lib/api/admin"
import { toast } from "sonner"

export const LoginPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated, login } = useAdminAuthStore()

  // Form State
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // If already authenticated, redirect to admin dashboard
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />
  }

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
      const res = await adminApi.login({ email, password })
      if (res.success && res.data) {
        const { token, admin } = res.data
        login(token, {
          id: admin.id,
          email: admin.email,
          name: admin.username,
        })
        toast.success(`Access granted. Welcome back, Admin ${admin.username}!`)
        navigate("/admin/dashboard")
      } else {
        toast.error(res.message || "Invalid email or passcode. Access denied.")
      }
    } catch (err: unknown) {
      toast.error("Failed to authenticate. Access denied.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex min-h-[90vh] max-w-7xl items-center justify-center px-4 py-16">
      <Card className="border border-border/80 shadow-lg w-full max-w-md bg-card">
        <CardContent className="p-8 flex flex-col gap-6 text-left">
          {/* Header block */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold tracking-widest text-primary uppercase">
              Juicy Management Console
            </span>
            <h1 className="text-3xl font-heading font-extrabold tracking-tight text-foreground">
              Admin Sign In
            </h1>
            <p className="text-xs text-muted-foreground font-sans">
              Provide your authorized manager credentials to unlock the inventory, review, and fulfillment systems.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="text-left w-full">
            <FieldGroup className="gap-6">
              
              {/* Email Address */}
              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email">Manager Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors((prev) => ({ ...prev, email: "" }))
                  }}
                  placeholder="admin@juicy.com"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                />
                {errors.email && <FieldError>{errors.email}</FieldError>}
              </Field>

              {/* Password */}
              <Field data-invalid={!!errors.password}>
                <FieldLabel htmlFor="password">Passcode</FieldLabel>
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

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="w-full mt-2 font-medium uppercase tracking-widest text-xs py-6 h-auto cursor-pointer"
              >
                {loading && <Spinner data-icon="inline-start" />}
                {loading ? "Authorizing..." : "Sign In to Console"}
              </Button>

            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage
