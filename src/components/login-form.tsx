import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/button";
import { Card, CardContent } from "@/components/atoms/card";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from "@/components/atoms/field";
import { Input } from "@/components/atoms/input";

// 1. Import Server Action Login
import { login } from "@/app/(auth)/login/actions";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* 2. Hubungkan Action ke Form */}
          <form action={login} className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">Login to your Juicy Store account</p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                {/* 3. Tambahkan name="email" agar terbaca di action.ts */}
                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                {/* 4. Tambahkan name="password" */}
                <Input id="password" name="password" type="password" required />
              </Field>
              <Field>
                <Button type="submit">Login</Button>
              </Field>

              {/* Bagian Social Login (Bisa di-hide dulu kalau belum aktif) */}
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <Field className="grid grid-cols-3 gap-4">
                {/* ... tombol social login biarkan saja ... */}
                <Button variant="outline" type="button" disabled>
                  Google
                </Button>
                <Button variant="outline" type="button" disabled>
                  Apple
                </Button>
                <Button variant="outline" type="button" disabled>
                  Meta
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Don&apos;t have an account?{" "}
                <a href="/register" className="text-blue-600 hover:underline">
                  Sign up
                </a>
              </FieldDescription>
            </FieldGroup>
          </form>

          {/* Gambar Dekorasi */}
          <div className="bg-muted relative hidden md:block">
            {/* Ganti src gambar dengan gambar sepatu/produk kamu biar relevan */}
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop"
              alt="Login Image"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
