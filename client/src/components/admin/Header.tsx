import { Menu, Search, User } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAdminAuthStore } from "@/stores/adminAuthStore";

type HeaderProps = {
  setMobileOpen: (open: boolean) => void;
};

const getBreadcrumbs = (pathname: string) => {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length <= 1) return "Dashboard Overview";
  return parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
};

const Header = ({ setMobileOpen }: HeaderProps) => {
  const { pathname } = useLocation();
  const admin = useAdminAuthStore((state) => state.admin);

  return (
    <header className="flex h-20 items-center justify-between border-b border-sand/40 bg-chalk px-6 font-dm-sans text-soil">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1 md:hidden hover:text-terracotta transition-colors"
          aria-label="Open Sidebar"
        >
          <Menu className="size-5" />
        </button>

        <h1 className="hidden text-xs font-bold tracking-widest uppercase sm:block md:text-sm">
          {getBreadcrumbs(pathname)}
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden w-48 lg:block">
          <input
            type="text"
            placeholder="Search catalog..."
            className="w-full bg-cream border border-sand/50 rounded-xs py-1.5 pl-8 pr-3 text-xs tracking-wide placeholder:text-dust/50 focus:outline-none focus:border-terracotta transition-all"
          />
          <Search className="absolute left-2.5 top-2.5 size-3.5 text-dust/60" />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-sand/35 text-xs font-bold text-soil border border-sand/50">
              <User className="size-4 text-soil" />
            </div>
            <div className="hidden flex-col text-left sm:flex">
              <span className="text-xs font-bold leading-tight">{admin?.username || "Staff"}</span>
              <span className="text-[10px] text-dust/80">{admin?.email || "admin@juicy.com"}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
