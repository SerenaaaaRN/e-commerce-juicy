import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useProductStore } from "@/stores/productStore";
import { useCartStore } from "@/stores/cartStore";
import StarRating from "@/features/shop/StarRating";
import { Button } from "@/components/ui/button";
import Divider from "@/components/ui/Divider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { initLenis } from "@/lib/lenis";
import { toast } from "sonner";
import { ShieldCheck, Truck, RefreshCw } from "lucide-react";

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { products, fetchProducts } = useProductStore();

  // Smooth scroll
  useEffect(() => {
    const lenis = initLenis();
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });
  }, [slug]);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Find product from store
  const product = useMemo(() => {
    return products.find((p) => p.slug === slug);
  }, [products, slug]);

  // Add to cart store hook
  const addItem = useCartStore((state) => state.addItem);

  // Gallery states
  const [activeImage, setActiveImage] = useState(product?.primary_image || "");

  // Variant selections
  const [selectedColor, setSelectedColor] = useState<string>(product?.variants[0]?.color || "");
  const [selectedSize, setSelectedSize] = useState<"XS" | "S" | "M" | "L">("S");
  const [quantity, setQuantity] = useState(1);

  // Filter sizes based on selected color
  const colorVariants = useMemo(() => {
    if (!product) return [];
    return product.variants.filter((v) => v.color === selectedColor);
  }, [product, selectedColor]);

  // Active selected variant
  const activeVariant = useMemo(() => {
    if (!product) return undefined;
    return product.variants.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    );
  }, [product, selectedColor, selectedSize]);

  // Unique colors in variants
  const uniqueColors = useMemo(() => {
    if (!product) return [];
    const seen = new Set();
    return product.variants.filter((v) => {
      const duplicate = seen.has(v.color);
      seen.add(v.color);
      return !duplicate;
    });
  }, [product]);

  // Review states
  const [reviews, setReviews] = useState(product?.reviews || []);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewBody, setReviewBody] = useState("");

  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1));
  }, [reviews]);

  if (!product) {
    return (
      <div className="text-center py-32 font-dm-sans">
        <span className="font-playfair text-2xl text-soil">Garment Not Found</span>
        <p className="text-xs text-dust mt-2">The requested silhouette does not exist in our atelier.</p>
        <Link to="/collection" className="text-xs font-semibold text-terracotta uppercase tracking-widest mt-6 block">
          &larr; Return to Catalog
        </Link>
      </div>
    );
  }

  // Handlers

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    const variants = product.variants.filter((v) => v.color === color);
    if (variants.length > 0) {
      const firstAvailable = variants.find((v) => v.stock > 0);
      setSelectedSize(firstAvailable ? firstAvailable.size : variants[0].size as "XS" | "S" | "M" | "L");
    }
  };

  const handleSizeChange = (size: "XS" | "S" | "M" | "L") => {
    setSelectedSize(size);
  };

  // Quantity controllers
  const handleQuantityIncrease = () => {
    if (!activeVariant) return;
    if (quantity < activeVariant.stock) {
      setQuantity(quantity + 1);
    } else {
      toast.warning(`Only ${activeVariant.stock} item(s) available in stock.`);
    }
  };

  const handleQuantityDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = async () => {
    if (!activeVariant || !product) return;
    if (activeVariant.stock === 0) {
      toast.error("This variant is currently out of stock.");
      return;
    }
    const success = await addItem(product, activeVariant, quantity);
    if (success) {
      setQuantity(1);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewName.trim() === "" || reviewBody.trim() === "") {
      toast.error("Please fill all fields for your review.");
      return;
    }

    const newReview = {
      id: `rev-${Math.random().toString(36).substring(2, 9)}`,
      rating: reviewRating,
      body: reviewBody,
      customer_name: reviewName,
      created_at: new Date().toISOString().slice(0, 10),
    };

    setReviews([newReview, ...reviews]);

    toast.success("Thank you! Your review has been added.");

    setReviewName("");
    setReviewRating(5);
    setReviewBody("");
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-background min-h-screen py-10 sm:py-16 font-dm-sans text-soil transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="text-[11px] font-semibold uppercase tracking-wider text-dust mb-8 flex items-center gap-2 select-none">
          <Link to="/" className="hover:text-terracotta">Home</Link>
          <span>/</span>
          <Link to="/collection" className="hover:text-terracotta">Catalog</Link>
          <span>/</span>
          <Link to={`/collection?category=${product.category.slug}`} className="hover:text-terracotta">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-soil">{product.name}</span>
        </nav>

        {/* PDP Main layout: Two unequal columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left: Gallery columns (span 7) */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-4 sm:gap-6">
            
            {/* Thumbnails (vertical left) */}
            {product.images.length > 1 && (
              <div className="flex md:flex-col order-2 md:order-1 gap-3 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none shrink-0">
                {product.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(img.image_url)}
                    className={`relative w-16 sm:w-20 aspect-[3/4] bg-cream border-2 overflow-hidden cursor-pointer shrink-0 transition-all ${
                      activeImage === img.image_url ? "border-terracotta" : "border-transparent"
                    }`}
                  >
                    <img
                      src={img.image_url}
                      alt={img.alt_text}
                      className="size-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Primary Display image */}
            <div className="order-1 md:order-2 flex-1 aspect-[3/4] relative overflow-hidden bg-cream border border-sand/15">
              <img
                src={activeImage}
                alt={product.name}
                className="size-full object-cover transition-all duration-300"
              />
            </div>

          </div>

          {/* Right: Buy Box / Detail info (span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-24 h-fit">
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-terracotta">
                  Atelier Collection
                </span>
                {activeVariant && activeVariant.stock > 0 && activeVariant.stock <= 3 && (
                  <span className="text-[10px] bg-terracotta-light text-terracotta font-semibold uppercase px-2 py-0.5 rounded-[2px] tracking-wide animate-pulse">
                    Only {activeVariant.stock} Left!
                  </span>
                )}
              </div>
              
              <h1 className="font-playfair text-3xl sm:text-4xl font-normal text-soil leading-tight">
                {product.name}
              </h1>

              {/* Price block */}
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-xl font-bold text-terracotta">
                  {formatPrice(product.price)}
                </span>
                {product.compare_at_price && (
                  <span className="text-sm text-sand line-through">
                    {formatPrice(product.compare_at_price)}
                  </span>
                )}
              </div>

              {/* Ratings summary banner */}
              {avgRating > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <StarRating rating={avgRating} starClassName="size-3.5" />
                  <span className="text-xs text-soil font-semibold">
                    {avgRating}
                  </span>
                  <span className="text-xs text-dust">
                    ({reviews.length} Client Reviews)
                  </span>
                </div>
              )}
            </div>

            <Divider className="my-1" />

            {/* Description narrative */}
            <p className="text-xs text-dust leading-relaxed font-normal">
              {product.description}
            </p>

            {/* SWATCH SELECTION */}
            <div className="flex flex-col gap-5 mt-2">
              
              {/* Color Swatch */}
              {uniqueColors.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-soil">
                    Color: <span className="text-dust font-normal">{selectedColor}</span>
                  </span>
                  <div className="flex items-center gap-3">
                    {uniqueColors.map((v) => {
                      const isActive = v.color === selectedColor;
                      return (
                        <button
                          key={v.id}
                          onClick={() => handleColorChange(v.color)}
                          className={`size-8 rounded-full border flex items-center justify-center cursor-pointer transition-all ${
                            isActive ? "border-terracotta ring-1 ring-terracotta/40 scale-105" : "border-sand/40 hover:border-dust"
                          }`}
                          title={v.color}
                        >
                          <span
                            className="size-5 rounded-full shadow-inner"
                            style={{ backgroundColor: v.color_hex }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size Pills */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-soil">
                  Select Size
                </span>
                <div className="flex items-center gap-2.5">
                  {(["XS", "S", "M", "L"] as const).map((size) => {
                    const variantForSize = colorVariants.find((v) => v.size === size);
                    const isAvailable = variantForSize ? variantForSize.stock > 0 : false;
                    const isSelected = selectedSize === size;

                    return (
                      <button
                        key={size}
                        disabled={!variantForSize}
                        onClick={() => handleSizeChange(size)}
                        className={`h-11 px-5 text-xs font-semibold rounded-[2px] transition-all flex items-center justify-center min-w-[50px] ${
                          !variantForSize
                            ? "bg-cream/20 text-dust/20 cursor-not-allowed border border-sand/10 line-through"
                            : isSelected
                            ? "bg-soil text-chalk border border-transparent shadow-sm"
                            : isAvailable
                            ? "bg-transparent text-soil border border-sand hover:border-soil cursor-pointer"
                            : "bg-cream text-dust/40 cursor-pointer border border-dashed border-sand/40 opacity-70"
                        }`}
                      >
                        {size}
                        {variantForSize && !isAvailable && (
                          <span className="text-[8px] ml-1 opacity-60">(Out)</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Cart Buy Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mt-4">
              
              {/* Quantity Stepper */}
              {activeVariant && activeVariant.stock > 0 && (
                <div className="flex items-center justify-between border border-sand h-12 px-3 rounded-[2px] sm:w-[130px] select-none bg-chalk shrink-0">
                  <button
                    type="button"
                    onClick={handleQuantityDecrease}
                    className="text-dust hover:text-soil cursor-pointer font-bold text-sm"
                  >
                    &minus;
                  </button>
                  <span className="text-xs font-bold text-soil">{quantity}</span>
                  <button
                    type="button"
                    onClick={handleQuantityIncrease}
                    className="text-dust hover:text-soil cursor-pointer font-bold text-sm"
                  >
                    &#43;
                  </button>
                </div>
              )}

              {/* Add to Cart button */}
              <div className="flex-1">
                {activeVariant && activeVariant.stock > 0 ? (
                  <Button
                    onClick={handleAddToCart}
                    variant="primary"
                    size="default"
                    className="w-full font-bold uppercase tracking-widest text-[11px] h-12 cursor-pointer"
                  >
                    Add to Shopping Bag
                  </Button>
                ) : (
                  <Button
                    disabled
                    variant="sand"
                    size="default"
                    className="w-full text-[11px] font-bold uppercase h-12 opacity-50 cursor-not-allowed text-dust"
                  >
                    Sold Out
                  </Button>
                )}
              </div>

            </div>

            {/* Editorial Features Accordions (Static list for PDP elegance) */}
            <div className="flex flex-col gap-4 mt-4 border-t border-sand/30 pt-6 text-xs text-dust">
              <div className="flex items-center gap-2">
                <Truck className="size-4 text-terracotta shrink-0" />
                <span>Complimentary premium shipping for orders above IDR 2.000.000</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="size-4 text-terracotta shrink-0" />
                <span>Hassle-free 14 days exchange and return privilege</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-terracotta shrink-0" />
                <span>100% Genuine Atelier garments with certification card</span>
              </div>
            </div>

          </div>

        </div>

        {/* REVIEW SECTION BLOCK */}
        <div className="mt-24 border-t border-sand/40 pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Review Summary & distribution statistics */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta">
                  Client Feedback
                </span>
                <h3 className="font-playfair text-3xl font-normal text-soil">
                  Atelier Reviews
                </h3>
              </div>

              <div className="bg-cream/50 border border-sand/30 p-6 rounded-[2px] flex flex-col items-center justify-center text-center">
                <span className="text-5xl font-playfair font-normal text-soil">
                  {avgRating}
                </span>
                <StarRating rating={avgRating} className="my-2" starClassName="size-4" />
                <span className="text-xs text-dust">
                  Based on {reviews.length} feedback submissions
                </span>
              </div>
            </div>

            {/* Right Column: Review list & Write feedback form */}
            <div className="lg:col-span-8 flex flex-col gap-10">
              
              {/* Form trigger box */}
              <div className="border border-sand/30 bg-chalk p-6 rounded-[2px] flex flex-col gap-4">
                <h4 className="font-playfair text-lg font-normal text-soil leading-none">
                  Share Your Experience
                </h4>
                
                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-soil">
                        Your Name
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g. Charlotte"
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        required
                        className="h-10 text-xs bg-background"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-soil">
                        Rating Selection
                      </label>
                      <div className="h-10 flex items-center">
                        <StarRating
                          rating={reviewRating}
                          interactive
                          onRatingChange={setReviewRating}
                          starClassName="size-5"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-soil">
                      Feedback Body
                    </label>
                    <Textarea
                      placeholder="Write your thoughts about the fabric, sizing, and design..."
                      value={reviewBody}
                      onChange={(e) => setReviewBody(e.target.value)}
                      required
                      className="min-h-[80px] text-xs bg-background"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="w-fit text-[10px] tracking-[0.08em] font-semibold uppercase h-10 px-6 cursor-pointer"
                  >
                    Submit Review
                  </Button>
                </form>
              </div>

              {/* List of reviews */}
              <div className="flex flex-col gap-6">
                <h4 className="font-playfair text-lg font-bold text-soil border-b border-sand/20 pb-2">
                  Client Submissions ({reviews.length})
                </h4>
                
                {reviews.length > 0 ? (
                  <div className="flex flex-col gap-6">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="flex flex-col gap-2 pb-6 border-b border-sand/20">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-soil">{rev.customer_name}</span>
                          <span className="text-[10px] text-dust">{rev.created_at}</span>
                        </div>
                        <StarRating rating={rev.rating} starClassName="size-3" />
                        <p className="text-xs text-dust leading-relaxed mt-1 font-normal">
                          {rev.body}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-xs text-dust">
                    Be the first to review this atelier silhouette.
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductPage;
