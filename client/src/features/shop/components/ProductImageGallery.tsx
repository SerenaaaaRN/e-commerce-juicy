import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import type { ProductImage } from "@/types"

type ProductImageGalleryProps = {
  images: ProductImage[]
  fallbackImage: string
}

export const ProductImageGallery = ({ images, fallbackImage }: ProductImageGalleryProps) => {
  // Sort images by display_order
  const sortedImages = [...images].sort((a, b) => a.display_order - b.display_order)
  const displayImages = sortedImages.length > 0 ? sortedImages.map((img) => img.image_url) : [fallbackImage]

  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      {/* Thumbnails rail - vertical on desktop, horizontal on mobile */}
      {displayImages.length > 1 ? (
        <div className="scrollbar-thin flex gap-3 overflow-x-auto pb-2 md:flex-col md:overflow-x-visible md:pb-0">
          {displayImages.map((imgUrl, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative h-24 w-20 shrink-0 cursor-pointer overflow-hidden transition-all duration-300 md:h-28 md:w-20 ${
                activeIndex === index ? "ring-1 ring-foreground" : "opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={imgUrl}
                alt={`Detail thumbnail ${index + 1}`}
                loading="lazy"
                className="absolute inset-0 size-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}

      {/* Main Image View */}
      <div className="relative flex-1 overflow-hidden bg-muted aspect-[3/4]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <img
              src={displayImages[activeIndex]}
              alt="Product detail view"
              className="absolute inset-0 size-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ProductImageGallery
