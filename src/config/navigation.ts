type MainNavigationItem = {
  label: string;
  path: "/cards" | "/stacked-decks" | "/soothsayer" | "/downloads";
};

type FooterNavigationItem = {
  label: string;
  path: "/attributions" | "/privacy-policy";
  active?: boolean;
};

export const mainNavigation: readonly MainNavigationItem[] = [
  // { label: "Cards", path: "/cards" },
  // { label: "Stacked Decks", path: "/stacked-decks" },
  // { label: "Soothsayer", path: "/soothsayer" },
  // { label: "Downloads", path: "/downloads" },
] as const;

export const footerNavigation: readonly FooterNavigationItem[] = [
  { label: "Attributions", path: "/attributions" },
  { label: "Privacy Policy", path: "/privacy-policy" },
] as const;
