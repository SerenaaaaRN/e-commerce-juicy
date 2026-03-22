import { create } from "zustand";
import { toast } from "sonner";
import { customerApi, withFallback } from "@/lib/api";

export type Address = {
  id: string;
  label: string;
  recipient_name: string;
  phone: string;
  address_line: string;
  city: string;
  province: string;
  postal_code: string;
  is_default: boolean;
};

export type Customer = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
};

type CustomerAuthState = {
  token: string | null;
  customer: Customer | null;
  addresses: Address[];
  loading: boolean;

  login: (email: string, password: string) => Promise<boolean>;
  register: (fullName: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  fetchAddresses: () => Promise<void>;
  addAddress: (address: Omit<Address, "id">) => Promise<void>;
  updateAddress: (id: string, address: Partial<Address>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
};

const DEFAULT_MOCK_CUSTOMER: Customer = {
  id: "cust-jane",
  full_name: "Jane Doe",
  email: "jane@example.com",
  phone: "+62812345678",
};

const DEFAULT_MOCK_ADDRESSES: Address[] = [
  {
    id: "addr-1",
    label: "Home",
    recipient_name: "Jane Doe",
    phone: "+62812345678",
    address_line: "Jl. Sudirman No. 24, Apartment 8A",
    city: "Jakarta Selatan",
    province: "DKI Jakarta",
    postal_code: "12190",
    is_default: true,
  },
  {
    id: "addr-2",
    label: "Office",
    recipient_name: "Jane Doe",
    phone: "+62812345678",
    address_line: "Sudirman Central Business District, Treasury Tower Lt. 42",
    city: "Jakarta Selatan",
    province: "DKI Jakarta",
    postal_code: "12190",
    is_default: false,
  },
];

const mockLogin = (email: string): Customer => ({
  id: "cust-jane",
  full_name: email.split("@")[0].split(".").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ") || "Jane Doe",
  email,
  phone: "+62812345678",
});

export const useCustomerAuthStore = create<CustomerAuthState>((set, get) => ({
  token: "mock-customer-token",
  customer: DEFAULT_MOCK_CUSTOMER,
  addresses: DEFAULT_MOCK_ADDRESSES,
  loading: false,

  login: async (email: string, password: string) => {
    try {
      const result = await withFallback(
        () => customerApi.customerLogin(email, password),
        () => {
          if (!email.includes("@") || !password) throw new Error("Invalid credentials");
          return { token: "mock-customer-token", customer: mockLogin(email) };
        },
      );
      set({ token: result.token, customer: result.customer });
      toast.success("Successfully logged in.");
      return true;
    } catch {
      toast.error("Please enter a valid email and password.");
      return false;
    }
  },

  register: async (fullName: string, email: string, phone: string, password: string) => {
    if (!fullName || !email || !phone || password.length < 4) {
      toast.error("Please fill all fields. Password must be at least 4 characters.");
      return false;
    }
    try {
      const result = await withFallback(
        () => customerApi.customerRegister({ full_name: fullName, email, password, phone }),
        () => ({
          token: "mock-customer-token",
          customer: { id: `cust-${Math.random().toString(36).substring(2, 9)}`, full_name: fullName, email, phone },
        }),
      );
      set({ token: result.token, customer: result.customer });
      toast.success("Account created successfully!");
      return true;
    } catch {
      toast.error("Registration failed. Please try again.");
      return false;
    }
  },

  logout: () => {
    set({ token: null, customer: null, addresses: [] });
    toast.success("Logged out successfully.");
  },

  fetchProfile: async () => {
    if (!get().token) return;
    try {
      const profile = await withFallback(
        () => customerApi.getCustomerProfile(),
        () => get().customer || DEFAULT_MOCK_CUSTOMER,
        "Server offline — showing cached profile",
      );
      set({ customer: { id: profile.id, full_name: profile.full_name, email: profile.email, phone: profile.phone || "" } });
    } catch {
      // keep existing state
    }
  },

  fetchAddresses: async () => {
    if (!get().token) return;
    try {
      const apiAddresses = await withFallback(
        () => customerApi.listAddresses(),
        () => get().addresses.length > 0 ? get().addresses : DEFAULT_MOCK_ADDRESSES,
        "Server offline — showing cached addresses",
      );
      set({
        addresses: apiAddresses.map((a) => ({
          id: a.id,
          label: a.label || "",
          recipient_name: a.recipient_name,
          phone: a.phone,
          address_line: a.address_line,
          city: a.city,
          province: a.province,
          postal_code: a.postal_code,
          is_default: a.is_default,
        })),
      });
    } catch {
      // keep existing state
    }
  },

  addAddress: async (address) => {
    try {
      await withFallback(
        () => customerApi.createAddress({
          label: address.label,
          recipient_name: address.recipient_name,
          phone: address.phone,
          address_line: address.address_line,
          city: address.city,
          province: address.province,
          postal_code: address.postal_code,
          is_default: address.is_default,
        }),
        async () => {
          const { addresses } = get();
          const newId = `addr-${Math.random().toString(36).substring(2, 9)}`;
          const newAddress: Address = { ...address, id: newId };
          let updated = [...addresses];
          if (newAddress.is_default) {
            updated = updated.map((a) => (a.is_default ? { ...a, is_default: false } : a));
          }
          set({ addresses: [...updated, newAddress] });
        },
      );
      await get().fetchAddresses();
      toast.success("New address added successfully.");
    } catch {
      toast.error("Failed to add address.");
    }
  },

  updateAddress: async (id, updatedFields) => {
    try {
      const addr = get().addresses.find((a) => a.id === id);
      await withFallback(
        () => customerApi.updateAddress(id, {
          label: updatedFields.label ?? addr?.label ?? null,
          recipient_name: updatedFields.recipient_name ?? addr?.recipient_name ?? "",
          phone: updatedFields.phone ?? addr?.phone ?? "",
          address_line: updatedFields.address_line ?? addr?.address_line ?? "",
          city: updatedFields.city ?? addr?.city ?? "",
          province: updatedFields.province ?? addr?.province ?? "",
          postal_code: updatedFields.postal_code ?? addr?.postal_code ?? "",
          is_default: updatedFields.is_default ?? addr?.is_default ?? false,
        }),
        async () => {
          const { addresses } = get();
          let updatedAddresses = addresses.map((a) => (a.id === id ? { ...a, ...updatedFields } : a));
          if (updatedFields.is_default) {
            updatedAddresses = updatedAddresses.map((a) =>
              a.id !== id && a.is_default ? { ...a, is_default: false } : a,
            );
          }
          set({ addresses: updatedAddresses });
        },
      );
      await get().fetchAddresses();
      toast.success("Address updated successfully.");
    } catch {
      toast.error("Failed to update address.");
    }
  },

  deleteAddress: async (id) => {
    const { addresses } = get();
    const target = addresses.find((a) => a.id === id);
    if (target?.is_default) {
      toast.warning("Cannot delete default address. Set another address as default first.");
      return;
    }
    try {
      await withFallback(
        () => customerApi.deleteAddress(id),
        () => {
          set({ addresses: addresses.filter((a) => a.id !== id) });
        },
      );
      await get().fetchAddresses();
      toast.success("Address deleted successfully.");
    } catch {
      toast.error("Failed to delete address.");
    }
  },

  setDefaultAddress: async (id) => {
    try {
      await withFallback(
        () => customerApi.setDefaultAddress(id),
        () => {
          const { addresses } = get();
          set({ addresses: addresses.map((a) => ({ ...a, is_default: a.id === id })) });
        },
      );
      await get().fetchAddresses();
      toast.success("Default address updated.");
    } catch {
      toast.error("Failed to set default address.");
    }
  },
}));
