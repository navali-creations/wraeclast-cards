import { EGame } from "../enums";
import { gameToLabel, gameToSeoLabel, gameToSlug } from "./gameSlug";
import { serializeJsonForHtml } from "./seoDocument";
import {
  type CardSeoFacts,
  createCardNotFoundSeoMetadata,
  createCardSeoMetadata,
  createLeagueSeoMetadata,
  createRootSeoMetadata,
  createStaticPageSeoMetadata,
  type LeagueSeoFacts,
  type SeoMetadata,
  SITE_NAME,
  SITE_URL,
} from "./seoMetadata";

interface GameLeagueSeoOptions {
  game: EGame;
  leagueSlug: string;
  page: "home" | "cards" | "stacked-decks";
}

interface GameLeagueCardSeoOptions {
  game: EGame;
  leagueSlug: string;
  cardId: string;
  leagueName?: string;
  facts?: CardSeoFacts;
  status?: "error" | "not-found";
}

interface StaticSeoFactsPayload<T> {
  pathname: string;
  facts?: T;
  status?: "error" | "not-found";
}

function absoluteUrl(pathname: string): string {
  return new URL(pathname, SITE_URL).href;
}

function readStaticPagePayload<T>(
  pathname: string,
): StaticSeoFactsPayload<T> | undefined {
  if (typeof document === "undefined") return undefined;

  const element = document.querySelector<HTMLScriptElement>(
    "script[data-seo-page-facts]",
  );
  if (!element?.textContent) return undefined;

  try {
    const payload = JSON.parse(element.textContent) as StaticSeoFactsPayload<T>;
    return payload.pathname === pathname ? payload : undefined;
  } catch {
    return undefined;
  }
}

export function removeStaticSeoElements() {
  if (typeof document === "undefined") return;

  document.querySelectorAll("[data-seo-static]").forEach((element) => {
    element.remove();
  });
}

function createSeoHead(metadata: SeoMetadata) {
  const canonicalUrl = absoluteUrl(metadata.pathname);
  const imageUrl = metadata.imagePath
    ? absoluteUrl(metadata.imagePath)
    : undefined;

  return {
    meta: [
      { title: metadata.title },
      { name: "description", content: metadata.description },
      {
        name: "robots",
        content: metadata.robots ?? "index, follow",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "en_US" },
      { property: "og:title", content: metadata.title },
      { property: "og:description", content: metadata.description },
      metadata.canonical === false
        ? undefined
        : { property: "og:url", content: canonicalUrl },
      imageUrl ? { property: "og:image", content: imageUrl } : undefined,
      metadata.imageAlt
        ? { property: "og:image:alt", content: metadata.imageAlt }
        : undefined,
      {
        name: "twitter:card",
        content: imageUrl ? "summary_large_image" : "summary",
      },
      { name: "twitter:title", content: metadata.title },
      { name: "twitter:description", content: metadata.description },
      imageUrl ? { name: "twitter:image", content: imageUrl } : undefined,
      metadata.imageAlt
        ? { name: "twitter:image:alt", content: metadata.imageAlt }
        : undefined,
    ],
    links:
      metadata.canonical === false
        ? []
        : [{ rel: "canonical", href: canonicalUrl }],
    scripts: metadata.structuredData?.map((structuredData) => ({
      type: "application/ld+json",
      children: serializeJsonForHtml(structuredData),
    })),
  };
}

export function leagueSlugToName(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

export function createRootSeoHead() {
  return createSeoHead(createRootSeoMetadata());
}

export function createGameLeagueSeoHead({
  game,
  leagueSlug,
  page,
}: GameLeagueSeoOptions) {
  const gameSlug = gameToSlug(game);
  const gameLabel = gameToLabel(game);
  const leagueName = leagueSlugToName(leagueSlug);
  const pathname =
    page === "home"
      ? `/${gameSlug}/${leagueSlug}`
      : `/${gameSlug}/${leagueSlug}/${page}`;

  return createSeoHead(
    createLeagueSeoMetadata({
      gameLabel,
      gameSeoLabel: gameToSeoLabel(game),
      gameSlug,
      leagueName,
      leagueSlug,
      page,
      // PoE 2 routes are placeholders until their datasets exist.
      robots: game === EGame.Poe2 ? "noindex, follow" : "index, follow",
      // Production HTML embeds the same facts used by the static generator so
      // React recreates identical metadata after replacing the initial tags.
      facts: readStaticPagePayload<LeagueSeoFacts>(pathname)?.facts,
    }),
  );
}

export function createGameLeagueCardSeoHead({
  game,
  leagueSlug,
  cardId,
  leagueName = leagueSlugToName(leagueSlug),
  facts: routeFacts,
  status: routeStatus,
}: GameLeagueCardSeoOptions) {
  const sharedOptions = {
    gameLabel: gameToLabel(game),
    gameSeoLabel: gameToSeoLabel(game),
    gameSlug: gameToSlug(game),
    leagueName,
    leagueSlug,
  };
  const fallbackMetadata = createCardSeoMetadata({
    ...sharedOptions,
    facts: { name: leagueSlugToName(cardId), slug: cardId },
    robots: "noindex, follow",
  });
  const hasRouteResult = routeFacts !== undefined || routeStatus !== undefined;
  const payload = hasRouteResult
    ? undefined
    : readStaticPagePayload<CardSeoFacts>(fallbackMetadata.pathname);
  const status = routeStatus ?? payload?.status;
  if (status === "not-found") {
    return createSeoHead(
      createCardNotFoundSeoMetadata(fallbackMetadata.pathname),
    );
  }

  const facts = routeFacts ?? payload?.facts;

  return createSeoHead(
    facts
      ? createCardSeoMetadata({
          ...sharedOptions,
          facts,
          robots: "index, follow",
        })
      : fallbackMetadata,
  );
}

export function createStaticPageSeoHead(
  page: "soothsayer" | "privacy" | "attributions" | "downloads" | "auth",
) {
  return createSeoHead(createStaticPageSeoMetadata(page));
}
