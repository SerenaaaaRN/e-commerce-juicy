import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ROUTES } from "@/constants/paths"
import { adminApi } from "@/lib/api"
import { cn } from "@/lib/utils"
import { useAdminAuthStore } from "@/stores/admin-auth-store"
import {
  ArrowDown01Icon,
  ArrowLeft01Icon,
  DashboardBrowsingIcon,
  DeliveryTruck02Icon,
  ShoppingBag01Icon,
  StarIcon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"

const menuItems = [
  {
    name: "Dashboard",
    path: ROUTES.adminDashboard,
    icon: () => <HugeiconsIcon icon={DashboardBrowsingIcon} />,
  },
  {
    name: "Products",
    path: ROUTES.adminProducts,
    icon: () => <HugeiconsIcon icon={ShoppingBag01Icon} />,
  },
  {
    name: "Orders",
    path: ROUTES.adminOrders,
    icon: () => <HugeiconsIcon icon={DeliveryTruck02Icon} />,
  },
  {
    name: "Customers",
    path: ROUTES.adminCustomers,
    icon: () => <HugeiconsIcon icon={UserIcon} />,
  },
  {
    name: "Reviews",
    path: ROUTES.adminReviews,
    icon: () => <HugeiconsIcon icon={StarIcon} />,
  },
]

export const AdminLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { admin, logout } = useAdminAuthStore()

  const handleLogout = async () => {
    try {
      await adminApi.logout()
    } catch {
      // Proceed with local logout even if API call fails
    }
    logout()
    toast.success("Logged out from admin console.")
    navigate(ROUTES.adminLogin)
  }

  const activePath = location.pathname

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-screen overflow-hidden bg-background">
        {/* Admin Navigation Sidebar */}
        <Sidebar collapsible="icon" className="border-r border-border">
          {/* Header section */}
          <SidebarHeader className="flex h-12 items-center justify-center border-b border-border px-6 transition-all duration-200 group-data-[collapsible=icon]:p-2">
            <div className="flex items-center gap-3">
              <span className="font-heading text-lg font-extrabold tracking-[0.2em] text-primary group-data-[collapsible=icon]:hidden">
                JUICY
              </span>
            </div>
          </SidebarHeader>

          {/* Navigation items list */}
          <SidebarContent className="flex flex-col gap-2 px-3 py-4">
            <SidebarMenu>
              <Collapsible defaultOpen className="group/collapsible w-full">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild className="group-data-[collapsible=icon]:hidden">
                    <SidebarMenuButton className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase hover:bg-muted hover:text-foreground">
                      <span>Console Suite</span>
                      <HugeiconsIcon
                        icon={ArrowDown01Icon}
                        className="ml-auto size-3.5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180"
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-1">
                    <SidebarMenu className="pl-2 group-data-[collapsible=icon]:pl-0">
                      {menuItems.map((item) => {
                        const isActive = activePath === item.path
                        return (
                          <SidebarMenuItem key={item.path} className="mb-1">
                            <SidebarMenuButton
                              asChild
                              isActive={isActive}
                              tooltip={item.name}
                              className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                  ? "bg-primary font-semibold text-primary-foreground"
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
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>

            <Separator className="my-4 bg-border" />
          </SidebarContent>

          {/* Sidebar Footer displaying authenticated user */}
          <SidebarFooter className="border-t border-border bg-sidebar-accent/30 p-4 transition-all duration-200 group-data-[collapsible=icon]:p-2">
            <SidebarMenuButton
              asChild
              tooltip="Back to Storefront"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Link to={ROUTES.home}>
                <HugeiconsIcon icon={ArrowLeft01Icon} />
                <span>Back to Store</span>
              </Link>
            </SidebarMenuButton>
            <div className="flex items-center justify-center gap-3">
              <div className="flex size-9 min-w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white uppercase">
                {admin?.name?.substring(0, 2) || "AD"}
              </div>
              <div className="flex flex-1 flex-col truncate text-left group-data-[collapsible=icon]:hidden">
                <span className="truncate text-xs font-semibold text-foreground">{admin?.name || "Administrator"}</span>
                <span className="truncate text-[10px] text-muted-foreground">{admin?.email}</span>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Dynamic page contents body canvas */}
        <SidebarInset className="flex flex-1 flex-col overflow-hidden bg-background">
          {/* Admin Header */}
          <header className="flex h-12 min-h-12 items-center justify-between border-b border-border bg-card px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-4 bg-border" />
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <span className="font-semibold text-foreground capitalize">
                  {activePath.split("/").filter(Boolean)[1] || "Dashboard"}
                </span>
              </div>
            </div>

            {/* Admin control buttons */}
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8 cursor-pointer rounded-full hover:bg-muted">
                    <HugeiconsIcon icon={UserIcon} strokeWidth={1.8} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="mt-2 w-56">
                  <div className="flex flex-col px-3 py-2 text-xs">
                    <span className="truncate font-semibold text-foreground">{admin?.name}</span>
                    <span className="truncate text-muted-foreground">{admin?.email}</span>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                  >
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
