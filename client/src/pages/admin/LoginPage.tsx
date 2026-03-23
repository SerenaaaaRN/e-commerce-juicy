import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuthStore } from "@/stores/adminAuthStore";
import { ArrowRight, Lock, Mail } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("admin@juicy.com");
  const [password, setPassword] = useState("adminpassword");
  const [loading, setLoading] = useState(false);
  
  const login = useAdminAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const success = await login(email, password);
    setLoading(false);
    
    if (success) {
      navigate("/admin");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-chalk px-4 py-12 font-dm-sans text-soil select-none sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 border border-sand/40 bg-cream p-8 sm:p-12 rounded-[2px] shadow-xs">
        <div className="text-center">
          <h2 className="font-playfair text-3xl font-bold tracking-[0.2em]">
            JUICY
          </h2>
          <p className="mt-2 text-xs font-semibold tracking-widest text-dust uppercase">
            Administrative Access
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-[11px] font-semibold tracking-wider text-soil uppercase mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xs border border-sand/50 bg-chalk py-3 pl-10 pr-3 text-xs tracking-wide text-soil placeholder:text-dust/40 focus:border-terracotta focus:outline-none transition-colors"
                  placeholder="admin@juicy.com"
                />
                <Mail className="absolute left-3 top-3.5 size-4 text-dust/60" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[11px] font-semibold tracking-wider text-soil uppercase mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xs border border-sand/50 bg-chalk py-3 pl-10 pr-3 text-xs tracking-wide text-soil placeholder:text-dust/40 focus:border-terracotta focus:outline-none transition-colors"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-3.5 size-4 text-dust/60" />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center border-0 bg-terracotta px-4 py-3.5 text-xs font-semibold tracking-widest text-chalk uppercase hover:bg-[#9a5230] focus:outline-none transition-all duration-300 rounded-xs cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span>{loading ? "Authorizing..." : "Sign In"}</span>
              <ArrowRight className="absolute right-4 top-3.5 size-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
