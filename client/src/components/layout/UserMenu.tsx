import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ROUTES from "@/constants/paths"
import { cn } from "@/lib/utils"
import useCustomerAuthStore from "@/stores/customer-auth-store"
import { UserIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link } from "react-router-dom"
import { ICON_STROKE } from "./Navbar"

const UserMenu = ({ scrolled }: { scrolled: boolean }) => {
  const isAuthenticated = useCustomerAuthStore((s) => s.isAuthenticated)
  const customer = useCustomerAuthStore((s) => s.customer)
  const logout = useCustomerAuthStore((s) => s.logout)

  const triggerClass = cn(
    "hidden rounded-full p-2 transition-colors duration-500 hover:bg-muted lg:block",
    scrolled ? "text-foreground" : "text-foreground"
  )

  if (isAuthenticated) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className={triggerClass}>
            <HugeiconsIcon icon={UserIcon} className="h-5 w-5" strokeWidth={ICON_STROKE} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="mt-2 w-56">
          <div className="flex flex-col px-3 py-2 text-xs">
            <span className="truncate font-semibold">{customer?.full_name}</span>
            <span className="truncate text-muted-foreground">{customer?.email}</span>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to={ROUTES.profile} className="w-full cursor-pointer">
              Account Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={ROUTES.orders} className="w-full cursor-pointer">
              My Orders
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={logout}
            className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
          >
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={triggerClass}>
          <HugeiconsIcon icon={UserIcon} className="h-5 w-5" strokeWidth={ICON_STROKE} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mt-2 w-48">
        <DropdownMenuItem asChild>
          <Link to={ROUTES.login} className="w-full cursor-pointer">
            Log In
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={ROUTES.register} className="w-full cursor-pointer">
            Register
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
export { UserMenu }
