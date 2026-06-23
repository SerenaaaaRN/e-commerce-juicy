import { HeroSection } from "./components/HeroSection"
import { PromoStrip } from "./components/PromoStrip"
import { CollectionGrid } from "./components/CollectionGrid"
import { HeritageSection } from "./components/Heritage"

export const HomePage = () => {
  return (
    <div className="flex w-full flex-col">
      <HeroSection />
      <PromoStrip />
      <CollectionGrid />
      <HeritageSection />
    </div>
  )
}

export default HomePage
