import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCustomerAuthStore } from "@/stores/customerAuthStore";
import { useOrderStore } from "@/stores/orderStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { initLenis } from "@/lib/lenis";
import { toast } from "sonner";
import { Plus, Trash2, Clock, LogOut, User, Shield, MapPin } from "lucide-react";

type ActiveTab = "profile" | "addresses" | "security";

const ProfilePage = () => {
  const navigate = useNavigate();
  const {
    customer,
    addresses,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    logout,
    fetchProfile,
    fetchAddresses,
    updateProfile,
    changePassword,
  } = useCustomerAuthStore();

  const orders = useOrderStore((state) => state.orders);
  const fetchOrders = useOrderStore((state) => state.fetchOrders);

  // Active Tab state
  const [activeTab, setActiveTab] = useState<ActiveTab>("profile");

  // Edit profile states
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");

  // Change password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

  // Update local inputs once profile is fetched
  useEffect(() => {
    if (customer) {
      setProfileName(customer.full_name || "");
      setProfilePhone(customer.phone || "");
    }
  }, [customer]);

  // Redirect if not logged in
  useEffect(() => {
    if (!customer) {
      toast.info("Please sign in to access your dashboard.");
      navigate("/login");
    }
  }, [customer, navigate]);

  if (!customer) return null;

  const handleUpdateProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName) {
      toast.error("Name is required.");
      return;
    }
    const success = await updateProfile(profileName, profilePhone || null);
    if (success) {
      toast.success("Personal profile updated successfully.");
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    const success = await changePassword(currentPassword, newPassword);
    if (success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleAddNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label || !recipient || !phone || !line || !city || !province || !postal) {
      toast.error("Please fill in all address fields.");
      return;
    }

    await addAddress({
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
          
          {/* Left Column: Side Navigation (span 3) */}
          <div className="lg:col-span-3 flex flex-col gap-2 bg-cream/20 border border-sand/35 p-5 rounded-[2px]">
            <span className="text-[9px] font-bold uppercase tracking-wider text-dust mb-2 block border-b border-sand/20 pb-2">
              Account Hub
            </span>
            
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-3 w-full py-3 px-4 text-xs font-semibold uppercase tracking-wider rounded-[2px] transition-all cursor-pointer ${
                activeTab === "profile"
                  ? "bg-soil text-chalk"
                  : "text-soil hover:bg-cream/40"
              }`}
            >
              <User className="size-4 shrink-0" />
              <span>Personal Details</span>
            </button>

            <button
              onClick={() => setActiveTab("addresses")}
              className={`flex items-center gap-3 w-full py-3 px-4 text-xs font-semibold uppercase tracking-wider rounded-[2px] transition-all cursor-pointer ${
                activeTab === "addresses"
                  ? "bg-soil text-chalk"
                  : "text-soil hover:bg-cream/40"
              }`}
            >
              <MapPin className="size-4 shrink-0" />
              <span>Address Book</span>
            </button>

            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-3 w-full py-3 px-4 text-xs font-semibold uppercase tracking-wider rounded-[2px] transition-all cursor-pointer ${
                activeTab === "security"
                  ? "bg-soil text-chalk"
                  : "text-soil hover:bg-cream/40"
              }`}
            >
              <Shield className="size-4 shrink-0" />
              <span>Account Security</span>
            </button>

            <div className="border-t border-sand/20 mt-4 pt-4">
              <Link
                to="/orders"
                className="flex items-center justify-between w-full py-3 px-4 text-xs font-semibold uppercase tracking-wider rounded-[2px] text-terracotta border border-terracotta hover:bg-terracotta hover:text-chalk transition-all"
              >
                <div className="flex items-center gap-3">
                  <Clock className="size-4 shrink-0" />
                  <span>Order History</span>
                </div>
                <span className="text-[10px] bg-terracotta-light text-terracotta hover:text-inherit px-1.5 py-0.5 rounded-[2px] font-bold">
                  {orders.length}
                </span>
              </Link>
            </div>
          </div>

          {/* Right Column: Tab Contents (span 9) */}
          <div className="lg:col-span-9 flex flex-col gap-6">
            
            {/* TAB 1: PERSONAL DETAILS */}
            {activeTab === "profile" && (
              <div className="bg-cream/10 border border-sand/35 p-6 sm:p-8 rounded-[2px] flex flex-col gap-6">
                <div className="border-b border-sand/20 pb-4">
                  <h3 className="font-playfair text-2xl font-normal text-soil">
                    Personal Details
                  </h3>
                  <p className="text-xs text-dust mt-1">
                    Update your contact details below to streamline checkout details automatically.
                  </p>
                </div>

                <form onSubmit={handleUpdateProfileSubmit} className="flex flex-col gap-5 max-w-xl">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-soil">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={customer.email}
                      disabled
                      className="h-10 text-xs bg-cream/35 border-sand/40 opacity-70 cursor-not-allowed"
                    />
                    <span className="text-[9px] text-dust">
                      Registered email addresses cannot be modified.
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-soil">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Jane Doe"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      required
                      className="h-10 text-xs bg-background border-sand/50 focus:border-terracotta"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-soil">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      placeholder="+628..."
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="h-10 text-xs bg-background border-sand/50 focus:border-terracotta"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="w-fit text-[10px] uppercase tracking-widest font-bold mt-2 cursor-pointer"
                  >
                    Save Details
                  </Button>
                </form>
              </div>
            )}

            {/* TAB 2: ADDRESS BOOK */}
            {activeTab === "addresses" && (
              <div className="bg-cream/10 border border-sand/35 p-6 sm:p-8 rounded-[2px] flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-sand/20 pb-4">
                  <div>
                    <h3 className="font-playfair text-2xl font-normal text-soil">
                      Address Book
                    </h3>
                    <p className="text-xs text-dust mt-1">
                      Manage your delivery locations for simplified, stress-free checkout.
                    </p>
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
                  {addresses.length === 0 ? (
                    <div className="text-center py-12 bg-cream/10 border border-sand/20 rounded-[2px] text-xs text-dust">
                      No addresses saved yet. Click "Add Destination" above.
                    </div>
                  ) : (
                    addresses.map((addr) => (
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
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: ACCOUNT SECURITY */}
            {activeTab === "security" && (
              <div className="bg-cream/10 border border-sand/35 p-6 sm:p-8 rounded-[2px] flex flex-col gap-6">
                <div className="border-b border-sand/20 pb-4">
                  <h3 className="font-playfair text-2xl font-normal text-soil">
                    Account Security
                  </h3>
                  <p className="text-xs text-dust mt-1">
                    Update your account credentials to keep your profile secure.
                  </p>
                </div>

                <form onSubmit={handleChangePasswordSubmit} className="flex flex-col gap-5 max-w-xl">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-soil">
                      Current Password
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="h-10 text-xs bg-background border-sand/50 focus:border-terracotta"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-soil">
                      New Password
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="h-10 text-xs bg-background border-sand/50 focus:border-terracotta"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-soil">
                      Confirm New Password
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="h-10 text-xs bg-background border-sand/50 focus:border-terracotta"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="w-fit text-[10px] uppercase tracking-widest font-bold mt-2 cursor-pointer"
                  >
                    Change Password
                  </Button>
                </form>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
