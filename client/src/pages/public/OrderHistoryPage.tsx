import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useOrderStore } from "@/stores/orderStore";
import { useCustomerAuthStore } from "@/stores/customerAuthStore";
import * as customerApi from "@/lib/api/customer";
import type { OrderDetail } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { initLenis } from "@/lib/lenis";
import { toast } from "sonner";
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  MessageSquare,
  Star,
  X,
} from "lucide-react";

type ReviewModalState = {
  isOpen: boolean;
  orderId: string;
  productId: string;
  productName: string;
  imageUrl: string | null;
};

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const { customer } = useCustomerAuthStore();
  const { orders, loading, fetchOrders } = useOrderStore();

  const [orderDetails, setOrderDetails] = useState<Record<string, OrderDetail>>({});
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const [loadingDetails, setLoadingDetails] = useState<Record<string, boolean>>({});
  
  const [reviewModal, setReviewModal] = useState<ReviewModalState>({
    isOpen: false,
    orderId: "",
    productId: "",
    productName: "",
    imageUrl: null,
  });
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewBody, setReviewBody] = useState<string>("");
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);

  // Smooth scroll
  useEffect(() => {
    const lenis = initLenis();
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });
  }, []);

  useEffect(() => {
    if (customer) {
      fetchOrders();
    } else {
      navigate("/login");
    }
  }, [customer, navigate, fetchOrders]);

  const toggleExpandOrder = async (orderNumber: string) => {
    const isExpanded = !!expandedOrders[orderNumber];
    
    // Toggle state
    setExpandedOrders((prev) => ({ ...prev, [orderNumber]: !isExpanded }));

    // If expanding and not loaded yet, fetch details from backend
    if (!isExpanded && !orderDetails[orderNumber]) {
      setLoadingDetails((prev) => ({ ...prev, [orderNumber]: true }));
      try {
        const detail = await customerApi.getOrderDetail(orderNumber);
        setOrderDetails((prev) => ({ ...prev, [orderNumber]: detail }));
      } catch (err) {
        console.error(err);
        toast.error(`Failed to fetch details for order ${orderNumber}`);
        // Revert expand state
        setExpandedOrders((prev) => ({ ...prev, [orderNumber]: false }));
      } finally {
        setLoadingDetails((prev) => ({ ...prev, [orderNumber]: false }));
      }
    }
  };

  const handleOpenReviewModal = (
    orderId: string,
    productId: string,
    productName: string,
    imageUrl: string | null
  ) => {
    setReviewModal({
      isOpen: true,
      orderId,
      productId,
      productName,
      imageUrl,
    });
    setRating(5);
    setReviewBody("");
  };

  const handleCloseReviewModal = () => {
    setReviewModal({
      isOpen: false,
      orderId: "",
      productId: "",
      productName: "",
      imageUrl: null,
    });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      toast.error("Please select a rating between 1 and 5 stars.");
      return;
    }

    setSubmittingReview(true);
    try {
      await customerApi.submitReview({
        product_id: reviewModal.productId,
        order_id: reviewModal.orderId,
        rating: rating,
        body: reviewBody || null,
      });
      toast.success("Thank you! Your verified purchase review has been submitted.");
      handleCloseReviewModal();
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error?.message || "Failed to submit review.";
      toast.error(errorMsg);
    } finally {
      setSubmittingReview(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-dust bg-cream border border-sand/30 px-2 py-0.5 rounded-[2px]">
            <Clock className="size-3" />
            <span>Pending</span>
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-soil bg-sand/30 border border-sand/65 px-2 py-0.5 rounded-[2px]">
            <Clock className="size-3 animate-pulse" />
            <span>Processing</span>
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-terracotta bg-terracotta-light/20 border border-terracotta/30 px-2 py-0.5 rounded-[2px]">
            <Truck className="size-3" />
            <span>Shipped</span>
          </span>
        );
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-[#3d5e4b] bg-[#eef6f1] border border-[#a2cbaf]/35 px-2 py-0.5 rounded-[2px]">
            <CheckCircle className="size-3" />
            <span>Delivered</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-dust bg-cream px-2 py-0.5 rounded-[2px]">
            <AlertCircle className="size-3" />
            <span>{status}</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-background min-h-screen py-12 sm:py-20 font-dm-sans text-soil transition-all duration-300">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Header */}
        <div className="mb-10">
          <Link
            to="/profile"
            className="inline-flex items-center gap-1.5 text-xs text-dust hover:text-soil transition-colors font-semibold uppercase tracking-wider mb-6"
          >
            <ArrowLeft className="size-4" />
            <span>Return to Profile</span>
          </Link>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta">
              Transaction History
            </span>
            <h1 className="font-playfair text-3xl sm:text-4xl font-normal text-soil mt-1">
              Chronology of Orders
            </h1>
            <p className="text-xs text-dust mt-1">
              Trace logistics, download receipts, and write verified purchase reviews for delivered articles.
            </p>
          </div>
        </div>

        {/* Content Container */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-sand border-t-terracotta" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-dust">
              Fetching orders timeline...
            </span>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-cream/10 border border-sand/35 p-8 rounded-[2px] flex flex-col items-center gap-4">
            <AlertCircle className="size-8 text-dust/60" />
            <div>
              <h3 className="font-playfair text-lg text-soil font-semibold">No transactions recorded</h3>
              <p className="text-xs text-dust mt-1">You have not completed any order checkout processes yet.</p>
            </div>
            <Link
              to="/collection"
              className="inline-flex items-center justify-center h-10 px-6 bg-soil hover:bg-soil/95 text-chalk text-[10px] font-bold uppercase tracking-widest transition-colors rounded-[2px] mt-2"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order) => {
              const isExpanded = !!expandedOrders[order.order_number];
              const isLoading = !!loadingDetails[order.order_number];
              const details = orderDetails[order.order_number];

              return (
                <div
                  key={order.id}
                  className="bg-cream/10 border border-sand/35 rounded-[2px] transition-all overflow-hidden flex flex-col"
                >
                  {/* Order Overview Header Header */}
                  <div
                    onClick={() => toggleExpandOrder(order.order_number)}
                    className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-cream/20 transition-colors select-none"
                  >
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-x-6 gap-y-2">
                      <div>
                        <span className="text-[9px] font-bold text-dust uppercase tracking-wider block">
                          Order Number
                        </span>
                        <span className="text-xs font-bold text-soil">{order.order_number}</span>
                      </div>
                      
                      <div>
                        <span className="text-[9px] font-bold text-dust uppercase tracking-wider block">
                          Purchase Date
                        </span>
                        <div className="flex items-center gap-1 text-xs text-soil">
                          <Calendar className="size-3.5 text-dust" />
                          <span>{formatDate(order.created_at)}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[9px] font-bold text-dust uppercase tracking-wider block">
                          Articles Count
                        </span>
                        <span className="text-xs text-soil font-medium">{order.item_count} items</span>
                      </div>

                      <div>
                        <span className="text-[9px] font-bold text-dust uppercase tracking-wider block">
                          Grand Total
                        </span>
                        <span className="text-xs font-bold text-terracotta">{formatPrice(order.total)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t border-sand/15 pt-3 sm:pt-0 sm:border-0">
                      {getStatusBadge(order.status)}
                      
                      <div className="text-dust hover:text-soil shrink-0">
                        {isExpanded ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
                      </div>
                    </div>
                  </div>

                  {/* Collapsible Order Item Details */}
                  {isExpanded && (
                    <div className="border-t border-sand/30 bg-cream/5 px-5 py-6 sm:px-6 flex flex-col gap-6 animate-fade-in">
                      
                      {isLoading ? (
                        <div className="flex items-center justify-center py-8 gap-3">
                          <div className="size-4 animate-spin rounded-full border-2 border-sand border-t-terracotta" />
                          <span className="text-[10px] text-dust font-bold uppercase tracking-wider">
                            Retrieving snapshot logs...
                          </span>
                        </div>
                      ) : details ? (
                        <div className="flex flex-col gap-6">
                          
                          {/* Item Listing Table */}
                          <div className="flex flex-col gap-4 border-b border-sand/20 pb-6">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-dust block mb-2">
                              Items Snapshot
                            </span>
                            
                            {details.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-b border-sand/10 last:border-b-0"
                              >
                                <div className="flex items-center gap-4">
                                  {item.image_url ? (
                                    <img
                                      src={item.image_url}
                                      alt={item.product_name}
                                      className="size-16 object-cover bg-cream border border-sand/20 rounded-[2px]"
                                    />
                                  ) : (
                                    <div className="size-16 bg-cream border border-sand/20 rounded-[2px] flex items-center justify-center text-[10px] text-dust font-bold">
                                      No Image
                                    </div>
                                  )}
                                  
                                  <div className="flex flex-col">
                                    <span className="text-xs font-semibold text-soil">{item.product_name}</span>
                                    <span className="text-[10px] text-dust font-normal mt-0.5">
                                      Size: {item.variant_size} / Color: {item.variant_color}
                                    </span>
                                    <span className="text-[10px] text-soil font-semibold mt-1">
                                      {item.quantity} × {formatPrice(item.unit_price)}
                                    </span>
                                  </div>
                                </div>

                                {/* Review CTA / Shipment Link */}
                                <div className="flex items-center gap-3 sm:justify-end self-end sm:self-auto">
                                  {order.status.toLowerCase() === "delivered" && item.product_id ? (
                                    <button
                                      onClick={() =>
                                        handleOpenReviewModal(
                                          details.id,
                                          item.product_id!,
                                          item.product_name,
                                          item.image_url
                                        )
                                      }
                                      className="inline-flex items-center gap-1.5 h-8 px-4 bg-transparent border border-terracotta text-terracotta hover:bg-terracotta hover:text-chalk text-[9px] font-bold uppercase tracking-widest transition-all rounded-[2px] cursor-pointer"
                                    >
                                      <MessageSquare className="size-3.5" />
                                      <span>Write a Review</span>
                                    </button>
                                  ) : null}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Order Logistics and Details block */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start text-xs font-normal text-dust leading-relaxed">
                            
                            {/* Destination Address snapshot */}
                            <div>
                              <span className="text-[9px] font-bold uppercase tracking-wider text-dust block mb-2">
                                Shipping Destination
                              </span>
                              <p className="font-semibold text-soil">{details.address.recipient_name} ({details.address.phone})</p>
                              <p>{details.address.address_line}</p>
                              <p>{details.address.city}, {details.address.province} {details.address.postal_code}</p>
                            </div>

                            {/* Logistics info */}
                            <div className="flex flex-col gap-3">
                              <div>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-dust block mb-2">
                                  Payment Information
                                </span>
                                <p>Payment Method: <span className="font-bold text-soil uppercase tracking-wider">COD (Cash on Delivery)</span></p>
                                <p>Status: <span className="font-semibold text-soil uppercase">{details.payment_status}</span></p>
                              </div>

                              <div className="flex flex-wrap gap-2.5 pt-2">
                                <Link
                                  to={`/order-tracking/${order.order_number}`}
                                  className="inline-flex items-center justify-center gap-1.5 h-9 px-4 bg-soil hover:bg-soil/95 text-chalk text-[9px] font-bold uppercase tracking-widest transition-colors rounded-[2px]"
                                >
                                  <Truck className="size-3.5" />
                                  <span>Track Shipment Logistics</span>
                                </Link>
                              </div>
                            </div>

                          </div>

                        </div>
                      ) : (
                        <div className="text-center py-4 text-xs text-dust">
                          Failed to load snapshot details.
                        </div>
                      )}
                      
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* VERIFIED PURCHASE REVIEW INTERACTIVE MODAL */}
      {reviewModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-soil/70 backdrop-blur-[2px] transition-all duration-300 animate-fade-in">
          
          <div className="bg-background border border-sand max-w-lg w-full p-6 sm:p-8 rounded-[2px] relative flex flex-col gap-6 shadow-2xl animate-scale-up">
            
            {/* Modal Exit */}
            <button
              onClick={handleCloseReviewModal}
              className="absolute top-4 right-4 text-dust hover:text-soil transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>

            {/* Header info */}
            <div className="border-b border-sand/20 pb-4">
              <span className="text-[9px] font-bold uppercase tracking-wider text-terracotta">
                Verified Customer Feedback
              </span>
              <h3 className="font-playfair text-2xl font-normal text-soil mt-1">
                Write a Verified Review
              </h3>
            </div>

            {/* Product Thumbnail Review */}
            <div className="flex items-center gap-4 bg-cream/20 border border-sand/20 p-4 rounded-[2px]">
              {reviewModal.imageUrl ? (
                <img
                  src={reviewModal.imageUrl}
                  alt={reviewModal.productName}
                  className="size-16 object-cover bg-cream border border-sand/20 rounded-[2px]"
                />
              ) : (
                <div className="size-16 bg-cream border border-sand/20 rounded-[2px] flex items-center justify-center text-[10px] text-dust font-bold">
                  No Image
                </div>
              )}
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-dust block">
                  Purchased Article
                </span>
                <span className="text-xs font-semibold text-soil">{reviewModal.productName}</span>
              </div>
            </div>

            {/* Interactive Form */}
            <form onSubmit={handleReviewSubmit} className="flex flex-col gap-5">
              
              {/* Star rating picker */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-soil block">
                  Product Rating
                </label>
                
                <div className="flex items-center gap-2 mt-1">
                  {[1, 2, 3, 4, 5].map((index) => {
                    const active = index <= (hoverRating || rating);
                    return (
                      <button
                        key={index}
                        type="button"
                        onMouseEnter={() => setHoverRating(index)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(index)}
                        className="p-1 cursor-pointer transition-all duration-150 hover:scale-110"
                      >
                        <Star
                          className={`size-7 ${
                            active
                              ? "fill-terracotta text-terracotta"
                              : "text-sand fill-none"
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="text-[10px] font-bold uppercase tracking-wider text-dust ml-2">
                    {rating} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Text comment body */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-soil">
                  Review Commentary
                </label>
                <textarea
                  placeholder="Share your experience regarding sizing, fabric quality, and silhouette details..."
                  value={reviewBody}
                  onChange={(e) => setReviewBody(e.target.value)}
                  rows={4}
                  className="w-full bg-background border border-sand/50 rounded-[4px] p-3 text-xs focus:outline-none focus:border-terracotta transition-all resize-none text-soil"
                />
              </div>

              {/* Form buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-sand/20 pt-4 mt-2">
                <button
                  type="button"
                  onClick={handleCloseReviewModal}
                  className="h-10 px-5 border border-sand hover:border-soil text-[10px] uppercase font-bold text-dust hover:text-soil transition-colors cursor-pointer rounded-[2px]"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={submittingReview}
                  variant="primary"
                  size="sm"
                  className="h-10 text-[10px] uppercase tracking-widest font-bold cursor-pointer"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </Button>
              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default OrderHistoryPage;
