import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "http",
        hostname: process.env.HOST_NAME!,
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "02facda14ba0c8cc2a640e2a039855a6.r2.cloudflarestorage.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pub-28366e7f68a54624b152528f1964d965.r2.dev",
        pathname: "/beep/**",
      },
    ],
  },
};

export default nextConfig;
