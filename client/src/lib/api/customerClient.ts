import { useCustomerAuthStore } from "@/stores/customer-auth-store"
import axios from "axios"

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api"

export const customerClient = axios.create({
  baseURL: VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to dynamically inject the bearer token
customerClient.interceptors.request.use(
  (config) => {
    const token = useCustomerAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to catch 401s and trigger automatic logout
customerClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Automatic logout to keep local state synced
      useCustomerAuthStore.getState().logout()
    }
    return Promise.reject(error)
  }
)

export default customerClient
