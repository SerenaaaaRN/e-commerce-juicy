import { Link, Navigate } from "react-router-dom"
import { useCustomerAuthStore } from "@/stores/customerAuthStore"
import { LoginForm } from "./components/LoginForm"
import { Card, CardContent } from "@/components/ui/card"

export const LoginPage = () => {
  const { isAuthenticated } = useCustomerAuthStore()

  // Redirect to homepage if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="container mx-auto flex min-h-[75vh] max-w-7xl items-center justify-center px-4 py-16">
      <Card className="border border-border/80 shadow-md w-full max-w-md">
        <CardContent className="p-8 flex flex-col gap-6 text-left">
          
          {/* Header block */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold tracking-wider text-primary uppercase">
              Juicy Storefront
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Customer Sign In
            </h1>
            <p className="text-xs text-muted-foreground font-sans">
              Enter your email and passcode credentials to view your profile and placed orders.
            </p>
          </div>

          {/* Form */}
          <LoginForm />

          {/* Register redirect */}
          <div className="text-center pt-2">
            <span className="text-xs text-muted-foreground font-medium">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-bold hover:underline">
                Create Account
              </Link>
            </span>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage
