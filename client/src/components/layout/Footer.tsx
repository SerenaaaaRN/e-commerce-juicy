import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

const YEAR = new Date().getFullYear();

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Thank you for subscribing to our newsletter.");
      setEmail("");
    }
  };

  return (
    <footer className="bg-cream border-t border-sand/40 font-dm-sans text-soil mt-auto transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          {/* Column 1: Brand & Statement */}
          <div className="flex flex-col gap-6 md:col-span-1">
            <span className="font-playfair text-xl font-bold tracking-[0.2em] select-none">
              J U I C Y
            </span>
            <p className="text-xs text-dust leading-relaxed font-normal max-w-xs">
              Evoking a warm, sun-drenched luxury fashion experience through lightweight textures, warm off-white canvases, and terracotta hues. Inspired by the Mediterranean coast.
            </p>
          </div>

          {/* Column 2: Shop links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-soil">
              Collections
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-dust">
              <li>
                <Link to="/collection" className="hover:text-terracotta transition-colors duration-200">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/collection?category=dresses" className="hover:text-terracotta transition-colors duration-200">
                  Dresses & Robes
                </Link>
              </li>
              <li>
                <Link to="/collection?category=tops" className="hover:text-terracotta transition-colors duration-200">
                  Airy Tops
                </Link>
              </li>
              <li>
                <Link to="/collection?category=accessories" className="hover:text-terracotta transition-colors duration-200">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Support */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-soil">
              Client Service
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-dust">
              <li>
                <Link to="/profile" className="hover:text-terracotta transition-colors duration-200">
                  My Profile
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-terracotta transition-colors duration-200">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link to="/collection" className="hover:text-terracotta transition-colors duration-200">
                  Order Tracking
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-terracotta transition-colors duration-200">
                  Shipping & Returns
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-soil">
              Newsletter
            </h4>
            <p className="text-xs text-dust leading-relaxed font-normal">
              Subscribe to receive updates on new drops, private sales, and seasonal campaigns.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 text-xs bg-chalk border-sand focus:border-terracotta"
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="w-full text-[10px] tracking-[0.08em] font-semibold uppercase h-10 cursor-pointer"
              >
                Subscribe
              </Button>
            </form>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="border-t border-sand/30 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-dust tracking-wide">
          <span>&copy; {YEAR} JUICY Fashion. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-soil transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-soil transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-soil transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
