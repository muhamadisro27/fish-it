import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  turbopack: {
    root: __dirname,
  },
  allowedDevOrigins: [
    "192.168.18.82",
    "*.192.168.18.82",
  ],
  experimental: {
  },
};

export default nextConfig;
