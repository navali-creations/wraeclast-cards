export const SITE_NAME = "wraeclast.cards";
export const SITE_URL = "https://wraeclast.cards";
export const PROHIBITED_LIBRARY_REFERENCE_URL =
  "https://docs.google.com/spreadsheets/d/1PmGES_e1on6K7O5ghHuoorEjruAVb7dQ5m7PGrW7t80/edit?gid=272334906#gid=272334906";

export const DEFAULT_DESCRIPTION =
  "Path of Exile divination card data, community-observed stacked deck drop rates, and the open-source Soothsayer desktop tracker.";

export type RobotsDirective =
  | "index, follow"
  | "noindex, follow"
  | "noindex, nofollow";

export type StructuredData = Record<string, unknown>;

export interface SeoMetadata {
  pathname: string;
  title: string;
  description: string;
  robots?: RobotsDirective;
  imagePath?: string;
  imageAlt?: string;
  structuredData?: StructuredData[];
}

export interface LeagueSeoFacts {
  cardCount?: number;
  observedTotal?: number;
  generatedAt?: string;
  dataPath?: string;
}

interface LeagueSeoOptions {
  gameLabel: string;
  gameSeoLabel: string;
  gameSlug: string;
  leagueName: string;
  leagueSlug: string;
  page: "home" | "cards" | "stacked-decks";
  robots?: RobotsDirective;
  facts?: LeagueSeoFacts;
  siteUrl?: string;
}

function absoluteUrl(pathname: string, siteUrl: string): string {
  return new URL(pathname, siteUrl).href;
}

function organizationReference(siteUrl: string) {
  return {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "Navali Creations",
    url: siteUrl,
  };
}

function createBreadcrumbs(
  gameLabel: string,
  leagueName: string,
  leaguePath: string,
  siteUrl: string,
  page?: { name: string; pathname: string },
) {
  const itemListElement = [
    {
      "@type": "ListItem",
      position: 1,
      name: SITE_NAME,
      item: absoluteUrl("/", siteUrl),
    },
    {
      "@type": "ListItem",
      position: 2,
      name: `${gameLabel} ${leagueName}`,
      item: absoluteUrl(leaguePath, siteUrl),
    },
  ];

  if (page) {
    itemListElement.push({
      "@type": "ListItem",
      position: 3,
      name: page.name,
      item: absoluteUrl(page.pathname, siteUrl),
    });
  }

  return {
    "@type": "BreadcrumbList",
    itemListElement,
  };
}

export function createRootSeoMetadata(siteUrl = SITE_URL): SeoMetadata {
  return {
    pathname: "/",
    title: `${SITE_NAME} | Path of Exile Divination Card Data`,
    description: DEFAULT_DESCRIPTION,
    structuredData: [
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": `${siteUrl}/#organization`,
            name: "Navali Creations",
            url: siteUrl,
            logo: `${siteUrl}/organization-logo.svg`,
            sameAs: ["https://github.com/navali-creations"],
          },
          {
            "@type": "WebSite",
            "@id": `${siteUrl}/#website`,
            url: siteUrl,
            name: SITE_NAME,
            description: DEFAULT_DESCRIPTION,
            publisher: { "@id": `${siteUrl}/#organization` },
            inLanguage: "en",
          },
        ],
      },
    ],
  };
}

