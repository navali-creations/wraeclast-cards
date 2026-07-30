import * as Sentry from "@sentry/react";
import { RouterClient } from "@tanstack/react-router/ssr/client";
import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./app/App";
import { bootstrapApp } from "./app/bootstrap";
import { queryClient } from "./app/queryClient";
import { removeStaticSeoElements } from "./lib/seo";
import { router } from "./router";
import "./index.css";

const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
const umamiScriptUrl = import.meta.env.VITE_UMAMI_SCRIPT_URL;
const umamiWebsiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID;
const enableTelemetry = import.meta.env.PROD;

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

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("The application root element is missing.");
}

if (window.$_TSR?.router) {
  hydrateRoot(
    rootElement,
    <StrictMode>
      <App
        queryClient={queryClient}
        router={router}
        routerContent={<RouterClient router={router} />}
      />
    </StrictMode>,
  );
} else {
  // The pristine app shell is still used by dynamic Pages routes. Keep any
  // build-time body visible until their first client-side match is ready.
  void bootstrapApp({
    loadInitialRoute: () => router.load(),
    removeStaticSeo: removeStaticSeoElements,
    renderApp: () => {
      createRoot(rootElement).render(
        <StrictMode>
          <App queryClient={queryClient} router={router} />
        </StrictMode>,
      );
    },
  });
}
