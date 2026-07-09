import type { FileRouteTypes } from "../routeTree.gen";

// All static (non-dynamic) routes known to TanStack Router
type StaticRoutePath = Exclude<
  FileRouteTypes["to"],
  `${string}$${string}` | "." | ".."
>;

// /$game-prefixed routes with no further dynamic segments (e.g. excludes /$game/cards/$cardId)
type GameScopedCandidate = Extract<FileRouteTypes["to"], `/$game/${string}`>;
type GameScopedRoutePath = Exclude<
  GameScopedCandidate,
  `/$game/${string}$${string}`
>;

type NavigationItem =
  | { label: string; path: GameScopedRoutePath; gameScoped: true }
  | { label: string; path: StaticRoutePath; gameScoped?: false };

type FooterNavigationItem = {
  label: string;
  path: StaticRoutePath;
};

export const navigationRoutes: NavigationItem[] = [
  { label: "Cards", path: "/$game/cards", gameScoped: true },
  { label: "Stacked Decks", path: "/$game/stacked-decks", gameScoped: true },
  { label: "Soothsayer", path: "/$game/soothsayer", gameScoped: true },
  { label: "Downloads", path: "/downloads" },
] as const;

export const footerNavigation: FooterNavigationItem[] = [
  { label: "Attributions", path: "/attributions" },
  { label: "Privacy Policy", path: "/privacy-policy" },
] as const;
