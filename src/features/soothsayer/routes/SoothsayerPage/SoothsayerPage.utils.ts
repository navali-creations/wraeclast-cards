import type { SoothsayerFeature } from "../../types";

export const soothsayerFeatures: SoothsayerFeature[] = [
  {
    id: "current-session",
    title: "Current Session",
    description:
      "Monitor an active stacked deck session as it happens, with the overlay attached for real-time opening totals, card hits, running value.",
    imageSrc: "/images/soothsayer/current-session.webp",
    thumbnailSrc: "/images/soothsayer/thumbs/current-session.webp",
    imageAlt:
      "Soothsayer current session screen with a real-time tracking overlay attached.",
  },
  {
    id: "card-detail",
    title: "Card Detail",
    description:
      "Review a card's personal history with a detailed chart showing your tracked findings, timing, and value changes across previous sessions.",
    imageSrc: "/images/soothsayer/card-detail.webp",
    thumbnailSrc: "/images/soothsayer/thumbs/card-detail.webp",
    imageAlt:
      "Soothsayer card detail page with a chart of personal historical findings.",
  },
  {
    id: "card-list",
    title: "Card List",
    description:
      "Browse the available divination cards in game with rarity-aware hover effects that make common, rare, and exceptional cards read differently at a glance.",
    imageSrc: "/images/soothsayer/cards.webp",
    thumbnailSrc: "/images/soothsayer/thumbs/cards.webp",
    imageAlt:
      "Soothsayer list of available divination cards with rarity-based hover treatment.",
  },
  {
    id: "profit-forecast",
    title: "Profit Forecast",
    description:
      "Estimate whether opening stacked decks is worth the risk using current market values, expected outcomes, and your selected economy context.",
    imageSrc: "/images/soothsayer/profit-forecast.webp",
    thumbnailSrc: "/images/soothsayer/thumbs/profit-forecast.webp",
    imageAlt:
      "Soothsayer profit forecast page predicting stacked deck opening profitability.",
  },
  {
    id: "statistics",
    title: "Statistics",
    description:
      "Explore aggregated findings through dense, high-performance canvas charts designed to stay smooth across large session histories and filters.",
    imageSrc: "/images/soothsayer/stats.webp",
    thumbnailSrc: "/images/soothsayer/thumbs/stats.webp",
    imageAlt: "Soothsayer detailed statistics page with a performant chart.",
  },
  {
    id: "rarity-insights",
    title: "Rarity Insights",
    description:
      "Compare card rarity filters across poe.ninja prices, the Prohibited Library average-weight model, and any online or private filters you have loaded.",
    imageSrc: "/images/soothsayer/rarity-insights.webp",
    thumbnailSrc: "/images/soothsayer/thumbs/rarity-insights.webp",
    imageAlt: "Compare and edit divination card rarities across loot filters",
  },
];

export const defaultSoothsayerFeatureId = soothsayerFeatures[0]?.id ?? "";

export function isSoothsayerFeatureId(featureId: unknown): featureId is string {
  return (
    typeof featureId === "string" &&
    soothsayerFeatures.some((feature) => feature.id === featureId)
  );
}
