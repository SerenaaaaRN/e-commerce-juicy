import { useRouterState } from "@tanstack/react-router"
import { ReactLenis, useLenis } from "lenis/react"
import { useEffect, type ReactNode } from "react"

type SmoothScrollProps = {
  children: ReactNode
}

export const SmoothScroll = ({ children }: SmoothScrollProps) => {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const lenis = useLenis()

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true })
    }
  }, [pathname, lenis])

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      }}
    >
      {children}
    </ReactLenis>
  )
}

export default SmoothScroll
