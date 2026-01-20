import { LoginForm } from "@/modules/auth/components/login-form";

export default async function LoginPage(props: { searchParams: Promise<{ message: string }> }) {
  const searchParams = await props.searchParams;

  return (
    <div className="bg-gray-100 flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>

      {/* Tetap tampilkan pesan error jika ada */}
      {searchParams?.message && (
        <div className="fixed bottom-5 right-5 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg animate-in slide-in-from-bottom-5 z-50">
          {searchParams.message}
        </div>
      )}
    </div>
  );
}
