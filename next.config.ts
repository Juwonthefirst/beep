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
    ],
  },
};

export default nextConfig;
