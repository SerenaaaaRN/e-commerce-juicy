import { HeroSection } from "./components/HeroSection"
import { FeaturedSection } from "./components/FeaturedSection"
import { CollectionPreview } from "./components/CollectionPreview"
import { EditorialSection } from "./components/EditorialSection"
import { CtaSection } from "./components/CtaSection"

export const HomePage = () => {
  return (
    <div className="flex flex-col w-full animate-in fade-in duration-500">
      
      {/* High-fashion hero banner */}
      <HeroSection />

      {/* bestseller curated items */}
      <FeaturedSection />

      {/* category filters previews */}
      <CollectionPreview />

      {/* campaign lookbook block */}
      <EditorialSection />

      {/* closing call-to-actions */}
      <CtaSection />
      
    </div>
  )
}

export default HomePage
