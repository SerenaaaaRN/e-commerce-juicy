import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useOrderStore } from "@/stores/orderStore";
import { Button } from "@/components/ui/button";
import Divider from "@/components/ui/Divider";
import { initLenis } from "@/lib/lenis";
import { toast } from "sonner";
import { Check, ClipboardList, Package, Truck, Home, Search, Star } from "lucide-react";

const OrderTrackingPage = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const getOrder = useOrderStore((state) => state.getOrder);
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);

  // Search input state if looking up a different order
  const [searchQuery, setSearchQuery] = useState("");
  const [currentOrderNumber, setCurrentOrderNumber] = useState(orderNumber || "");

  // Fetch target order
  const order = useMemo(() => {
    return getOrder(currentOrderNumber);
  }, [getOrder, currentOrderNumber]);

  // Smooth scroll
  useEffect(() => {
    const lenis = initLenis();
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });
  }, [currentOrderNumber]);

  // Update input when param changes
  useEffect(() => {
    if (orderNumber) {
      setCurrentOrderNumber(orderNumber);
    }
  }, [orderNumber]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentOrderNumber(searchQuery.trim());
      setSearchQuery("");
    } else {
      toast.error("Please enter a valid order number.");
    }
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("id-IDR", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Define steps
  const steps = [
    { key: "pending", title: "Order Placed", desc: "Awaiting confirmation and payment verification.", icon: ClipboardList },
    { key: "confirmed", title: "Order Confirmed", desc: "Your order is approved and locked for picking.", icon: Check },
    { key: "processing", title: "Atelier Packing", desc: "Silhouettes are wrapped in custom canvas packaging.", icon: Package },
    { key: "shipped", title: "In Transit", desc: "Dispatched via JNE Cargo Express (Tracking: JNE90284X)", icon: Truck },
    { key: "delivered", title: "Delivered", desc: "Garments arrived and accepted at destination address.", icon: Home },
  ] as const;

  const activeStepIdx = useMemo(() => {
    if (!order) return 0;
    const orderStatus = order.status;
    return steps.findIndex((step) => step.key === orderStatus);
  }, [order, steps]);

  return (
    <div className="bg-background min-h-screen py-12 sm:py-20 font-dm-sans text-soil transition-all duration-300">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
        
        {/* Lookup bar (Search other order) */}
        <form onSubmit={handleSearchSubmit} className="mb-12 flex gap-3 max-w-md mx-auto">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search Order Number (JUICY-YYYYMMDD-...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 bg-cream/30 border border-sand rounded-[2px] px-4 pr-10 font-dm-sans text-xs text-soil placeholder:text-dust/60 focus:border-terracotta focus:outline-none transition-colors"
            />
            <Search className="size-4 text-dust absolute right-3 top-3.5 pointer-events-none" />
          </div>
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="h-11 tracking-wider uppercase text-[10px] cursor-pointer"
          >
            Track
          </Button>
        </form>

        {!order ? (
          /* Order Not Found */
          <div className="text-center py-20 bg-cream/20 border border-sand/30 p-8 rounded-[2px]">
            <span className="font-playfair text-xl text-dust">No active tracking found</span>
            <p className="text-xs text-dust max-w-sm mx-auto mt-3 font-normal leading-relaxed">
              If you just placed an order, please search using your generated order number (e.g. `JUICY-20260520-X8F2B9`).
            </p>
            <Link
              to="/collection"
              className="inline-flex items-center justify-center h-11 px-6 bg-terracotta text-chalk text-[10px] font-semibold uppercase tracking-widest hover:bg-[#9a5230] transition-colors rounded-[2px] mt-6"
            >
              Return to Shop
            </Link>
          </div>
        ) : (
          /* Order Details & tracking progress */
          <div className="flex flex-col gap-10">
            
            {/* Header info card */}
            <div className="bg-cream/45 border border-sand/35 p-6 rounded-[2px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta">
                  Shipment Tracking
                </span>
                <h2 className="font-playfair text-2xl font-normal text-soil">
                  {order.order_number}
                </h2>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-dust mt-1">
                  <span>Placed on: {new Date(order.created_at).toLocaleDateString()}</span>
                  <span className="size-1 bg-sand/60 rounded-full hidden sm:inline" />
                  <span>Payment: {order.payment_method.toUpperCase()} ({order.payment_status.toUpperCase()})</span>
                </div>
              </div>

              <div className="shrink-0 flex flex-col sm:items-end gap-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-dust">
                  Status Indicator
                </span>
                <span className="px-3.5 py-1.5 bg-terracotta text-chalk rounded-[2px] text-xs font-bold uppercase tracking-wider leading-none shadow-sm">
                  {order.status}
                </span>
              </div>

            </div>

            {/* LIVE SIMULATOR DASHBOARD */}
            <div className="bg-chalk border border-terracotta/40 p-5 rounded-[2px] flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-terracotta animate-ping" />
                <h4 className="font-playfair text-sm font-semibold text-soil uppercase tracking-wide">
                  Developer Live Simulation Panel
                </h4>
              </div>
              <p className="text-[11px] text-dust font-normal leading-normal">
                Use the toggles below to instantly cycle through shipping logistics and watch the vertical timeline updates and delivery hooks react immediately in real time.
              </p>
              <div className="flex flex-wrap gap-2.5 mt-1">
                {(["pending", "confirmed", "processing", "shipped", "delivered"] as const).map((status) => {
                  const isActive = order.status === status;
                  return (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(order.id, status)}
                      className={`h-9 px-4 text-[10px] font-bold uppercase rounded-[2px] cursor-pointer transition-all ${
                        isActive
                          ? "bg-terracotta text-chalk border border-transparent shadow-sm scale-102"
                          : "bg-transparent text-dust border border-sand hover:border-soil"
                      }`}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PDP REVIEW TRIGGER (SHOWN ONLY IF DELIVERED) */}
            {order.status === "delivered" && (
              <div className="bg-[#b5633a]/5 border border-terracotta/30 p-6 rounded-[2px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 animate-fade-in">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-terracotta">
                    <Star className="size-4 fill-currentColor" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Feedback Invitation
                    </span>
                  </div>
                  <h4 className="font-playfair text-lg font-normal text-soil leading-tight">
                    How are your silhouettes?
                  </h4>
                  <p className="text-xs text-dust max-w-md leading-relaxed font-normal">
                    Your order has arrived! Visit the product catalog page to submit review feedback and help other clients in our warm atelier.
                  </p>
                </div>
                
                {order.items[0] && (
                  <Link
                    to={`/product/${order.items[0].product_slug}`}
                    className="inline-flex items-center justify-center h-11 px-6 bg-soil text-chalk text-[10px] font-bold uppercase tracking-widest hover:bg-soil/95 transition-all shadow-sm rounded-[2px] shrink-0"
                  >
                    Leave Silhouette Review
                  </Link>
                )}
              </div>
            )}

            {/* PDP TRACKING TIMELINE */}
            <div className="bg-cream/15 border border-sand/20 p-6 sm:p-10 rounded-[2px]">
              <h3 className="font-playfair text-xl font-normal text-soil mb-10">
                Logistics Progress
              </h3>

              <div className="relative pl-6 sm:pl-10 flex flex-col gap-10">
                
                {/* Visual Line connector */}
                <div className="absolute left-[17px] sm:left-[25px] top-3 bottom-3 w-[1.5px] bg-sand/30" />
                
                {/* Steps mapping */}
                {steps.map((step, idx) => {
                  const isCompleted = idx <= activeStepIdx;
                  const isCurrent = idx === activeStepIdx;
                  const StepIcon = step.icon;

                  return (
                    <div
                      key={step.key}
                      className={`relative flex gap-6 items-start transition-all duration-300 ${
                        isCompleted ? "opacity-100" : "opacity-45"
                      }`}
                    >
                      {/* Visual Icon Node overlay */}
                      <div
                        className={`absolute -left-[30px] sm:-left-[42px] size-7 sm:size-9 rounded-full flex items-center justify-center border z-10 transition-all ${
                          isCurrent
                            ? "bg-terracotta border-transparent text-chalk shadow-md scale-110"
                            : isCompleted
                            ? "bg-cream border-terracotta text-terracotta"
                            : "bg-chalk border-sand text-dust"
                        }`}
                      >
                        <StepIcon className="size-3.5 sm:size-4 stroke-[2]" />
                      </div>

                      {/* Content block */}
                      <div className="flex-1 flex flex-col gap-1">
                        <span
                          className={`text-xs font-semibold uppercase tracking-wider ${
                            isCurrent ? "text-terracotta font-bold" : "text-soil"
                          }`}
                        >
                          {step.title}
                        </span>
                        <p className="text-xs text-dust leading-normal max-w-md font-normal">
                          {step.desc}
                        </p>
                        
                        {/* Fake timestamps for completion elements */}
                        {isCompleted && (
                          <span className="text-[9px] text-dust/60 font-semibold mt-0.5">
                            {idx === 0
                              ? new Date(order.created_at).toLocaleString()
                              : new Date(new Date(order.created_at).getTime() + idx * 4 * 3600 * 1000).toLocaleString()}
                          </span>
                        )}
                      </div>

                    </div>
                  );
                })}

              </div>
            </div>

            {/* ORDER ITEMS REVIEW */}
            <div className="bg-cream/15 border border-sand/20 p-6 rounded-[2px] flex flex-col gap-5">
              <h3 className="font-playfair text-lg font-normal text-soil border-b border-sand/20 pb-2">
                Garments Ordered
              </h3>
              
              <div className="flex flex-col gap-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-12 aspect-[3/4] bg-cream overflow-hidden border border-sand/20 shrink-0">
                        <img src={item.image_url} alt={item.product_name} className="size-full object-cover" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-soil">{item.product_name}</span>
                        <span className="text-[10px] text-dust">Qty: {item.quantity} / Size: {item.variant_size} / Color: {item.variant_color}</span>
                      </div>
                    </div>
                    <span className="font-bold text-soil">{formatPrice(item.unit_price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <Divider className="my-1 border-sand/20" />

              <div className="flex flex-col gap-2.5 text-xs text-dust font-medium">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Cargo Fee</span>
                  <span>{order.shipping_fee === 0 ? "Complimentary" : formatPrice(order.shipping_fee)}</span>
                </div>
                <div className="flex justify-between text-sm text-soil font-bold mt-1">
                  <span>Total Amount Paid</span>
                  <span className="text-terracotta">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default OrderTrackingPage;
