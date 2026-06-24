import { ArtisanStorytelling } from "./components/ArtisanStorytelling"
import { CollectionGrid } from "./components/CollectionGrid"
import { HeritageSection } from "./components/Heritage"
import { HeroSection } from "./components/HeroSection"
import { PromoStrip } from "./components/PromoStrip"

export const HomePage = () => {
  return (
    <div className="flex w-full flex-col">
      <HeroSection />
      <PromoStrip />
      <ArtisanStorytelling />
      <CollectionGrid />
      <HeritageSection />
    </div>
  )
}

export default HomePage
