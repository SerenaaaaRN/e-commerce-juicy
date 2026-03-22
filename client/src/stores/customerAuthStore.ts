import { create } from "zustand";
import { toast } from "sonner";
import { customerApi } from "@/lib/api";

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
  phone: string | null;
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

export const useCustomerAuthStore = create<CustomerAuthState>((set, get) => ({
  token: null,
  customer: null,
  addresses: [],
  loading: false,

  login: async (email: string, password: string) => {
    try {
      const result = await customerApi.customerLogin(email, password);
      set({ token: result.token, customer: { ...result.customer, phone: null } });
      toast.success("Successfully logged in.");
      return true;
    } catch {
      toast.error("Invalid email or password.");
      return false;
    }
  },

  register: async (fullName: string, email: string, phone: string, password: string) => {
    try {
      const result = await customerApi.customerRegister({
        full_name: fullName,
        email,
        password,
        phone,
      });
      set({ token: result.token, customer: { ...result.customer, phone: null } });
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
      const profile = await customerApi.getCustomerProfile();
      set({
        customer: {
          id: profile.id,
          full_name: profile.full_name,
          email: profile.email,
          phone: profile.phone,
        },
      });
    } catch {
      // silent
    }
  },

  fetchAddresses: async () => {
    if (!get().token) return;
    try {
      const apiAddresses = await customerApi.listAddresses();
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
      // silent
    }
  },

  addAddress: async (address) => {
    try {
      await customerApi.createAddress({
        label: address.label,
        recipient_name: address.recipient_name,
        phone: address.phone,
        address_line: address.address_line,
        city: address.city,
        province: address.province,
        postal_code: address.postal_code,
        is_default: address.is_default,
      });
      await get().fetchAddresses();
      toast.success("New address added successfully.");
    } catch {
      toast.error("Failed to add address.");
    }
  },

  updateAddress: async (id, updatedFields) => {
    try {
      const addr = get().addresses.find((a) => a.id === id);
      await customerApi.updateAddress(id, {
        label: updatedFields.label ?? addr?.label ?? null,
        recipient_name: updatedFields.recipient_name ?? addr?.recipient_name ?? "",
        phone: updatedFields.phone ?? addr?.phone ?? "",
        address_line: updatedFields.address_line ?? addr?.address_line ?? "",
        city: updatedFields.city ?? addr?.city ?? "",
        province: updatedFields.province ?? addr?.province ?? "",
        postal_code: updatedFields.postal_code ?? addr?.postal_code ?? "",
        is_default: updatedFields.is_default ?? addr?.is_default ?? false,
      });
      await get().fetchAddresses();
      toast.success("Address updated successfully.");
    } catch {
      toast.error("Failed to update address.");
    }
  },

  deleteAddress: async (id) => {
    try {
      await customerApi.deleteAddress(id);
      await get().fetchAddresses();
      toast.success("Address deleted successfully.");
    } catch {
      toast.error("Failed to delete address.");
    }
  },

  setDefaultAddress: async (id) => {
    try {
      await customerApi.setDefaultAddress(id);
      await get().fetchAddresses();
      toast.success("Default address updated.");
    } catch {
      toast.error("Failed to set default address.");
    }
  },
}));
