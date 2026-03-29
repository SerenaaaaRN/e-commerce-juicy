import { useEffect } from "react";
import HeroSection from "@/components/sections/HeroSection";
import CollectionPreview from "@/components/sections/CollectionPreview";
import FeaturedSection from "@/components/sections/FeaturedSection";
import EditorialSection from "@/components/sections/EditorialSection";
import CtaSection from "@/components/sections/CtaSection";
import { DioramaSection } from "@/components/animations/DioramaSection";
import { initLenis } from "@/lib/lenis";

const HomePage = () => {
  useEffect(() => {
    // Initialize Lenis smooth scroll on mount
    const lenis = initLenis();

    // Scroll to top when arriving on Home
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });

    return () => {
      // Clean up ticker or destroy if needed (handled in our lenis module singleton)
    };
  }, []);

  return (
    <div className="bg-background min-h-screen transition-all duration-300">
      <HeroSection />
      <CollectionPreview />
      <DioramaSection
        subtitle="Provence Campaign"
        title="Sculpted silhouettes, made to move."
        description="A capsule conceived between Paris and southern France, using 100% organic flax fibers and clay wash processes to deliver a heavy, beautiful architectural drape that feels completely weightless on the body."
        foregroundImg="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
        backgroundImg="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
        ctaText="Acquire Silhouette"
        ctaHref="/collection"
      />
      <EditorialSection />
      <FeaturedSection />
      <CtaSection />
    </div>
  );
};

export default HomePage;
