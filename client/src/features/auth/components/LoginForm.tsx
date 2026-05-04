import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator, FieldError } from "@/components/ui/field"
import { HugeiconsIcon } from "@hugeicons/react"
import { AppleIcon, GoogleIcon } from "@hugeicons/core-free-icons"
import { loginSchema } from "@/features/auth/validations"
import type { LoginFormValues } from "@/features/auth/types"

type LoginFormProps = {
  onSubmit: (data: LoginFormValues) => void
  isPending?: boolean
  emailLabel?: string
  emailPlaceholder?: string
  passwordLabel?: string
  passwordPlaceholder?: string
  submitText?: string
  submittingText?: string
  showForgotPassword?: boolean
  forgotPasswordUrl?: string
  showSocialLogins?: boolean
  registerUrl?: string
  registerText?: string
} & Omit<React.ComponentPropsWithoutRef<"form">, "onSubmit">

export const LoginForm = ({
  onSubmit,
  isPending = false,
  emailLabel = "Email Address",
  emailPlaceholder = "you@example.com",
  passwordLabel = "Password",
  passwordPlaceholder = "••••••••",
  submitText = "Sign In to Account",
  submittingText = "Authenticating...",
  showForgotPassword = false,
  forgotPasswordUrl = "/forgot-password",
  showSocialLogins = false,
  registerUrl,
  className,
  ...props
}: LoginFormProps) => {
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("w-full text-left", className)} {...props}>
      <FieldGroup className="gap-4">
        {/* Email Field */}
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">{emailLabel}</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder={emailPlaceholder}
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </Field>

        {/* Password Field */}
        <Field data-invalid={!!errors.password}>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="password">{passwordLabel}</FieldLabel>
            {showForgotPassword && forgotPasswordUrl && (
              <Link
                to={forgotPasswordUrl}
                className="ml-auto text-xs text-muted-foreground underline-offset-2 hover:underline"
              >
                Forgot your password?
              </Link>
            )}
          </div>
          <Input
            id="password"
            type="password"
            placeholder={passwordPlaceholder}
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          {errors.password && <FieldError>{errors.password.message}</FieldError>}
        </Field>

        {/* Submit Button */}
        <Field className="mt-2">
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending && <Spinner data-icon="inline-start" />}
            {isPending ? submittingText : submitText}
          </Button>
        </Field>

        {/* OAuth Separator */}
        {showSocialLogins ? (
          <>
            <FieldSeparator className="text-xs text-muted-foreground *:data-[slot=field-separator-content]:bg-card">
              Or continue with
            </FieldSeparator>

            {/* OAuth Buttons */}
            <Field className="grid grid-cols-2 gap-4">
              <Button variant="outline" type="button" className="cursor-pointer">
                <HugeiconsIcon icon={AppleIcon} />
                <span className="sr-only">Login with Apple</span>
              </Button>
              <Button variant="outline" type="button" className="cursor-pointer">
                <HugeiconsIcon icon={GoogleIcon} />
                <span className="sr-only">Login with Google</span>
              </Button>
            </Field>
          </>
        ) : null}

        {/* Link to Register */}
        {registerUrl ? (
          <FieldDescription className="mt-2 text-center text-xs">
            Don&apos;t have an account?{" "}
            <Link to={registerUrl} className="font-bold text-primary hover:underline">
              Create Account
            </Link>
          </FieldDescription>
        ) : null}
      </FieldGroup>
    </form>
  )
}

export default LoginForm
