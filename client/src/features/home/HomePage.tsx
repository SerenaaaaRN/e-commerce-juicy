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
    <div className="flex flex-col w-full animate-in fade-in duration-500">

      {/* High-fashion hero banner */}
      <HeroSection />

      {/* Flash sale promo strip */}
      <PromoStrip />
      <EditorialSection />

      {/* bestseller curated items */}
      <FeaturedSection />

      {/* trending products */}
      <TrendingNow />

      {/* new arrivals */}
      <NewArrivals />
     

      {/* why shop with us */}
      <WhyJuicy />

      {/* recently viewed items */}
      <RecentlyViewedSection />



      {/* newsletter signup */}
      <NewsletterSection />

      {/* campaign lookbook block */}
      

      {/* closing call-to-actions */}
      <CtaSection />

    </div>
  )
}

export default HomePage
