import axios from "axios"
import { useAdminAuthStore } from "@/stores/adminAuthStore"

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api"

export const client = axios.create({
  baseURL: VITE_API_BASE_URL.endsWith("/api") ? VITE_API_BASE_URL : `${VITE_API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

// Request interceptor to dynamically inject the bearer token
client.interceptors.request.use(
  (config) => {
    const token = useAdminAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

interface FailedRequest {
  resolve: (value: string | null) => void
  reject: (reason: unknown) => void
}

let isRefreshing = false
let failedQueue: FailedRequest[] = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Response interceptor to catch 401s and attempt silent refresh
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/admin/login")
    ) {
      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return client(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshRes = await axios.post(
          `${client.defaults.baseURL}/admin/refresh`,
          {},
          { withCredentials: true }
        )

        if (refreshRes.data && refreshRes.data.success) {
          const { token, admin } = refreshRes.data.data
          useAdminAuthStore.getState().login(token, admin)
          
          processQueue(null, token)
          
          originalRequest.headers.Authorization = `Bearer ${token}`
          return client(originalRequest)
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null)
        useAdminAuthStore.getState().logout()
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default client

