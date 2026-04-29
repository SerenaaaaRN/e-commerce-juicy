import { HeroSection } from "./components/HeroSection"
import { PromoStrip } from "./components/PromoStrip"
import { FeaturedSection } from "./components/FeaturedSection"
import { TrendingNow } from "./components/TrendingNow"
import { NewArrivals } from "./components/NewArrivals"
import { WhyJuicy } from "./components/WhyJuicy"
import { RecentlyViewedSection } from "./components/RecentlyViewedSection"
import { NewsletterSection } from "./components/NewsletterSection"
import { EditorialSection } from "./components/EditorialSection"
import { CtaSection } from "./components/CtaSection"

export const HomePage = () => {
  return (
    <div className="flex w-full flex-col">
      <HeroSection />
      <PromoStrip />
      <EditorialSection />
      <FeaturedSection />
      <TrendingNow />
      <NewArrivals />
      <WhyJuicy />
      <RecentlyViewedSection />
      <NewsletterSection />
      <CtaSection />
    </div>
  )
}

export default HomePage
