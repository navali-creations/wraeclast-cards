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
  canonical?: boolean;
}

export interface LeagueSeoFacts {
  cardCount?: number;
  observedTotal?: number;
  generatedAt?: string;
  dataPath?: string;
}

export interface CardSeoFacts {
  name: string;
  slug: string;
  rewardText?: string;
  stackSize?: number;
  fromBoss?: boolean;
  rarity?: string;
  imageUrl?: string;
  observedCount?: number;
  observedRate?: number;
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

interface CardSeoOptions {
  gameLabel: string;
  gameSeoLabel: string;
  gameSlug: string;
  leagueName: string;
  leagueSlug: string;
  facts: CardSeoFacts;
  robots?: RobotsDirective;
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
  siteUrl: string,
  items: readonly { name: string; pathname: string }[],
) {
  const itemListElement = [{ name: SITE_NAME, pathname: "/" }, ...items].map(
    ({ name, pathname }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: absoluteUrl(pathname, siteUrl),
    }),
  );

  return {
    "@type": "BreadcrumbList",
    itemListElement,
  };
}

function sentence(value: string): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  return /[.!?]$/.test(normalized) ? normalized : `${normalized}.`;
}

function truncateDescription(value: string, maxLength = 200): string {
  if (value.length <= maxLength) return value;

  const truncated = value.slice(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(" ");
  return `${truncated.slice(0, Math.max(lastSpace, maxLength - 30)).trimEnd()}...`;
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
              mainEntity: {
                "@type": "ItemList",
                "@id": `${absoluteUrl(pathname, siteUrl)}#cards`,
                ...(cardCount === undefined
                  ? {}
                  : { numberOfItems: cardCount }),
              },
              inLanguage: "en",
            },
            createBreadcrumbs(siteUrl, [
              { name: `${gameLabel} ${leagueName}`, pathname: leaguePath },
              { name: "Divination Cards", pathname },
            ]),
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
            createBreadcrumbs(siteUrl, [
              { name: `${gameLabel} ${leagueName}`, pathname: leaguePath },
              { name: "Stacked Deck Drop Rates", pathname },
            ]),
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
          createBreadcrumbs(siteUrl, [
            { name: `${gameLabel} ${leagueName}`, pathname: leaguePath },
          ]),
        ],
      },
    ],
  };
}

export function createCardSeoMetadata({
  gameLabel,
  gameSeoLabel,
  gameSlug,
  leagueName,
  leagueSlug,
  facts,
  robots = "index, follow",
  siteUrl = SITE_URL,
}: CardSeoOptions): SeoMetadata {
  const leaguePath = `/${gameSlug}/${leagueSlug}`;
  const cardsPath = `${leaguePath}/cards`;
  const cardPath = `${cardsPath}/${facts.slug}`;
  const title = `${facts.name} Divination Card | ${leagueName} | ${SITE_NAME}`;
  const descriptionParts = [
    `${facts.name} is a ${gameSeoLabel} divination card for the ${leagueName} league.`,
  ];

  if (facts.rewardText) {
    descriptionParts.push(`Reward: ${sentence(facts.rewardText)}`);
  }

  if (facts.stackSize !== undefined) {
    const cardLabel = facts.stackSize === 1 ? "card" : "cards";
    descriptionParts.push(
      `Complete a stack with ${facts.stackSize.toLocaleString("en-US")} ${cardLabel}.`,
    );
  }

  if (facts.observedCount) {
    descriptionParts.push(
      `${facts.observedCount.toLocaleString("en-US")} drops have been observed.`,
    );
  }

  const description = truncateDescription(descriptionParts.join(" "));
  const additionalProperty = [
    facts.rewardText
      ? {
          "@type": "PropertyValue",
          name: "Reward",
          value: facts.rewardText,
        }
      : undefined,
    facts.stackSize !== undefined
      ? {
          "@type": "PropertyValue",
          name: "Stack size",
          value: facts.stackSize,
        }
      : undefined,
    facts.rarity
      ? {
          "@type": "PropertyValue",
          name: "Rarity",
          value: facts.rarity,
        }
      : undefined,
    facts.fromBoss !== undefined
      ? {
          "@type": "PropertyValue",
          name: "Source",
          value: facts.fromBoss ? "Boss drop" : "Not boss-specific",
        }
      : undefined,
    facts.observedCount !== undefined
      ? {
          "@type": "PropertyValue",
          name: "Observed drops",
          value: facts.observedCount,
        }
      : undefined,
    facts.observedRate !== undefined
      ? {
          "@type": "PropertyValue",
          name: "Observed drop rate",
          value: facts.observedRate * 100,
          unitText: "%",
        }
      : undefined,
  ].filter((property) => property !== undefined);

  return {
    pathname: cardPath,
    title,
    description,
    robots,
    imagePath: facts.imageUrl,
    imageAlt: facts.imageUrl
      ? `${facts.name} divination card artwork`
      : undefined,
    structuredData: [
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "ItemPage",
            name: title,
            description,
            url: absoluteUrl(cardPath, siteUrl),
            isPartOf: {
              "@type": "CollectionPage",
              "@id": absoluteUrl(cardsPath, siteUrl),
            },
            mainEntity: {
              "@type": "Thing",
              name: facts.name,
              description: facts.rewardText,
              ...(facts.imageUrl ? { image: facts.imageUrl } : {}),
              additionalProperty,
            },
            about: { "@type": "VideoGame", name: gameSeoLabel },
            inLanguage: "en",
          },
          createBreadcrumbs(siteUrl, [
            { name: `${gameLabel} ${leagueName}`, pathname: leaguePath },
            { name: "Divination Cards", pathname: cardsPath },
            { name: facts.name, pathname: cardPath },
          ]),
        ],
      },
    ],
  };
}

export function createCardNotFoundSeoMetadata(pathname: string): SeoMetadata {
  return {
    pathname,
    title: `Card Not Found | ${SITE_NAME}`,
    description: "The requested divination card could not be found.",
    robots: "noindex, nofollow",
    canonical: false,
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
