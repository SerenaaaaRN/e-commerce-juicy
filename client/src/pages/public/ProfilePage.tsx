import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCustomerAuthStore } from "@/stores/customerAuthStore";
import { useOrderStore } from "@/stores/orderStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { initLenis } from "@/lib/lenis";
import { toast } from "sonner";
import { Plus, Trash2, BookOpen, Clock, LogOut } from "lucide-react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { customer, addresses, addAddress, deleteAddress, setDefaultAddress, logout, fetchProfile, fetchAddresses } = useCustomerAuthStore();
  const orders = useOrderStore((state) => state.orders);
  const fetchOrders = useOrderStore((state) => state.fetchOrders);

  // Smooth scroll
  useEffect(() => {
    const lenis = initLenis();
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });
  }, []);

  useEffect(() => {
    if (customer) {
      fetchProfile();
      fetchAddresses();
      fetchOrders();
    }
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (!customer) {
      toast.info("Please sign in to access your dashboard.");
      navigate("/login");
    }
  }, [customer, navigate]);

  // Inline address form states
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [label, setLabel] = useState("");
  const [recipient, setRecipient] = useState("");
  const [phone, setPhone] = useState("");
  const [line, setLine] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postal, setPostal] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  if (!customer) return null;

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label || !recipient || !phone || !line || !city || !province || !postal) {
      toast.error("Please fill in all address fields.");
      return;
    }

    addAddress({
      label,
      recipient_name: recipient,
      phone,
      address_line: line,
      city,
      province,
      postal_code: postal,
      is_default: isDefault,
    });

    // Reset fields
    setLabel("");
    setRecipient("");
    setPhone("");
    setLine("");
    setCity("");
    setProvince("");
    setPostal("");
    setIsDefault(false);
    setShowAddressForm(false);
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-background min-h-screen py-12 sm:py-20 font-dm-sans text-soil transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Banner */}
        <div className="mb-12 border-b border-sand/20 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta">
              Customer Account
            </span>
            <h1 className="font-playfair text-3xl sm:text-4xl font-normal text-soil mt-1">
              Welcome back, {customer.full_name}
            </h1>
            <p className="text-xs text-dust mt-1">
              Manage your delivery destinations, credentials, and review past order logistics.
            </p>
          </div>
          
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="flex items-center gap-1.5 h-10 px-5 border border-sand hover:border-terracotta text-xs font-semibold uppercase tracking-wider rounded-[2px] cursor-pointer transition-colors duration-200"
          >
            <LogOut className="size-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Dash layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Address Book CRUD (span 7) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            
            <div className="flex items-center justify-between border-b border-sand/20 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="size-4.5 text-terracotta" />
                <h3 className="font-playfair text-xl font-normal text-soil">
                  Address Book Bookings
                </h3>
              </div>
              
              <button
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="text-xs font-bold text-terracotta hover:opacity-85 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="size-4" />
                <span>{showAddressForm ? "Cancel Form" : "Add Destination"}</span>
              </button>
            </div>

            {showAddressForm && (
              /* Inline Address form entry */
              <form onSubmit={handleAddNewAddress} className="border border-sand bg-cream/20 p-5 sm:p-6 rounded-[2px] flex flex-col gap-4 animate-fade-in">
                <h4 className="font-playfair text-sm font-semibold text-soil uppercase tracking-wide">
                  New Shipping Destination
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-soil">
                      Address Label
                    </label>
                    <Input
                      type="text"
                      placeholder="Home, Office, Holiday"
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
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
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
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
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
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
                      value={postal}
                      onChange={(e) => setPostal(e.target.value)}
                      required
                      className="h-10 text-xs bg-background"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-soil">
                    Street Address & Details
                  </label>
                  <Input
                    type="text"
                    placeholder="Jl. Sudirman No. 24, Apt 8D"
                    value={line}
                    onChange={(e) => setLine(e.target.value)}
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
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
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
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      required
                      className="h-10 text-xs bg-background"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="rounded-[2px] border-sand text-terracotta focus:ring-terracotta size-4"
                  />
                  <label htmlFor="isDefault" className="text-xs text-dust font-medium">
                    Set as default destination address
                  </label>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="w-fit text-[10px] uppercase tracking-widest font-bold mt-2 cursor-pointer"
                >
                  Create Booking Address
                </Button>
              </form>
            )}

            {/* List of addresses */}
            <div className="flex flex-col gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="bg-cream/15 border border-sand/30 p-5 rounded-[2px] flex items-start justify-between gap-6"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-soil">{addr.label}</span>
                      {addr.is_default && (
                        <span className="text-[9px] bg-terracotta-light text-terracotta font-semibold uppercase px-1.5 py-0.5 rounded-[2px]">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-dust leading-relaxed font-normal">
                      <p className="font-semibold text-soil">{addr.recipient_name} ({addr.phone})</p>
                      <p className="mt-1">{addr.address_line}</p>
                      <p>{addr.city}, {addr.province} {addr.postal_code}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                    {!addr.is_default && (
                      <button
                        onClick={() => setDefaultAddress(addr.id)}
                        className="h-8 px-3 border border-sand hover:border-soil text-[10px] uppercase font-bold text-dust hover:text-soil transition-colors cursor-pointer rounded-[2px]"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="size-8 flex items-center justify-center border border-sand/40 hover:border-terracotta text-dust/60 hover:text-terracotta transition-colors cursor-pointer rounded-[2px]"
                      title="Delete"
                      disabled={addr.is_default}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column: Order History (span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            <div className="flex items-center gap-2 border-b border-sand/20 pb-3">
              <Clock className="size-4.5 text-terracotta" />
              <h3 className="font-playfair text-xl font-normal text-soil">
                Purchase Chronology
              </h3>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12 bg-cream/10 border border-sand/20 rounded-[2px] text-xs text-dust">
                You have not placed any orders yet.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="border border-sand/35 bg-cream/15 p-5 rounded-[2px] flex flex-col gap-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-dust">
                          Order Number
                        </span>
                        <span className="text-xs font-bold text-soil">{ord.order_number}</span>
                      </div>
                      <span className="px-2.5 py-1 text-[9px] bg-terracotta text-chalk font-semibold uppercase tracking-wider rounded-[2px]">
                        {ord.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-dust font-normal flex flex-col gap-1 border-y border-sand/20 py-3">
                      <div className="flex justify-between">
                        <span>Checkout Date:</span>
                        <span className="text-soil">{new Date(ord.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Items Count:</span>
                        <span className="text-soil">{ord.items.reduce((sum, i) => sum + i.quantity, 0)} Items</span>
                      </div>
                      <div className="flex justify-between font-semibold mt-0.5">
                        <span>Paid Total:</span>
                        <span className="text-terracotta">{formatPrice(ord.total)}</span>
                      </div>
                    </div>

                    <Link
                      to={`/order-tracking/${ord.order_number}`}
                      className="inline-flex items-center justify-center h-10 w-full bg-soil hover:bg-soil/95 text-chalk text-[10px] font-bold uppercase tracking-widest transition-colors rounded-[2px]"
                    >
                      Track Shipment Logistics
                    </Link>

                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
