import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"
import { BottomNav } from "@/components/layout/BottomNav"
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

      {/* Container untuk konten & footer agar tidak tertutup Bottom Nav di mobile */}
      <div className={showNavFooter ? "pb-[env(safe-area-inset-bottom,16px)] lg:pb-0" : ""}>
        <div className={showNavFooter ? "pb-16 lg:pb-0" : ""}>
          <Outlet />
          {showNavFooter ? <Footer /> : null}
        </div>
      </div>

      {showNavFooter ? <BottomNav /> : null}
    </SmoothScroll>
  )
}

