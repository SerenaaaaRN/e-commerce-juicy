import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { useAdminAuthStore } from "@/stores/adminAuthStore"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarProvider,
  SidebarInset,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ShoppingBag01Icon,
  UserIcon,
  StarIcon,
  ArrowLeft01Icon,
  DeliveryTruck02Icon,
} from "@hugeicons/core-free-icons"
import { toast } from "sonner"

export const AdminLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { admin, logout } = useAdminAuthStore()

  const handleLogout = () => {
    logout()
    toast.success("Logged out from admin console.")
    navigate("/admin/login")
  }

  // Admin menu links
  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: () => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4"
        >
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
      ),
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: () => <HugeiconsIcon icon={ShoppingBag01Icon} />,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: () => <HugeiconsIcon icon={DeliveryTruck02Icon} />,
    },
    {
      name: "Customers",
      path: "/admin/customers",
      icon: () => <HugeiconsIcon icon={UserIcon} />,
    },
    {
      name: "Reviews",
      path: "/admin/reviews",
      icon: () => <HugeiconsIcon icon={StarIcon} />,
    },
  ]

  const activePath = location.pathname

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-screen overflow-hidden bg-background">
        
        {/* Admin Navigation Sidebar */}
        <Sidebar collapsible="icon" className="border-r border-border">
          
          {/* Header section */}
          <SidebarHeader className="h-16 flex items-center justify-between px-6 border-b border-border">
            <div className="flex items-center gap-3">
              <span className="font-heading font-extrabold text-lg tracking-[0.2em] text-primary">
                JUICY
              </span>
              <span className="text-[10px] font-bold tracking-widest uppercase bg-primary/10 text-primary px-2 py-0.5 rounded">
                Console
              </span>
            </div>
          </SidebarHeader>

          {/* Navigation items list */}
          <SidebarContent className="py-6 px-3 flex flex-col gap-2">
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = activePath === item.path
                return (
                  <SidebarMenuItem key={item.path} className="mb-1">
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.name}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Link to={item.path}>
                        {item.icon()}
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>

            <Separator className="my-4 bg-border" />

            {/* Back to main storefront link */}
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Back to Storefront"
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground rounded-md transition-colors"
                >
                  <Link to="/">
                    <HugeiconsIcon icon={ArrowLeft01Icon} />
                    <span>Back to Store</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          {/* Sidebar Footer displaying authenticated user */}
          <SidebarFooter className="p-4 border-t border-border bg-sidebar-accent/30">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-white uppercase">
                {admin?.name?.substring(0, 2) || "AD"}
              </div>
              <div className="flex flex-col text-left truncate flex-1">
                <span className="text-xs font-semibold text-foreground truncate">
                  {admin?.name || "Administrator"}
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  {admin?.email}
                </span>
              </div>
            </div>
          </SidebarFooter>

        </Sidebar>

        {/* Dynamic page contents body canvas */}
        <SidebarInset className="flex-1 flex flex-col overflow-hidden bg-background">
          
          {/* Admin Header */}
          <header className="h-16 min-h-16 flex items-center justify-between px-6 border-b border-border bg-card">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-4 bg-border" />
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <span className="capitalize font-semibold text-foreground">
                  {activePath.split("/").filter(Boolean)[1] || "Dashboard"}
                </span>
              </div>
            </div>

            {/* Admin control buttons */}
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted size-8 cursor-pointer">
                    <HugeiconsIcon icon={UserIcon} strokeWidth={1.8} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <div className="flex flex-col px-3 py-2 text-xs">
                    <span className="font-semibold text-foreground truncate">
                      {admin?.name}
                    </span>
                    <span className="text-muted-foreground truncate">
                      {admin?.email}
                    </span>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                    Sign Out Console
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main workspace container */}
          <main className="flex-1 overflow-y-auto bg-background p-6">
            <Outlet />
          </main>

        </SidebarInset>

      </div>
    </SidebarProvider>
  )
}

export default AdminLayout
