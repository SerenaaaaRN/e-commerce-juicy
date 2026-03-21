import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, Receipt, Users, Star, LogOut, X } from "lucide-react";
import { useAdminAuthStore } from "@/stores/adminAuthStore";

type SidebarProps = {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
};

type NavItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: ShoppingBag },
  { label: "Orders", href: "/admin/orders", icon: Receipt },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
];

const Sidebar = ({ mobileOpen, setMobileOpen }: SidebarProps) => {
  const { pathname } = useLocation();
  const logout = useAdminAuthStore((state) => state.logout);

  const sidebarContent = (
    <div className="flex h-full flex-col bg-cream border-r border-sand/40 font-dm-sans text-soil">
      <div className="flex h-20 items-center justify-between border-b border-sand/30 px-6">
        <Link
          to="/admin"
          className="font-playfair text-xl font-bold tracking-[0.2em]"
          onClick={() => setMobileOpen(false)}
        >
          JUICY STAFF
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="p-1 md:hidden hover:text-terracotta transition-colors"
        >
          <X className="size-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 text-xs font-semibold tracking-wider uppercase transition-all duration-300 rounded-[2px] ${isActive
                ? "bg-sand/30 text-terracotta font-bold"
                : "hover:bg-sand/15 text-soil/80 hover:text-soil"
                }`}
            >
              <Icon className="size-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sand/30 p-4">
        <button
          onClick={() => {
            setMobileOpen(false);
            logout();
          }}
          className="flex w-full items-center gap-3 px-4 py-3 text-xs font-semibold tracking-wider uppercase transition-all duration-300 rounded-[2px] text-dust hover:bg-sand/15 hover:text-terracotta cursor-pointer"
        >
          <LogOut className="size-4" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden h-screen w-64 md:block md:fixed md:inset-y-0">
        {sidebarContent}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-soil/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-cream transition-transform duration-300">
            {sidebarContent}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Sidebar;
