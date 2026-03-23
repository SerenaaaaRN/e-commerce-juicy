import axios from "axios";
import { useCustomerAuthStore } from "@/stores/customerAuthStore";

export const customerClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

customerClient.interceptors.request.use((config) => {
  const token = useCustomerAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

customerClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      const store = useCustomerAuthStore.getState();
      if (store.token) {
        store.logout();
      }
    }
    return Promise.reject(error);
  },
);
