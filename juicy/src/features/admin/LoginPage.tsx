import { useTransition } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { useAdminAuthStore } from "@/stores/adminAuthStore"
import { adminApi } from "@/lib/api/admin"
import { toast } from "sonner"

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export const LoginPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated, login } = useAdminAuthStore()
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />
  }

  const onSubmit = (data: LoginFormValues) => {
    startTransition(async () => {
      try {
        const res = await adminApi.login(data)
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
      } catch {
        toast.error("Failed to authenticate. Access denied.")
      }
    })
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
          <form onSubmit={handleSubmit(onSubmit)} className="text-left w-full">
            <FieldGroup className="gap-6">
              
              {/* Email Address */}
              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email">Manager Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@juicy.com"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
                {errors.email && <FieldError>{errors.email.message}</FieldError>}
              </Field>

              {/* Password */}
              <Field data-invalid={!!errors.password}>
                <FieldLabel htmlFor="password">Passcode</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  {...register("password")}
                />
                {errors.password && <FieldError>{errors.password.message}</FieldError>}
              </Field>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isPending}
                size="lg"
                className="w-full mt-2 font-medium uppercase tracking-widest text-xs py-6 h-auto cursor-pointer"
              >
                {isPending && <Spinner data-icon="inline-start" />}
                {isPending ? "Authorizing..." : "Sign In to Console"}
              </Button>

            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage
