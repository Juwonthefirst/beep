import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
};

export default process.env.NODE_ENV === "development"
  ? withSentryConfig(nextConfig, {
      silent: true,
      disableLogger: true,
      widenClientFileUpload: false,
    })
  : nextConfig;
