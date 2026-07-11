import type { GameLinkSuffix } from "../components/links";
import type { FileRouteTypes } from "../routeTree.gen";

// All static (non-dynamic) routes known to TanStack Router
type StaticRoutePath = Exclude<
  FileRouteTypes["to"],
  `${string}$${string}` | "." | ".."
>;

// Game-link suffixes with no further dynamic segments (e.g. excludes /cards/$cardId)
type StaticGameLinkSuffix = Exclude<GameLinkSuffix, `${string}$${string}`>;

export type NavigationItem =
  | { label: string; path: StaticGameLinkSuffix; gameScoped: true }
  | { label: string; path: StaticRoutePath; gameScoped?: false };

type FooterNavigationItem = {
  label: string;
  path: StaticRoutePath;
};

export const navigationRoutes: NavigationItem[] = [
  { label: "Cards", path: "/cards", gameScoped: true },
  { label: "Stacked Decks", path: "/stacked-decks", gameScoped: true },
  { label: "Soothsayer", path: "/soothsayer", gameScoped: true },
  { label: "Downloads", path: "/downloads" },
] as const;

export const footerNavigation: FooterNavigationItem[] = [
  { label: "Attributions", path: "/attributions" },
  { label: "Privacy Policy", path: "/privacy-policy" },
] as const;
