import type { FileRouteTypes } from "../routeTree.gen";

// All static (non-dynamic) routes known to TanStack Router
type StaticRoutePath = Exclude<
  FileRouteTypes["to"],
  `${string}$${string}` | "." | ".."
>;

type MainNavigationItem = {
  label: string;
  path: StaticRoutePath;
};

type FooterNavigationItem = {
  label: string;
  path: StaticRoutePath;
  active?: boolean;
};

export const mainNavigation: MainNavigationItem[] = [
  // { label: "Cards", path: "/cards" },
  // { label: "Stacked Decks", path: "/stacked-decks" },
  // { label: "Soothsayer", path: "/soothsayer" },
  // { label: "Downloads", path: "/downloads" },
] as const;

export const footerNavigation: FooterNavigationItem[] = [
  { label: "Attributions", path: "/attributions" },
  { label: "Privacy Policy", path: "/privacy-policy" },
] as const;
