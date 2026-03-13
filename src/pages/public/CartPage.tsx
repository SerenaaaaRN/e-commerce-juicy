import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import Divider from "@/components/ui/Divider";
import { initLenis } from "@/lib/lenis";
import { ShoppingBag, Trash2, ArrowRight } from "lucide-react";

const CartPage = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getSubtotal, getShippingFee, getTotal } = useCartStore();

  useEffect(() => {
    const lenis = initLenis();
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });
  }, []);

  const subtotal = getSubtotal();
  const shippingFee = getShippingFee();
  const total = getTotal();

  // Free shipping thresholds
  const FREE_SHIPPING_LIMIT = 2000000;
  const progressToFree = Math.min((subtotal / FREE_SHIPPING_LIMIT) * 100, 100);
  const remainingForFree = FREE_SHIPPING_LIMIT - subtotal;

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("id-IDR", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Helper to fetch remaining stock for a variant
  const getVariantMaxStock = (productId: string, variantId: string) => {
    const product = MOCK_PRODUCTS.find((p) => p.id === productId);
    const variant = product?.variants.find((v) => v.id === variantId);
    return variant ? variant.stock : 10;
  };

  return (
    <div className="bg-background min-h-screen py-12 sm:py-20 font-dm-sans text-soil transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-12 border-b border-sand/20 pb-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta">
              Your Selections
            </span>
            <h1 className="font-playfair text-3xl sm:text-4xl font-normal text-soil mt-1">
              Shopping Bag
            </h1>
          </div>
          <Link
            to="/collection"
            className="text-xs font-semibold text-terracotta hover:opacity-85 uppercase tracking-widest"
          >
            &larr; Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          /* Empty Bag state */
          <div className="text-center py-24 flex flex-col items-center gap-6">
            <div className="size-16 rounded-full bg-cream flex items-center justify-center text-dust">
              <ShoppingBag className="size-6 stroke-[1.5]" />
            </div>
            <div>
              <h3 className="font-playfair text-xl font-normal text-soil">Your bag is empty</h3>
              <p className="text-xs text-dust max-w-xs mt-2 mx-auto">
                Discover our luxury tailored blazers, French linen robes, and statement hardware accessories.
              </p>
            </div>
            <Link
              to="/collection"
              className="inline-flex items-center justify-center h-12 px-8 bg-terracotta text-chalk text-xs font-bold uppercase tracking-widest hover:bg-[#9a5230] transition-colors rounded-[2px]"
            >
              Shop New Arrivals
            </Link>
          </div>
        ) : (
          /* Cart contents */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Items List (span 8) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Premium Free Shipping Progress Alert */}
              <div className="bg-cream/40 border border-sand/30 p-5 rounded-[2px] flex flex-col gap-3 font-normal text-xs text-soil">
                {subtotal >= FREE_SHIPPING_LIMIT ? (
                  <span className="font-semibold text-terracotta">
                    🎉 Excellent! You have unlocked Free Premium Shipping.
                  </span>
                ) : (
                  <span>
                    Add <span className="font-semibold text-terracotta">{formatPrice(remainingForFree)}</span> more to unlock <span className="font-semibold">Free Premium Shipping</span>.
                  </span>
                )}
                
                <div className="w-full h-1.5 bg-sand/20 overflow-hidden rounded-full">
                  <div
                    className="h-full bg-terracotta transition-all duration-500"
                    style={{ width: `${progressToFree}%` }}
                  />
                </div>
              </div>

              {/* Items Table */}
              <div className="flex flex-col gap-6 mt-4">
                {items.map((item) => {
                  const maxStock = getVariantMaxStock(item.product_id, item.variant_id);
                  return (
                    <div
                      key={item.id}
                      className="flex gap-4 sm:gap-6 pb-6 border-b border-sand/25 items-start sm:items-center justify-between"
                    >
                      {/* image aspect ratio 3/4 */}
                      <Link
                        to={`/product/${item.product_slug}`}
                        className="w-20 sm:w-24 aspect-[3/4] overflow-hidden bg-cream border border-sand/15 shrink-0"
                      >
                        <img
                          src={item.image_url}
                          alt={item.product_name}
                          className="size-full object-cover"
                        />
                      </Link>

                      {/* Detail Column */}
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        
                        {/* Name/swatches */}
                        <div className="flex flex-col gap-1 max-w-[200px]">
                          <Link
                            to={`/product/${item.product_slug}`}
                            className="font-playfair text-base sm:text-lg font-normal text-soil hover:text-terracotta transition-colors"
                          >
                            {item.product_name}
                          </Link>
                          <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-wide text-dust">
                            <span>Size: {item.variant_size}</span>
                            <span className="size-1 bg-sand/60 rounded-full" />
                            <span className="flex items-center gap-1">
                              Color:
                              <span
                                className="size-2.5 rounded-full inline-block border border-sand"
                                style={{ backgroundColor: item.variant_color_hex }}
                                title={item.variant_color}
                              />
                            </span>
                          </div>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-between border border-sand/50 h-10 px-3 rounded-[2px] w-[100px] select-none bg-chalk shrink-0">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1, maxStock)}
                              className="text-dust hover:text-soil cursor-pointer font-bold text-xs"
                            >
                              &minus;
                            </button>
                            <span className="text-xs font-bold text-soil">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1, maxStock)}
                              className="text-dust hover:text-soil cursor-pointer font-bold text-xs"
                            >
                              &#43;
                            </button>
                          </div>
                          
                          {/* Trash button */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-dust/60 hover:text-terracotta cursor-pointer transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right flex flex-col sm:items-end">
                          <span className="text-xs font-bold text-soil">
                            {formatPrice(item.subtotal)}
                          </span>
                          <span className="text-[10px] text-dust font-normal">
                            {formatPrice(item.unit_price)} each
                          </span>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Right Column: Order Summary (span 4) */}
            <div className="lg:col-span-4 bg-cream/35 border border-sand/30 p-6 sm:p-8 rounded-[2px] flex flex-col gap-6">
              <h3 className="font-playfair text-xl font-normal text-soil border-b border-sand/20 pb-3">
                Order Summary
              </h3>

              <div className="flex flex-col gap-4 text-xs font-medium text-dust">
                
                {/* Subtotal */}
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="text-soil font-semibold">{formatPrice(subtotal)}</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="text-soil font-semibold">
                    {shippingFee === 0 ? "Complimentary" : formatPrice(shippingFee)}
                  </span>
                </div>

                <Divider className="my-1 border-sand/20" />

                {/* Grand Total */}
                <div className="flex justify-between text-sm text-soil font-bold">
                  <span>Grand Total</span>
                  <span className="text-terracotta text-base">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Button
                onClick={() => navigate("/checkout")}
                variant="primary"
                size="default"
                className="w-full uppercase tracking-widest text-[11px] font-bold h-12 flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="size-4" />
              </Button>
              
              {/* Security info */}
              <p className="text-[10px] text-dust text-center leading-normal max-w-xs mx-auto">
                Secure checkout. Returns and exchanges within 14 days are subject to conditions.
              </p>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default CartPage;
