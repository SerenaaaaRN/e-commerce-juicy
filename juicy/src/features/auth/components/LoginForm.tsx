import { useTransition } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field"
import { useCustomerAuthStore } from "@/stores/customerAuthStore"
import { customerApi } from "@/lib/api/customer"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export const LoginForm = () => {
  const navigate = useNavigate()
  const { login } = useCustomerAuthStore()
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

  const onSubmit = (data: LoginFormValues) => {
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
        toast.error("Failed to authenticate. Please check your credentials.")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="text-left w-full">
      <FieldGroup className="gap-6">
        
        {/* Email Field */}
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">Email Address</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </Field>

        {/* Password Field */}
        <Field data-invalid={!!errors.password}>
          <div className="flex justify-between items-center w-full">
            <FieldLabel htmlFor="password">Password</FieldLabel>
          </div>
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

        {/* Action Trigger */}
        <Button
          type="submit"
          disabled={isPending}
          size="lg"
          className="w-full mt-2 font-medium uppercase tracking-widest text-xs py-6 h-auto cursor-pointer"
        >
          {isPending && <Spinner data-icon="inline-start" />}
          {isPending ? "Authenticating..." : "Sign In to Account"}
        </Button>

      </FieldGroup>
    </form>
  )
}

export default LoginForm
