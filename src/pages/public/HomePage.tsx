import { useEffect } from "react";
import HeroSection from "@/components/sections/HeroSection";
import CollectionPreview from "@/components/sections/CollectionPreview";
import FeaturedSection from "@/components/sections/FeaturedSection";
import EditorialSection from "@/components/sections/EditorialSection";
import CtaSection from "@/components/sections/CtaSection";
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
      <EditorialSection />
      <FeaturedSection />
      <CtaSection />
    </div>
  );
};

export default HomePage;
