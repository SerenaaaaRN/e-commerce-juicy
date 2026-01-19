import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["pnkzviyezkrwnjtwjgrq.supabase.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default nextConfig;
