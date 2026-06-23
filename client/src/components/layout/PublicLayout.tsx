import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"
import { SmoothScroll } from "@/components/layout/SmoothScroll"
import { ROUTES } from "@/constants/paths"
import { Outlet, useLocation } from "react-router-dom"

const HIDE_NAV_FOOTER = new Set<string>([ROUTES.login, ROUTES.register])

export const PublicLayout = () => {
  const { pathname } = useLocation()
  const showNavFooter = !HIDE_NAV_FOOTER.has(pathname)

  return (
    <SmoothScroll>
      {showNavFooter ? <Navbar /> : null}
      <Outlet />
      {showNavFooter ? <Footer /> : null}
    </SmoothScroll>
  )
}
