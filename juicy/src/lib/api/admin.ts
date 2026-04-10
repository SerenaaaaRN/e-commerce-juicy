import { client } from "./client"

export const adminApi = {
  // Admin-related API service stubs matching architectural setup
  getAnalytics: async () => {
    const response = await client.get("/admin/analytics")
    return response.data
  },
}

export default adminApi
