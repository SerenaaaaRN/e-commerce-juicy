import { Card, CardContent } from "@/components/ui/card"
import { FieldDescription } from "@/components/ui/field"
import { useNavigate } from "@tanstack/react-router"
import { LoginForm } from "@/features/auth/components/LoginForm"
import type { LoginFormValues } from "@/features/auth/types"
import { customerApi } from "@/lib/api/customer"
import { useCustomerAuthStore } from "@/stores/customer-auth-store"
import { useTransition } from "react"
import { toast } from "sonner"

export const LoginPageCust = () => {
  const navigate = useNavigate()
  const { login } = useCustomerAuthStore()
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (data: LoginFormValues) => {
    startTransition(async () => {
      try {
        const res = await customerApi.login(data)
        if (res.success && res.data) {
          const { token, customer } = res.data
          login(token, customer)
          toast.success(`Welcome back, ${customer.full_name}!`)
          navigate({ to: "/shop" })
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
                  <span className="text-xs tracking-[0.15em] text-muted-foreground uppercase">Juicy Storefront</span>
                  <h1 className="font-serif text-3xl text-foreground">Welcome back</h1>
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

export default LoginPageCust
