import { useTransition } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { ROUTES } from "@/constants/routes"
import { useCustomerAuthStore } from "@/stores/customerAuthStore"
import { RegisterForm } from "./components/RegisterForm"
import { Card, CardContent } from "@/components/ui/card"
import { FieldDescription } from "@/components/ui/field"
import { customerApi } from "@/lib/api/customer"
import { toast } from "sonner"
import type { RegisterFormValues } from "@/features/auth/types"

export const RegisterPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useCustomerAuthStore()
  const [isPending, startTransition] = useTransition()

  if (isAuthenticated) {
    return <Navigate to={ROUTES.home} replace />
  }

  const handleSubmit = (data: RegisterFormValues) => {
    startTransition(async () => {
      try {
        const res = await customerApi.register({
          full_name: data.full_name,
          email: data.email,
          phone: data.phone?.trim() || undefined,
          password: data.password,
        })

        if (res.success) {
          toast.success("Account created successfully! Please sign in.")
          navigate(ROUTES.login)
        } else {
          toast.error(res.message || "Failed to create account. Email may already be in use.")
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
              <div className="flex flex-col justify-center p-6 text-left md:p-8">
                {/* Header block */}
                <header className="mb-4 flex flex-col items-center gap-2 text-center">
                  <span className="text-xs font-semibold tracking-wider text-primary uppercase">Join the Atelier</span>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">Create your account</h1>
                  <p className="text-center font-sans text-xs text-balance text-muted-foreground">
                    Enter your email and credentials below to create your account
                  </p>
                </header>

                {/* Form */}
                <RegisterForm onSubmit={handleSubmit} isPending={isPending} />

                {/* Redirect Link */}
                <div className="mt-4 text-center">
                  <span className="text-xs text-muted-foreground">
                    Already have an account?{" "}
                    <Link to={ROUTES.login} className="font-bold text-primary hover:underline">
                      Sign In
                    </Link>
                  </span>
                </div>
              </div>

              {/* Image Side */}
              <div className="relative hidden bg-muted md:block">
                <img
                  src="/jiso.jpg"
                  alt="Register Atelier Cover"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
              </div>
            </CardContent>
          </Card>

          {/* Footer Notice */}
          <FieldDescription className="px-6 text-center text-xs">
            By clicking continue, you agree to our{" "}
            <Link to={ROUTES.terms} className="underline hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to={ROUTES.privacy} className="underline hover:text-primary">
              Privacy Policy
            </Link>
            .
          </FieldDescription>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
