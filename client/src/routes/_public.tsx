import { BottomNav } from "@/components/layout/BottomNav"
import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"
import { SmoothScroll } from "@/components/layout/SmoothScroll"
import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router"

const HIDE_NAV_FOOTER = new Set<string>(["/login", "/register"])

const PublicLayout = () => {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const showNavFooter = !HIDE_NAV_FOOTER.has(pathname)

  return (
    <SmoothScroll>
      {showNavFooter ? <Navbar /> : null}

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

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
})