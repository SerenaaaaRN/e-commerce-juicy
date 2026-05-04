import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator, FieldError } from "@/components/ui/field"
import { registerSchema } from "@/features/auth/validations"
import type { RegisterFormValues } from "@/features/auth/types"
import { HugeiconsIcon } from "@hugeicons/react"
import { Apple, GoogleIcon } from "@hugeicons/core-free-icons"

type RegisterFormProps = {
  onSubmit: (data: RegisterFormValues) => void
  isPending?: boolean
} & Omit<React.ComponentPropsWithoutRef<"form">, "onSubmit">

export const RegisterForm = ({ onSubmit, isPending = false, className, ...props }: RegisterFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("w-full text-left", className)} {...props}>
      <FieldGroup className="gap-4">
        {/* Name Field */}
        <Field data-invalid={!!errors.full_name}>
          <FieldLabel htmlFor="full_name">Full Name</FieldLabel>
          <Input
            id="full_name"
            placeholder="John Doe"
            autoComplete="name"
            aria-invalid={!!errors.full_name}
            {...register("full_name")}
          />
          {errors.full_name && <FieldError>{errors.full_name.message}</FieldError>}
        </Field>

        {/* Email Field */}
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email ? (
            <FieldError>{errors.email.message}</FieldError>
          ) : (
            <FieldDescription>
              We&apos;ll use this to contact you. We will not share your email with anyone else.
            </FieldDescription>
          )}
        </Field>

        {/* Phone Field */}
        <Field data-invalid={!!errors.phone}>
          <FieldLabel htmlFor="phone">Phone Number (Optional)</FieldLabel>
          <Input
            id="phone"
            type="tel"
            placeholder="e.g. +62812345678"
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
          {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
        </Field>

        {/* Password & Confirm Password side-by-side inside split grid */}
        <Field>
          <div className="grid grid-cols-2 gap-4">
            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              {errors.password && <FieldError>{errors.password.message}</FieldError>}
            </Field>
            <Field data-invalid={!!errors.confirmPassword}>
              <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && <FieldError>{errors.confirmPassword.message}</FieldError>}
            </Field>
          </div>
          {!errors.password && !errors.confirmPassword && (
            <FieldDescription className="mt-2">Must be at least 8 characters long.</FieldDescription>
          )}
        </Field>

        {/* Submit Button */}
        <Field className="mt-2">
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending && <Spinner data-icon="inline-start" />}
            {isPending ? "Creating Account..." : "Create Account"}
          </Button>
        </Field>

        {/* OAuth Separator */}
        <FieldSeparator className="text-xs text-muted-foreground *:data-[slot=field-separator-content]:bg-card">
          Or continue with
        </FieldSeparator>

        {/* Apple, Google,2-column OAuth Buttons exactly matching reference */}
        <Field className="grid grid-cols-2 gap-4">
          <Button variant="outline" type="button">
            <HugeiconsIcon icon={Apple} />
            <span className="sr-only">Sign up with Apple</span>
          </Button>
          <Button variant="outline" type="button">
            <HugeiconsIcon icon={GoogleIcon} />
            <span className="sr-only">Sign up with Google</span>
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

export default RegisterForm
