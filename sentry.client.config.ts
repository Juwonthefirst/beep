import * as Sentry from "@sentry/nextjs";

if (process.env.NODE_ENV === "development") {
  Sentry.init({
    spotlight: true,
    tracesSampleRate: 1.0,
    debug: false,
    enabled: false,
  });
}
