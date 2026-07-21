import { Outlet, useMatches } from "@tanstack/react-router";
import clsx from "clsx";
import type { Variants } from "motion/react";
import * as m from "motion/react-m";
import { Footer } from "../../components/footer/Footer";
import { Header } from "../../components/header/Header";

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

const pageVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

export function AppLayout() {
  const matches = useMatches();
  const leafMatch = matches[matches.length - 1];
  const routeId = leafMatch?.routeId;
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
        <m.div
          key={leafMatch?.id}
          className={clsx("flex-1 flex flex-col", {
            "mx-auto w-full max-w-300 max-md:px-4 md:px-6 py-6":
              !isFullWidthRoute,
          })}
          variants={pageVariants}
          initial="hidden"
          animate="visible"
        >
          <Outlet />
        </m.div>
      </main>

      <Footer />
    </div>
  );
}
