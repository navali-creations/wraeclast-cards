import { type SeoMetadata, SITE_NAME, SITE_URL } from "./seoMetadata.ts";

export interface SeoDocumentMetadata extends SeoMetadata {
  body?: string;
  seoPageFacts?: unknown;
  seoPageStatus?: "not-found";
}

const SEO_HEAD_MARKER = "<!--wraeclast-seo-head-->";
const SEO_BODY_MARKER = "<!--wraeclast-seo-body-->";

export function htmlEscape(value: unknown): string {
  return String(value).replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return character;
    }
  });
}

export function fallbackPage(body: string): string {
  return `<main class="mx-auto w-full max-w-300 px-4 py-8 text-(--wc-text-70)">${body}</main>`;
}

function absoluteUrl(pathname: string, siteUrl: string): string {
  return new URL(pathname, siteUrl).href;
}

export function serializeJsonForHtml(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function renderSeoMetadata(
  metadata: SeoDocumentMetadata,
  siteUrl = SITE_URL,
): string {
  const canonicalUrl =
    metadata.canonical === false
      ? null
      : absoluteUrl(metadata.pathname, siteUrl);
  const imageUrl = metadata.imagePath
    ? absoluteUrl(metadata.imagePath, siteUrl)
    : null;
  const tags = [
    `<title data-seo-static>${htmlEscape(metadata.title)}</title>`,
    `<meta data-seo-static name="description" content="${htmlEscape(metadata.description)}">`,
    `<meta data-seo-static name="robots" content="${htmlEscape(metadata.robots ?? "index, follow")}">`,
    `<meta data-seo-static property="og:type" content="website">`,
    `<meta data-seo-static property="og:site_name" content="${SITE_NAME}">`,
    `<meta data-seo-static property="og:locale" content="en_US">`,
    `<meta data-seo-static property="og:title" content="${htmlEscape(metadata.title)}">`,
    `<meta data-seo-static property="og:description" content="${htmlEscape(metadata.description)}">`,
    `<meta data-seo-static name="twitter:card" content="${imageUrl ? "summary_large_image" : "summary"}">`,
    `<meta data-seo-static name="twitter:title" content="${htmlEscape(metadata.title)}">`,
    `<meta data-seo-static name="twitter:description" content="${htmlEscape(metadata.description)}">`,
  ];

  if (canonicalUrl) {
    tags.push(
      `<link data-seo-static rel="canonical" href="${htmlEscape(canonicalUrl)}">`,
      `<meta data-seo-static property="og:url" content="${htmlEscape(canonicalUrl)}">`,
    );
  }

  if (imageUrl) {
    tags.push(
      `<meta data-seo-static property="og:image" content="${htmlEscape(imageUrl)}">`,
      `<meta data-seo-static name="twitter:image" content="${htmlEscape(imageUrl)}">`,
    );
  }

  if (metadata.imageAlt) {
    tags.push(
      `<meta data-seo-static property="og:image:alt" content="${htmlEscape(metadata.imageAlt)}">`,
      `<meta data-seo-static name="twitter:image:alt" content="${htmlEscape(metadata.imageAlt)}">`,
    );
  }

  for (const structuredData of metadata.structuredData ?? []) {
    tags.push(
      `<script data-seo-static type="application/ld+json">${serializeJsonForHtml(structuredData)}</script>`,
    );
  }

  if (
    metadata.seoPageFacts !== undefined ||
    metadata.seoPageStatus !== undefined
  ) {
    tags.push(
      `<script data-seo-page-facts type="application/json">${serializeJsonForHtml(
        {
          pathname: metadata.pathname,
          facts: metadata.seoPageFacts,
          status: metadata.seoPageStatus,
        },
      )}</script>`,
    );
  }

  return tags.join("\n    ");
}

export function renderSeoDocument(
  template: string,
  metadata: SeoDocumentMetadata,
  siteUrl = SITE_URL,
): string {
  const withoutExistingSeo = template
    .replace(/\s*<title(?:\s[^>]*)?>[\s\S]*?<\/title>/gi, "")
    .replace(/\s*<(?:meta|link)\b[^>]*data-seo-static[^>]*>/gi, "")
    .replace(/\s*<script\b[^>]*data-seo-static[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(
      /\s*<script[^>]+data-seo-page-facts[^>]*>[\s\S]*?<\/script>/gi,
      "",
    );

  if (
    !withoutExistingSeo.includes(SEO_HEAD_MARKER) ||
    !withoutExistingSeo.includes(SEO_BODY_MARKER)
  ) {
    throw new Error("SEO template markers are missing from the app shell");
  }

  const withHead = withoutExistingSeo.replace(
    SEO_HEAD_MARKER,
    `${renderSeoMetadata(metadata, siteUrl)}\n    ${SEO_HEAD_MARKER}`,
  );

  return withHead.replace(
    SEO_BODY_MARKER,
    `${metadata.body ?? ""}${SEO_BODY_MARKER}`,
  );
}