export function createLeagueSeoMetadata({
  gameLabel,
  gameSeoLabel,
  gameSlug,
  leagueName,
  leagueSlug,
  page,
  robots = "index, follow",
  facts = {},
  siteUrl = SITE_URL,
}: LeagueSeoOptions): SeoMetadata {
  const leaguePath = `/${gameSlug}/${leagueSlug}`;
  const pathname = page === "home" ? leaguePath : `${leaguePath}/${page}`;
  const cardCount = facts.cardCount;
  const observedTotal = facts.observedTotal;
  const formattedCards = cardCount?.toLocaleString("en-US") ?? "all";
  const formattedObservations = observedTotal?.toLocaleString("en-US");

  if (page === "cards") {
    const title = `${leagueName} Divination Cards | ${SITE_NAME}`;
    const description = `Browse ${formattedCards} ${gameLabel} divination cards for the ${leagueName} league, including rewards, stack sizes, artwork, flavour text, and rarity data.`;

    return {
      pathname,
      title,
      description,
      robots,
      structuredData: [
        {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              name: title,
              description,
              url: absoluteUrl(pathname, siteUrl),
              isPartOf: { "@id": `${siteUrl}/#website` },
              ...(cardCount === undefined ? {} : { numberOfItems: cardCount }),
              inLanguage: "en",
            },
            createBreadcrumbs(gameLabel, leagueName, leaguePath, siteUrl, {
              name: "Divination Cards",
              pathname,
            }),
          ],
        },
      ],
    };
  }

  if (page === "stacked-decks") {
    const title = `${leagueName} Stacked Deck Drop Rates | ${SITE_NAME}`;
    const observationText = formattedObservations
      ? `${formattedObservations} community-observed ${gameLabel} stacked deck openings`
      : `community-observed ${gameLabel} stacked deck drop rates`;
    const description = `Explore ${observationText} for the ${leagueName} league and compare player findings with reference estimates.`;

    return {
      pathname,
      title,
      description,
      robots,
      structuredData: [
        {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Dataset",
              name: title,
              description,
              url: absoluteUrl(pathname, siteUrl),
              identifier: absoluteUrl(pathname, siteUrl),
              creator: organizationReference(siteUrl),
              isPartOf: { "@id": `${siteUrl}/#website` },
              isAccessibleForFree: true,
              ...(facts.generatedAt ? { dateModified: facts.generatedAt } : {}),
              measurementTechnique:
                "Aggregated community uploads from Soothsayer stacked deck sessions",
              variableMeasured: [
                "reported card drops",
                "observed drop rate",
                "community-estimated weight",
                "reference weight",
              ],
              ...(facts.dataPath
                ? {
                    distribution: {
                      "@type": "DataDownload",
                      contentUrl: absoluteUrl(facts.dataPath, siteUrl),
                      encodingFormat: "application/json",
                    },
                  }
                : {}),
              isBasedOn: PROHIBITED_LIBRARY_REFERENCE_URL,
              inLanguage: "en",
            },
            createBreadcrumbs(gameLabel, leagueName, leaguePath, siteUrl, {
              name: "Stacked Deck Drop Rates",
              pathname,
            }),
          ],
        },
      ],
    };
  }

  const title = `${gameSeoLabel}: ${leagueName} Divination Card Data | ${SITE_NAME}`;
  const cardText =
    cardCount === undefined
      ? `${gameLabel} divination cards`
      : `${formattedCards} ${gameLabel} divination cards`;
  const observationText =
    observedTotal === undefined
      ? "community-observed stacked deck drop rates"
      : `${formattedObservations} community-observed stacked deck openings`;
  const description = `Explore ${cardText} and ${observationText} for the ${leagueName} league.`;

  return {
    pathname,
    title,
    description,
    robots,
    structuredData: [
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebPage",
            name: title,
            description,
            url: absoluteUrl(pathname, siteUrl),
            isPartOf: { "@id": `${siteUrl}/#website` },
            about: [
              { "@type": "VideoGame", name: gameSeoLabel },
              { "@type": "Thing", name: `${leagueName} league` },
            ],
            inLanguage: "en",
          },
          createBreadcrumbs(gameLabel, leagueName, leaguePath, siteUrl),
        ],
      },
    ],
  };
}

export function createStaticPageSeoMetadata(
  page: "soothsayer" | "privacy" | "attributions" | "downloads" | "auth",
  siteUrl = SITE_URL,
): SeoMetadata {
  switch (page) {
    case "soothsayer": {
      const description =
        "Download Soothsayer, an open-source desktop companion for tracking Path of Exile stacked deck sessions, profit, card history, and rarity insights.";

      return {
        pathname: "/soothsayer",
        title: `Soothsayer – Path of Exile Stacked Deck Tracker | ${SITE_NAME}`,
        description,
        imagePath: "/images/soothsayer/stats.webp",
        imageAlt:
          "Soothsayer statistics screen showing stacked deck session charts and summary metrics.",
        structuredData: [
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Soothsayer",
            description,
            url: `${siteUrl}/soothsayer`,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: ["Windows", "Linux"],
            isAccessibleForFree: true,
            offers: {
              "@type": "Offer",
              price: 0,
              priceCurrency: "USD",
            },
            downloadUrl:
              "https://github.com/navali-creations/soothsayer/releases/latest",
            codeRepository: "https://github.com/navali-creations/soothsayer",
            license: "https://www.gnu.org/licenses/agpl-3.0.en.html",
            publisher: organizationReference(siteUrl),
            screenshot: `${siteUrl}/images/soothsayer/stats.webp`,
          },
        ],
      };
    }
    case "privacy":
      return {
        pathname: "/privacy-policy",
        title: `Privacy Policy | ${SITE_NAME}`,
        description:
          "How wraeclast.cards handles anonymous analytics, error reporting, Cloudflare delivery data, and aggregated Soothsayer drop-rate data.",
      };
    case "attributions":
      return {
        pathname: "/attributions",
        title: `Data Sources and Attributions | ${SITE_NAME}`,
        description:
          "Data-source and community attributions for wraeclast.cards, including Prohibited Library, poe.ninja, and the Path of Exile Wiki.",
      };
    case "downloads":
      return {
        pathname: "/downloads",
        title: `Downloads | ${SITE_NAME}`,
        description: "wraeclast.cards downloads.",
        robots: "noindex, follow",
      };
    case "auth":
      return {
        pathname: "/soothsayer/auth",
        title: `Opening Soothsayer | ${SITE_NAME}`,
        description:
          "OAuth callback relay for the Soothsayer desktop application.",
        robots: "noindex, nofollow",
      };
  }
}
