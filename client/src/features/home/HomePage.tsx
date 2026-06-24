import { Suspense, lazy } from "react"
import { HeroSection } from "./components/HeroSection"
import { PromoStrip } from "./components/PromoStrip"

const ArtisanStorytelling = lazy(() => import("./components/ArtisanStorytelling").then(mod => ({ default: mod.ArtisanStorytelling })))
const CollectionGrid = lazy(() => import("./components/CollectionGrid").then(mod => ({ default: mod.CollectionGrid })))
const HeritageSection = lazy(() => import("./components/Heritage").then(mod => ({ default: mod.HeritageSection })))

export const HomePage = () => {
  return (
    <div className="flex w-full flex-col">
      <HeroSection />
      <PromoStrip />
      <Suspense fallback={<div className="h-96" />}>
        <ArtisanStorytelling />
        <CollectionGrid />
        <HeritageSection />
      </Suspense>
    </div>
  )
}

export default HomePage
