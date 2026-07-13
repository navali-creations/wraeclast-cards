import { sign } from "node:crypto";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SEARCH_CONSOLE_API_URL = "https://www.googleapis.com/webmasters/v3";
const SEARCH_CONSOLE_SCOPE = "https://www.googleapis.com/auth/webmasters";

const clientEmail = process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL;
const rawPrivateKey = process.env.GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY;
const siteUrl =
  process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL ?? "sc-domain:wraeclast.cards";
const sitemapUrl =
  process.env.GOOGLE_SEARCH_CONSOLE_SITEMAP_URL ??
  "https://wraeclast.cards/sitemap.xml";

if (!clientEmail && !rawPrivateKey) {
  console.log(
    "[seo] Skipping Google sitemap submission because Search Console credentials are not configured.",
  );
  process.exit(0);
}

if (!clientEmail || !rawPrivateKey) {
  throw new Error(
    "Both GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL and GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY are required.",
  );
}

function encodeJson(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

async function waitForPublishedSitemap() {
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const response = await fetch(sitemapUrl, { cache: "no-store" });
    const body = await response.text();
    const isSitemap =
      response.ok &&
      (body.includes(
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ) ||
        body.includes(
          '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ));

    if (isSitemap) return;
    if (attempt === 5) {
      throw new Error(
        `The deployed sitemap is not available as XML at ${sitemapUrl} (last response: ${response.status} ${response.headers.get("content-type") ?? "unknown content type"}).`,
      );
    }

    await new Promise((resolve) => setTimeout(resolve, attempt * 2_000));
  }
}

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1_000);
  const unsignedToken = `${encodeJson({ alg: "RS256", typ: "JWT" })}.${encodeJson(
    {
      iss: clientEmail,
      scope: SEARCH_CONSOLE_SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3_600,
    },
  )}`;
  const privateKey = rawPrivateKey.replace(/\\n/g, "\n");
  const signature = sign(
    "RSA-SHA256",
    Buffer.from(unsignedToken),
    privateKey,
  ).toString("base64url");

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsignedToken}.${signature}`,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Google OAuth token request failed (${response.status}): ${await response.text()}`,
    );
  }

  const payload = await response.json();
  if (!payload.access_token) {
    throw new Error("Google OAuth response did not include an access token.");
  }
  return payload.access_token;
}

await waitForPublishedSitemap();
const accessToken = await getAccessToken();
const endpoint = `${SEARCH_CONSOLE_API_URL}/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`;
const response = await fetch(endpoint, {
  method: "PUT",
  headers: { authorization: `Bearer ${accessToken}` },
});

if (!response.ok) {
  throw new Error(
    `Google Search Console sitemap submission failed (${response.status}): ${await response.text()}`,
  );
}

console.log(
  `[seo] Submitted ${sitemapUrl} for ${siteUrl} to Google Search Console.`,
);
