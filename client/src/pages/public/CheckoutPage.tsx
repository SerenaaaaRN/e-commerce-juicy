import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { useCustomerAuthStore, type Address } from "@/stores/customerAuthStore";
import { useOrderStore } from "@/stores/orderStore";
import { Button } from "@/components/ui/button";
import Divider from "@/components/ui/Divider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { initLenis } from "@/lib/lenis";
import { toast } from "sonner";
import { Landmark, Truck, Wallet, ShieldCheck, Plus, Check } from "lucide-react";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getShippingFee = useCartStore((state) => state.getShippingFee);
  const getTotal = useCartStore((state) => state.getTotal);

  const { customer, addresses, addAddress } = useCustomerAuthStore();
  const placeOrder = useOrderStore((state) => state.placeOrder);

  // Smooth scroll
  const fetchCart = useCartStore((state) => state.fetchCart);
  const fetchAddresses = useCustomerAuthStore((state) => state.fetchAddresses);

  useEffect(() => {
    const lenis = initLenis();
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });
  }, []);

  useEffect(() => {
    fetchCart();
    if (customer) fetchAddresses();
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      toast.info("Your shopping bag is empty. Please add items before checking out.");
      navigate("/collection");
    }
  }, [cartItems, navigate]);

  // Auth redirect fallback helper
  useEffect(() => {
    if (!customer) {
      toast.info("Please login to proceed with your order.");
      navigate("/login?redirect=checkout");
    }
  }, [customer, navigate]);

  // Selected Address State
  const defaultAddress = useMemo(() => {
    return addresses.find((addr) => addr.is_default) || addresses[0] || null;
  }, [addresses]);

  const [selectedAddressId, setSelectedAddressId] = useState<string>(defaultAddress?.id || "");

  const selectedAddress = useMemo(() => {
    return addresses.find((addr) => addr.id === selectedAddressId) || defaultAddress;
  }, [addresses, selectedAddressId, defaultAddress]);

  // Inline shipping address form states
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newRecipient, setNewRecipient] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newLine, setNewLine] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newProvince, setNewProvince] = useState("");
  const [newPostal, setNewPostal] = useState("");
  const [newIsDefault, setNewIsDefault] = useState(false);

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel || !newRecipient || !newPhone || !newLine || !newCity || !newProvince || !newPostal) {
      toast.error("Please fill in all address fields.");
      return;
    }

    const added: Address = {
      id: `addr-${Math.random().toString(36).substring(2, 9)}`,
      label: newLabel,
      recipient_name: newRecipient,
      phone: newPhone,
      address_line: newLine,
      city: newCity,
      province: newProvince,
      postal_code: newPostal,
      is_default: newIsDefault,
    };

    addAddress(added);
    setSelectedAddressId(added.id);

    // Clear form states
    setNewLabel("");
    setNewRecipient("");
    setNewPhone("");
    setNewLine("");
    setNewCity("");
    setNewProvince("");
    setNewPostal("");
    setNewIsDefault(false);
    setShowAddressForm(false);
  };

  // Payment Method States
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [shippingNotes, setShippingNotes] = useState("");

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handlePlaceOrderSubmit = () => {
    if (!selectedAddress) {
      toast.error("Please select a shipping address.");
      return;
    }

    // Call order placing action (performs stock checks & decrement updates)
    const orderNumber = placeOrder(
      cartItems,
      selectedAddress,
      shippingNotes,
      paymentMethod
    );

    if (orderNumber) {
      // Clear shopping bag
      clearCart();
      toast.success("Order placed successfully! Thank you for shopping with Juicy.");
      // Redirect to Order tracking screen
      navigate(`/order-tracking/${orderNumber}`);
    }
  };

  return (
    <div className="bg-background min-h-screen py-12 sm:py-20 font-dm-sans text-soil transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-12 border-b border-sand/20 pb-6">
          <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta">
            Protected Checkout
          </span>
          <h1 className="font-playfair text-3xl sm:text-4xl font-normal text-soil mt-1">
            Complete Your Order
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Form entries (span 7) */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            
            {/* SECTION 1: SHIPPING ADDRESS */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h3 className="font-playfair text-xl font-normal text-soil">
                  1. Shipping Destination
                </h3>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="text-xs font-semibold text-terracotta hover:opacity-85 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="size-4" />
                  <span>{showAddressForm ? "Select Saved Address" : "Add New Address"}</span>
                </button>
              </div>

              {showAddressForm ? (
                /* Add New Address Form */
                <form onSubmit={handleAddNewAddress} className="border border-sand bg-cream/20 p-5 sm:p-6 rounded-[2px] flex flex-col gap-4">
                  <h4 className="font-playfair text-sm font-semibold text-soil uppercase tracking-wide">
                    New Destination Address
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-soil">
                        Label (e.g. Home, Office)
                      </label>
                      <Input
                        type="text"
                        placeholder="Home"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        required
                        className="h-10 text-xs bg-background"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-soil">
                        Recipient Name
                      </label>
                      <Input
                        type="text"
                        placeholder="Jane Doe"
                        value={newRecipient}
                        onChange={(e) => setNewRecipient(e.target.value)}
                        required
                        className="h-10 text-xs bg-background"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-soil">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        placeholder="+628..."
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        required
                        className="h-10 text-xs bg-background"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-soil">
                        Postal Code
                      </label>
                      <Input
                        type="text"
                        placeholder="12190"
                        value={newPostal}
                        onChange={(e) => setNewPostal(e.target.value)}
                        required
                        className="h-10 text-xs bg-background"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-soil">
                      Address Details
                    </label>
                    <Input
                      type="text"
                      placeholder="Jl. Sudirman No. 24, Apt 8A"
                      value={newLine}
                      onChange={(e) => setNewLine(e.target.value)}
                      required
                      className="h-10 text-xs bg-background"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-soil">
                        City
                      </label>
                      <Input
                        type="text"
                        placeholder="Jakarta Selatan"
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        required
                        className="h-10 text-xs bg-background"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-soil">
                        Province
                      </label>
                      <Input
                        type="text"
                        placeholder="DKI Jakarta"
                        value={newProvince}
                        onChange={(e) => setNewProvince(e.target.value)}
                        required
                        className="h-10 text-xs bg-background"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="newIsDefault"
                      checked={newIsDefault}
                      onChange={(e) => setNewIsDefault(e.target.checked)}
                      className="rounded-[2px] border-sand text-terracotta focus:ring-terracotta size-4"
                    />
                    <label htmlFor="newIsDefault" className="text-xs text-dust font-medium">
                      Set as default destination address
                    </label>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="w-fit text-[10px] uppercase tracking-widest font-bold mt-2 cursor-pointer"
                  >
                    Save Address
                  </Button>

                </form>
              ) : (
                /* Address Lists selector */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <button
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`text-left border p-5 rounded-[2px] flex flex-col gap-2 relative transition-all cursor-pointer ${
                          isSelected
                            ? "bg-chalk border-terracotta ring-1 ring-terracotta/40 scale-[1.01]"
                            : "bg-cream/20 border-sand/40 hover:border-dust"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-3 right-3 text-terracotta">
                            <Check className="size-4" />
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-soil">{addr.label}</span>
                          {addr.is_default && (
                            <span className="text-[9px] bg-terracotta-light text-terracotta font-semibold uppercase px-1.5 py-0.5 rounded-[2px]">
                              Default
                            </span>
                          )}
                        </div>
                        
                        <div className="text-[11px] text-dust leading-normal font-normal">
                          <p className="font-semibold text-soil">{addr.recipient_name} ({addr.phone})</p>
                          <p className="mt-1">{addr.address_line}</p>
                          <p>{addr.city}, {addr.province} {addr.postal_code}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* SECTION 2: SHIPPING NOTES */}
            <div className="flex flex-col gap-3">
              <h3 className="font-playfair text-xl font-normal text-soil">
                2. Shipping Notes (Optional)
              </h3>
              <Textarea
                placeholder="Instructions for courier (e.g. Leave with security, call upon arrival...)"
                value={shippingNotes}
                onChange={(e) => setShippingNotes(e.target.value)}
                className="bg-chalk min-h-[80px]"
              />
            </div>

            {/* SECTION 3: PAYMENT METHOD */}
            <div className="flex flex-col gap-4">
              <h3 className="font-playfair text-xl font-normal text-soil">
                3. Payment Method
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* COD Card */}
                <button
                  onClick={() => setPaymentMethod("cod")}
                  className={`border p-5 rounded-[2px] flex flex-col items-center justify-center text-center gap-3 cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "bg-chalk border-terracotta ring-1 ring-terracotta/40 scale-[1.01]"
                      : "bg-cream/20 border-sand/40 hover:border-dust"
                  }`}
                >
                  <Truck className="size-5 text-terracotta" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-soil">Cash on Delivery</span>
                    <span className="text-[9px] text-dust">Pay upon parcel arrival</span>
                  </div>
                </button>

                {/* Bank Transfer Card */}
                <button
                  onClick={() => setPaymentMethod("bank")}
                  className={`border p-5 rounded-[2px] flex flex-col items-center justify-center text-center gap-3 cursor-pointer transition-all ${
                    paymentMethod === "bank"
                      ? "bg-chalk border-terracotta ring-1 ring-terracotta/40 scale-[1.01]"
                      : "bg-cream/20 border-sand/40 hover:border-dust"
                  }`}
                >
                  <Landmark className="size-5 text-terracotta" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-soil">Bank Transfer</span>
                    <span className="text-[9px] text-dust">Virtual Account transfer</span>
                  </div>
                </button>

                {/* Credit Card Card */}
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`border p-5 rounded-[2px] flex flex-col items-center justify-center text-center gap-3 cursor-pointer transition-all ${
                    paymentMethod === "card"
                      ? "bg-chalk border-terracotta ring-1 ring-terracotta/40 scale-[1.01]"
                      : "bg-cream/20 border-sand/40 hover:border-dust"
                  }`}
                >
                  <Wallet className="size-5 text-terracotta" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-soil">Credit Card</span>
                    <span className="text-[9px] text-dust">Visa, Mastercard secure</span>
                  </div>
                </button>

              </div>
            </div>

          </div>

          {/* Right Column: Order Review (span 5) */}
          <div className="lg:col-span-5 bg-cream/35 border border-sand/30 p-6 sm:p-8 rounded-[2px] flex flex-col gap-6 lg:sticky lg:top-24 h-fit">
            <h3 className="font-playfair text-xl font-normal text-soil border-b border-sand/20 pb-3">
              Order Summary
            </h3>

            {/* List of items */}
            <div className="flex flex-col gap-4 max-h-[220px] overflow-y-auto pr-2 scrollbar-thin">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3 items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-cream overflow-hidden border border-sand/20 shrink-0 aspect-[3/4]">
                      <img src={item.image_url} alt={item.product_name} className="size-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-soil truncate max-w-[150px]">{item.product_name}</span>
                      <span className="text-[10px] text-dust">Qty: {item.quantity} / {item.variant_size}</span>
                    </div>
                  </div>
                  <span className="font-semibold text-soil">{formatPrice(item.subtotal)}</span>
                </div>
              ))}
            </div>

            <Divider className="my-1 border-sand/20" />

            <div className="flex flex-col gap-3.5 text-xs font-medium text-dust">
              <div className="flex justify-between">
                <span>Bag Subtotal</span>
                <span className="text-soil font-semibold">{formatPrice(getSubtotal())}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="text-soil font-semibold">
                  {getShippingFee() === 0 ? "Complimentary" : formatPrice(getShippingFee())}
                </span>
              </div>

              <Divider className="my-1 border-sand/20" />

              <div className="flex justify-between text-sm text-soil font-bold">
                <span>Grand Total</span>
                <span className="text-terracotta text-base">{formatPrice(getTotal())}</span>
              </div>
            </div>

            {/* Destination Address snapshot review */}
            {selectedAddress && (
              <div className="bg-chalk/50 p-4 border border-sand/20 text-[11px] leading-normal font-normal text-dust">
                <span className="font-bold text-soil uppercase tracking-wider block mb-1">
                  Deliver to:
                </span>
                <p className="font-semibold text-soil">{selectedAddress.recipient_name} ({selectedAddress.phone})</p>
                <p>{selectedAddress.address_line}</p>
                <p>{selectedAddress.city}, {selectedAddress.province}</p>
              </div>
            )}

            {/* Place Order Action */}
            <Button
              onClick={handlePlaceOrderSubmit}
              variant="primary"
              size="default"
              className="w-full uppercase tracking-widest text-[11px] font-bold h-12 flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <ShieldCheck className="size-4" />
              <span>Authorize Payment & Place Order</span>
            </Button>

            <p className="text-[9px] text-dust text-center leading-normal max-w-xs mx-auto">
              By authorizing, you agree to our Terms of Purchase. Standard shipping times range between 2 to 4 working days.
            </p>

          </div>

        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
