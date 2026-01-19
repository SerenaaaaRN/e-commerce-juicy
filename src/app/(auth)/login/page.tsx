import { login, signup } from "./actions";

export default async function LoginPage(props: { searchParams: Promise<{ message: string }> }) {
  const searchParams = await props.searchParams; // <--- WAJIB DI NEXT.JS 15

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        {/* Kolom Login */}
        <div className="w-full md:w-1/2 p-8 md:border-r">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Masuk</h2>
          <form className="flex flex-col gap-4">
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="p-3 border rounded bg-gray-50 text-black"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="p-3 border rounded bg-gray-50 text-black"
            />
            <button formAction={login} className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700 font-semibold">
              Login
            </button>
          </form>
        </div>

        {/* Kolom Register */}
        <div className="w-full md:w-1/2 p-8 bg-gray-50">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Daftar Baru</h2>
          <form className="flex flex-col gap-4">
            <input
              name="fullName"
              type="text"
              placeholder="Nama Lengkap"
              required
              className="p-3 border rounded bg-white text-black"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="p-3 border rounded bg-white text-black"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="p-3 border rounded bg-white text-black"
            />
            <button
              formAction={signup}
              className="bg-green-600 text-white p-3 rounded hover:bg-green-700 font-semibold"
            >
              Daftar
            </button>
          </form>
        </div>
      </div>

      {/* Notifikasi Error/Success */}
      {searchParams?.message && (
        <div className="fixed bottom-5 right-5 bg-gray-800 text-white px-6 py-3 rounded shadow-lg animate-bounce z-50">
          {searchParams.message}
        </div>
      )}
    </div>
  );
}
