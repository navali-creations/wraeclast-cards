type Env = {
  SUPABASE_URL?: string;
  WRAECLAST_CARDS_API_KEY?: string;
};

type PagesContext = {
  request: Request;
  env: Env;
  waitUntil: (promise: Promise<unknown>) => void;
};

const CACHE_SECONDS = 24 * 60 * 60;
const BROWSER_CACHE_SECONDS = 5 * 60;

const RESPONSE_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
};

function jsonResponse(body: unknown, status: number): Response {
  return Response.json(body, {
    status,
    headers: RESPONSE_HEADERS,
  });
}

function addCacheStatus(response: Response, status: "HIT" | "MISS"): Response {
  const next = new Response(response.body, response);
  next.headers.set("X-Cache", status);
  return next;
}

function normalizeSupabaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

export function onRequestOptions(): Response {
  return new Response(null, {
    status: 204,
    headers: RESPONSE_HEADERS,
  });
}

export async function onRequestGet(context: PagesContext): Promise<Response> {
  const requestUrl = new URL(context.request.url);
  const game = requestUrl.searchParams.get("game");

  if (game !== "poe1" && game !== "poe2") {
    return jsonResponse({ error: "Invalid game" }, 400);
  }

  const supabaseUrl = context.env.SUPABASE_URL;
  const apiKey = context.env.WRAECLAST_CARDS_API_KEY;

  if (!supabaseUrl || !apiKey) {
    return jsonResponse({ error: "Server misconfigured" }, 500);
  }

  const cacheUrl = new URL(requestUrl.origin);
  cacheUrl.pathname = requestUrl.pathname;
  cacheUrl.searchParams.set("game", game);

  const cacheKey = new Request(cacheUrl.toString(), { method: "GET" });
  const cache = caches.default;
  const cached = await cache.match(cacheKey);

  if (cached) {
    return addCacheStatus(cached, "HIT");
  }

  const upstreamUrl = `${normalizeSupabaseUrl(supabaseUrl)}/functions/v1/get-community-drop-rates?game=${game}`;

  const upstream = await fetch(upstreamUrl, {
    headers: {
      Accept: "application/json",
      "x-api-key": apiKey,
    },
  });

  const response = addCacheStatus(upstream, "MISS");
  response.headers.delete("Set-Cookie");
  response.headers.set(
    "Cache-Control",
    `public, max-age=${BROWSER_CACHE_SECONDS}, s-maxage=${CACHE_SECONDS}`,
  );
  response.headers.set(
    "Cloudflare-CDN-Cache-Control",
    `max-age=${CACHE_SECONDS}`,
  );
  response.headers.set("Access-Control-Allow-Origin", "*");

  if (upstream.ok) {
    context.waitUntil(cache.put(cacheKey, response.clone()));
  }

  return response;
}
