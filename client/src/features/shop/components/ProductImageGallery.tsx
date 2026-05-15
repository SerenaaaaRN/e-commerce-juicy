import { useState, useEffect } from "react"
import { AspectRatio } from "@/components/ui/aspect-ratio"
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
  const displayImages = sortedImages.length > 0 ? sortedImages.map((img) => img.image_url) : [fallbackImage]

  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <div className="flex w-full flex-col gap-4 text-left">
      {/* Main High-Res Preview with Carousel */}
      <Carousel setApi={setApi} className="group relative w-full">
        <CarouselContent className="ml-0">
          {displayImages.map((imgUrl, index) => (
            <CarouselItem key={index} className="basis-full pl-0">
              <div className="relative w-full overflow-hidden rounded-md border border-foreground/5 bg-muted shadow-md select-none">
                <AspectRatio ratio={3 / 4}>
                  <img
                    src={imgUrl}
                    alt={`Product detail view ${index + 1}`}
                    className="size-full object-cover object-center"
                  />
                  {/* Editorial internal border frame */}
                  <div className="pointer-events-none absolute inset-4 border border-white/10 transition-all duration-300 group-hover:inset-5" />
                </AspectRatio>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Floating Prev/Next Buttons (only show when there's more than 1 image and on hover) */}
        {displayImages.length > 1 ? (
          <>
            <CarouselPrevious className="absolute top-1/2 left-4 size-9 -translate-y-1/2 cursor-pointer rounded-none border-none bg-background/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:bg-background" />
            <CarouselNext className="absolute top-1/2 right-4 size-9 -translate-y-1/2 cursor-pointer rounded-none border-none bg-background/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:bg-background" />
          </>
        ) : null}
      </Carousel>

      {/* Thumbnails strip */}
      {displayImages.length > 1 ? (
        <div className="flex scrollbar-thin gap-3 overflow-x-auto pb-1">
          {displayImages.map((imgUrl, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className="relative w-20 cursor-pointer overflow-hidden rounded-md border bg-muted transition-all hover:border-primary/50"
            >
              <AspectRatio ratio={3 / 4}>
                <img
                  src={imgUrl}
                  alt={`Detail thumbnail ${index + 1}`}
                  className="size-full object-cover object-center"
                />
                {current === index ? (
                  <div className="absolute inset-0 rounded-md border-2 border-primary bg-black/5" />
                ) : null}
              </AspectRatio>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default ProductImageGallery
