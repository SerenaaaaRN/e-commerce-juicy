import { toast } from "sonner";
import axios from "axios";

export function isNetworkError(error: unknown): boolean {
  if (axios.isCancel(error)) return false;
  if (!axios.isAxiosError(error)) return false;
  return !error.response || error.code === "ECONNABORTED";
}

export async function withFallback<T>(
  apiCall: () => Promise<T>,
  fallback: () => T | Promise<T>,
  fallbackMessage = "Server offline — showing cached data",
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    if (isNetworkError(error)) {
      toast.warning(fallbackMessage);
      return fallback();
    }
    throw error;
  }
}

export function withSilentFallback<T>(
  apiCall: () => Promise<T>,
  fallback: () => T,
): Promise<T> {
  return apiCall().catch((error) => {
    if (isNetworkError(error)) {
      return fallback();
    }
    throw error;
  });
}
