import { useState, useEffect } from "react"
import type { ProductImage } from "@/types"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel"

type ProductImageGalleryProps = {
  images: ProductImage[]
  fallbackImage: string
}

export const ProductImageGallery = ({ images, fallbackImage }: ProductImageGalleryProps) => {
  // Sort images by display_order
  const sortedImages = [...images].sort((a, b) => a.display_order - b.display_order)
  const displayImages = sortedImages.length > 0 ? sortedImages.map(img => img.image_url) : [fallbackImage]
  
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return

    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <div className="flex flex-col gap-4 w-full text-left">
      
      {/* Main High-Res Preview with Carousel */}
      <Carousel setApi={setApi} className="w-full relative group">
        <CarouselContent className="-ml-0">
          {displayImages.map((imgUrl, index) => (
            <CarouselItem key={index} className="pl-0 basis-full">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted shadow-md rounded-md select-none border border-foreground/5">
                <img
                  src={imgUrl}
                  alt={`Product detail view ${index + 1}`}
                  className="size-full object-cover object-center"
                />
                {/* Editorial internal border frame */}
                <div className="absolute inset-4 border border-white/10 pointer-events-none transition-all duration-300 group-hover:inset-5" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Floating Prev/Next Buttons (only show when there's more than 1 image and on hover) */}
        {displayImages.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/80 hover:bg-background border-none rounded-none size-9 cursor-pointer" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/80 hover:bg-background border-none rounded-none size-9 cursor-pointer" />
          </>
        )}
      </Carousel>

      {/* Thumbnails strip */}
      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
          {displayImages.map((imgUrl, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className="relative aspect-[3/4] w-20 overflow-hidden bg-muted cursor-pointer border hover:border-primary/50 transition-all rounded-md"
            >
              <img
                src={imgUrl}
                alt={`Detail thumbnail ${index + 1}`}
                className="size-full object-cover object-center"
              />
              {current === index && (
                <div className="absolute inset-0 bg-black/5 border-2 border-primary rounded-md" />
              )}
            </button>
          ))}
        </div>
      )}

    </div>
  )
}

export default ProductImageGallery
