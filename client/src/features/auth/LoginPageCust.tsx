import { useTransition } from "react"
import { Navigate, useNavigate, Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { FieldDescription } from "@/components/ui/field"
import { toast } from "sonner"
import { useCustomerAuthStore } from "@/stores/customerAuthStore"
import { customerApi } from "@/lib/api/customer"
import { LoginForm } from "@/features/auth/components/LoginForm"
import type { LoginFormValues } from "@/features/auth/types"

export const LoginPageCust = () => {
  const navigate = useNavigate()
  const { isAuthenticated, login } = useCustomerAuthStore()
  const [isPending, startTransition] = useTransition()

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = (data: LoginFormValues) => {
    startTransition(async () => {
      try {
        const res = await customerApi.login(data)
        if (res.success && res.data) {
          const { token, customer } = res.data
          login(token, customer)
          toast.success(`Welcome back, ${customer.full_name}!`)
          navigate("/shop")
        } else {
          toast.error(res.message || "Invalid credentials. Please try again.")
        }
      } catch {
        toast.error("Server offline. Please try again later.")
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
                  <span className="text-xs font-semibold tracking-wider text-primary uppercase">Juicy Storefront</span>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h1>
                  <p className="font-sans text-xs text-balance text-muted-foreground">
                    Enter your email and passcode credentials to view your profile.
                  </p>
                </header>

                <LoginForm
                  onSubmit={handleSubmit}
                  isPending={isPending}
                  showForgotPassword
                  showSocialLogins
                  registerUrl="/register"
                />
              </aside>

              {/* Image Side */}
              <aside className="relative hidden bg-muted md:block">
                <img
                  src="/jiso.jpg"
                  alt="Juicy Storefront Image"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
              </aside>
            </CardContent>
          </Card>

          {/* Footer Notice */}
          <FieldDescription className="px-6 text-center text-xs">
            By clicking continue, you agree to our{" "}
            <Link to="/terms" className="underline hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="underline hover:text-primary">
              Privacy Policy
            </Link>
            .
          </FieldDescription>
        </div>
      </div>
    </div>
  )
}

export default LoginPageCust
