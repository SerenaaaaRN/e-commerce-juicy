import Link from "next/link";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";

export function HeroSection() {
  return (
    <section
      className="bg-gray-600 py-12 md:py-24 lg:py-32"
      style={{
        backgroundImage: "url('https://4kwallpapers.com/images/walls/thumbs_3t/20034.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container flex flex-col items-center text-center gap-4 mx-auto px-4">
        <Badge className="px-3 py-1 text-sm" variant="secondary">
          New Collection 2026
        </Badge>
        <h1 className="text-3xl font-bold sm:text-5xl md:text-6xl tracking-tighter">
          Unleash Your Next <br className="hidden sm:inline" />
          Adventure.
        </h1>
        <div className="flex gap-4 mt-4">
          <Button size="lg" asChild>
            <Link href="/products">Browse Collection</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
