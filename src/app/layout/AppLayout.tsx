import { Outlet, useMatches } from "@tanstack/react-router";
import clsx from "clsx";
import { Footer } from "../../components/footer/Footer";
import { Header } from "../../components/header/Header";
import "./AppLayout.css";

const FULL_WIDTH_ROUTE_IDS = new Set([
  "/$game/$league/cards",
  "/$game/$league/cards/",
  "/$game/$league/cards/$cardId",
  "/$game/$league/soothsayer",
  "/$game/$league/soothsayer/",
  "/$game/$league/stacked-decks",
  "/soothsayer/",
  "/soothsayer/auth",
]);

export function AppLayout() {
  const matches = useMatches();
  const routeId = matches[matches.length - 1]?.routeId;
  const isFullWidthRoute = routeId ? FULL_WIDTH_ROUTE_IDS.has(routeId) : false;
  const isHomepage = routeId === "/" || routeId === "/$game/$league/";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main
        className={clsx("flex-1 flex flex-col", {
          "wc-page-gradient": isHomepage,
          "bg-(--wc-header-bg)": !isHomepage && !isFullWidthRoute,
        })}
      >
        <div
          key={routeId}
          className={clsx("flex-1 flex flex-col wc-page-enter", {
            "mx-auto w-full max-w-300 max-md:px-4 md:px-6 py-6":
              !isFullWidthRoute,
          })}
        >
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}
