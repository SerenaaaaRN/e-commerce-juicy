import { ReactLenis } from "lenis/react"
import type { ReactNode } from "react"

type SmoothScrollProps = {
  children: ReactNode
}

export const SmoothScroll = ({ children }: SmoothScrollProps) => {
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
