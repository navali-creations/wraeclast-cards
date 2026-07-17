import * as Sentry from "@sentry/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import "./index.css";

const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
const umamiScriptUrl = import.meta.env.VITE_UMAMI_SCRIPT_URL;
const umamiWebsiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID;
const enableTelemetry = import.meta.env.PROD;

// Build-time metadata and page content make the initial HTML useful without
// JavaScript. TanStack Router replaces these tags, and React replaces the
// static content inside #root, once the application starts.
document.querySelectorAll("[data-seo-static]").forEach((element) => {
  element.remove();
});

if (enableTelemetry && sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpHeaders: {
        request: false,
        response: false,
      },
      httpBodies: [],
      queryParams: {
        deny: ["*"],
      },
      genAI: {
        inputs: false,
        outputs: false,
      },
    },
  });
}

if (enableTelemetry && umamiScriptUrl && umamiWebsiteId) {
  const script = document.createElement("script");
  script.defer = true;
  script.src = umamiScriptUrl;
  script.dataset.websiteId = umamiWebsiteId;
  document.head.append(script);
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
