import { useState } from "react"
import type { ProductImage } from "@/types"

type ProductImageGalleryProps = {
  images: ProductImage[]
  fallbackImage: string
}

export const ProductImageGallery = ({ images, fallbackImage }: ProductImageGalleryProps) => {
  // Sort images by display_order
  const sortedImages = [...images].sort((a, b) => a.display_order - b.display_order)
  const displayImages = sortedImages.length > 0 ? sortedImages.map(img => img.image_url) : [fallbackImage]
  
  const [activeImage, setActiveImage] = useState(displayImages[0])

  return (
    <div className="flex flex-col gap-4 w-full">
      
      {/* Main High-Res Preview */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted shadow-md rounded-none select-none group border border-foreground/5">
        <img
          src={activeImage}
          alt="Product details zoom"
          className="size-full object-cover object-center transition-all duration-[600ms] ease-out"
        />
        {/* Editorial internal border frame */}
        <div className="absolute inset-4 border border-white/10 pointer-events-none transition-all duration-300 group-hover:inset-5" />
      </div>

      {/* Thumbnails strip */}
      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
          {displayImages.map((imgUrl, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(imgUrl)}
              className="relative aspect-[3/4] w-20 overflow-hidden bg-muted cursor-pointer border hover:border-primary/50 transition-all rounded-none"
            >
              <img
                src={imgUrl}
                alt={`Detail thumbnail ${index + 1}`}
                className="size-full object-cover object-center"
              />
              {activeImage === imgUrl && (
                <div className="absolute inset-0 bg-black/10 border-2 border-primary" />
              )}
            </button>
          ))}
        </div>
      )}

    </div>
  )
}

export default ProductImageGallery
