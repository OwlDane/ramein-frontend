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
      // Development
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/api/files/**",
      },
      // Production - Render backend
      {
        protocol: "https",
        hostname: "*.onrender.com",
        pathname: "/api/files/**",
      },
      // Allow all HTTPS images for flexibility
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: false,
  },
  // Remove dev origins in production
  ...(process.env.NODE_ENV === 'development' && {
    allowedDevOrigins: ["http://172.16.12.194:3000", "172.16.12.194"],
  }),
};

export default nextConfig;
