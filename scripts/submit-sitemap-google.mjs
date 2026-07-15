import { sign } from "node:crypto";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SEARCH_CONSOLE_API_URL = "https://www.googleapis.com/webmasters/v3";
const SEARCH_CONSOLE_SCOPE = "https://www.googleapis.com/auth/webmasters";
const TRANSIENT_RESPONSE_STATUSES = new Set([408, 429, 500, 502, 503, 504]);

const clientEmail = process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL;
const rawPrivateKey = process.env.GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY;
const failOnError = process.env.GOOGLE_SEARCH_CONSOLE_FAIL_ON_ERROR !== "false";
const siteUrl =
  process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL ?? "sc-domain:wraeclast.cards";
const sitemapUrl =
  process.env.GOOGLE_SEARCH_CONSOLE_SITEMAP_URL ??
  "https://wraeclast.cards/sitemap.xml";

function encodeJson(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isSitemapXml(response, body) {
  return (
    response.ok &&
    (body.includes(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ) ||
      body.includes(
        '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ))
  );
}

async function waitForPublishedSitemap() {
  let lastResult = "no response";

  for (let attempt = 1; attempt <= 12; attempt += 1) {
    try {
      const response = await fetch(sitemapUrl, { cache: "no-store" });
      const body = await response.text();

      if (isSitemapXml(response, body)) return;

      lastResult = `${response.status} ${response.headers.get("content-type") ?? "unknown content type"}`;
    } catch (error) {
      lastResult = error instanceof Error ? error.message : String(error);
    }

    if (attempt < 12) {
      await wait(Math.min(attempt * 5_000, 30_000));
    }
  }

  throw new Error(
    `The deployed sitemap is not available as XML at ${sitemapUrl} (last response: ${lastResult}).`,
  );
}

async function fetchWithRetry(url, init, label) {
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, init);
      if (!TRANSIENT_RESPONSE_STATUSES.has(response.status) || attempt === 3) {
        return response;
      }

      lastError = new Error(`${label} returned ${response.status}`);
    } catch (error) {
      lastError = error;
      if (attempt === 3) break;
    }

    await wait(attempt * 2_000);
  }

  throw lastError;
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

  const response = await fetchWithRetry(
    TOKEN_URL,
    {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: `${unsignedToken}.${signature}`,
      }),
    },
    "Google OAuth token request",
  );

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

function escapeGithubCommand(value) {
  return value
    .replaceAll("%", "%25")
    .replaceAll("\r", "%0D")
    .replaceAll("\n", "%0A");
}

function warnSubmissionFailure(error) {
  const message = error instanceof Error ? error.message : String(error);

  if (process.env.GITHUB_ACTIONS === "true") {
    console.warn(
      `::warning title=Google sitemap submission skipped::${escapeGithubCommand(message)}`,
    );
  }

  console.warn(`[seo] Google sitemap submission skipped: ${message}`);
}

async function main() {
  if (!clientEmail && !rawPrivateKey) {
    console.log(
      "[seo] Skipping Google sitemap submission because Search Console credentials are not configured.",
    );
    return;
  }

  if (!clientEmail || !rawPrivateKey) {
    throw new Error(
      "Both GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL and GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY are required.",
    );
  }

  await waitForPublishedSitemap();
  const accessToken = await getAccessToken();
  const endpoint = `${SEARCH_CONSOLE_API_URL}/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`;
  const response = await fetchWithRetry(
    endpoint,
    {
      method: "PUT",
      headers: { authorization: `Bearer ${accessToken}` },
    },
    "Google Search Console sitemap submission",
  );

  if (!response.ok) {
    throw new Error(
      `Google Search Console sitemap submission failed (${response.status}): ${await response.text()}`,
    );
  }

  console.log(
    `[seo] Submitted ${sitemapUrl} for ${siteUrl} to Google Search Console.`,
  );
}

try {
  await main();
} catch (error) {
  if (failOnError) {
    throw error;
  }

  warnSubmissionFailure(error);
}
