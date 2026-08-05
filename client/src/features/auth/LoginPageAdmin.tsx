import { Card, CardContent } from "@/components/ui/card"
import { FieldDescription } from "@/components/ui/field"
import { useNavigate } from "@tanstack/react-router"
import { LoginForm } from "@/features/auth/components/LoginForm"
import type { LoginFormValues } from "@/features/auth/types"
import { adminApi } from "@/lib/api/admin"
import { useAdminAuthStore } from "@/stores/admin-auth-store"
import { useTransition } from "react"
import { toast } from "sonner"

export const LoginPageAdmin = () => {
  const navigate = useNavigate()
  const { login } = useAdminAuthStore()
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (data: LoginFormValues) => {
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
          toast.success(`Access granted. Welcome back, ${admin.username}!`)
          navigate({ to: "/admin/dashboard" })
        } else {
          toast.error(res.message || "Invalid email or passcode. Access denied.")
        }
      } catch {
        toast.error("Invalid email or passcode. Access denied.")
      }
    })
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden border border-border/80 p-0 shadow-md">
            <CardContent className="grid p-0 md:grid-cols-2">
              {/* Form Side */}
              <aside className="flex flex-col justify-center p-6 text-left md:p-8">
                {/* Header Info */}
                <header className="mb-4 flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome Back Serena</h1>
                  <p className="text-center font-sans text-xs text-balance text-muted-foreground">
                    Provide your authorized manager credentials to unlock the inventory, review, and fulfillment
                    systems.
                  </p>
                </header>

                <LoginForm
                  onSubmit={handleSubmit}
                  isPending={isPending}
                  emailLabel="Manager Email"
                  emailPlaceholder="admin@juicy.com"
                  passwordLabel="Passcode"
                  submitText="Sign In to Console"
                  submittingText="Authorizing..."
                />
              </aside>

              {/* Image Side */}
              <aside className="relative hidden bg-muted md:block">
                <img
                  src="/shop-hero-luxury-fashion-collection.jpg"
                  alt="Juicy Storefront Image"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
              </aside>
            </CardContent>
          </Card>

          <FieldDescription className="px-6 text-center text-xs">
            By clicking continue, you agree to our{" "}
            <a href="#" className="underline hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-primary">
              Privacy Policy
            </a>
            .
          </FieldDescription>
        </div>
      </div>
    </div>
  )
}

export default LoginPageAdmin
