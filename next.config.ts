import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/api/files/**",
      },
      {
        protocol: "https",
        hostname: "**", // Allow all HTTPS images
      },
    ],
    // Alternatively, use unoptimized for external images
    unoptimized: false,
  },
  allowedDevOrigins: ["http://172.16.12.194:3000", "172.16.12.194"],
};

export default nextConfig;
