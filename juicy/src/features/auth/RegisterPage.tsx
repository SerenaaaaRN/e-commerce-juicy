import { Link, Navigate } from "react-router-dom"
import { useCustomerAuthStore } from "@/stores/customerAuthStore"
import { RegisterForm } from "./components/RegisterForm"
import { Card, CardContent } from "@/components/ui/card"

export const RegisterPage = () => {
  const { isAuthenticated } = useCustomerAuthStore()

  // Redirect to homepage if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="container mx-auto flex min-h-[85vh] max-w-7xl items-center justify-center px-4 py-16">
      <Card className="border border-border/80 shadow-md w-full max-w-md">
        <CardContent className="p-8 flex flex-col gap-6 text-left">
          
          {/* Header block */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold tracking-wider text-primary uppercase">
              Join the Atelier
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Create Account
            </h1>
            <p className="text-xs text-muted-foreground font-sans">
              Sign up today to track your shipping history and publish linen reviews.
            </p>
          </div>

          {/* Form */}
          <RegisterForm />

          {/* Login redirect */}
          <div className="text-center pt-2">
            <span className="text-xs text-muted-foreground font-medium">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-bold hover:underline">
                Sign In
              </Link>
            </span>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterPage
