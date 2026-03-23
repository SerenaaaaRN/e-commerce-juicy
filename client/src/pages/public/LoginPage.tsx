import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCustomerAuthStore } from "@/stores/customerAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { initLenis } from "@/lib/lenis";
import { toast } from "sonner";

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register, customer } = useCustomerAuthStore();

  const redirectPath = searchParams.get("redirect") || "/profile";

  // Smooth scroll
  useEffect(() => {
    const lenis = initLenis();
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (customer) {
      navigate(redirectPath);
    }
  }, [customer, navigate, redirectPath]);

  const [isRegister, setIsRegister] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      if (!fullName || !email || !phone || !password) {
        toast.error("Please fill in all registration fields.");
        return;
      }
      const success = await register(fullName, email, phone, password);
      if (success) {
        navigate(redirectPath);
      }
    } else {
      if (!email || !password) {
        toast.error("Please fill in both email and password.");
        return;
      }
      const success = await login(email, password);
      if (success) {
        navigate(redirectPath);
      }
    }
  };

  return (
    <div className="bg-background min-h-screen py-16 sm:py-24 font-dm-sans text-soil flex items-center justify-center transition-all duration-300">
      <div className="w-full max-w-[420px] mx-auto px-4 sm:px-6">
        
        {/* Logo display */}
        <div className="text-center mb-8 flex flex-col gap-2">
          <span className="font-playfair text-3xl font-bold tracking-[0.25em] text-soil select-none">
            J U I C Y
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-dust">
            Atelier Customer Portal
          </span>
        </div>

        {/* Tab triggers */}
        <div className="flex border-b border-sand/30 mb-8 text-xs font-semibold uppercase tracking-widest text-center">
          <button
            onClick={() => setIsRegister(false)}
            className={`w-1/2 py-3 border-b-2 transition-all cursor-pointer ${
              !isRegister
                ? "border-terracotta text-soil font-bold"
                : "border-transparent text-dust hover:text-soil"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsRegister(true)}
            className={`w-1/2 py-3 border-b-2 transition-all cursor-pointer ${
              isRegister
                ? "border-terracotta text-soil font-bold"
                : "border-transparent text-dust hover:text-soil"
            }`}
          >
            Register
          </button>
        </div>

        {/* Auth form card */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-cream/20 border border-sand/35 p-6 sm:p-8 rounded-[2px]">
          
          <h3 className="font-playfair text-xl font-normal text-soil leading-none mb-2">
            {isRegister ? "Create Customer Profile" : "Access Customer Profile"}
          </h3>

          {isRegister && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-soil">
                Full Name
              </label>
              <Input
                type="text"
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="h-10 text-xs bg-background"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-soil">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-10 text-xs bg-background"
            />
          </div>

          {isRegister && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-soil">
                Phone Number
              </label>
              <Input
                type="tel"
                placeholder="+628..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="h-10 text-xs bg-background"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-soil">
              Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-10 text-xs bg-background"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="default"
            className="w-full text-[11px] uppercase tracking-widest font-bold h-11 cursor-pointer mt-2"
          >
            {isRegister ? "Create Profile" : "Access Profile"}
          </Button>

          {/* Quick info credentials helper for demo ease */}
          {!isRegister && (
            <div className="mt-4 border-t border-sand/20 pt-4 text-[9px] text-dust font-normal leading-normal">
              <span className="font-semibold block mb-0.5 text-soil uppercase tracking-wider">
                Demo Credentials:
              </span>
              <p>Email: <code className="bg-cream px-1 py-0.5 rounded-[2px] text-soil font-semibold text-[8.5px]">jane@example.com</code></p>
              <p className="mt-0.5">Password: Any value (simulated check)</p>
            </div>
          )}

        </form>

      </div>
    </div>
  );
};

export default LoginPage;
