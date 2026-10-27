import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const FETCH_TIMEOUT_MS = 15_000;

function getResourceLocation(baseUrl, outputDirectory, resource) {
  const url = new URL(resource, baseUrl);

  if (
    url.origin !== baseUrl.origin ||
    !url.pathname.startsWith(baseUrl.pathname) ||
    url.search ||
    url.hash
  ) {
    throw new Error(`Invalid drop-rate resource URL: ${url.href}`);
  }

  const relativePath = decodeURIComponent(
    url.pathname.slice(baseUrl.pathname.length),
  );
  const outputRoot = path.resolve(outputDirectory);
  const outputPath = path.resolve(outputRoot, relativePath);

  if (
    !relativePath ||
    (outputPath !== outputRoot &&
      !outputPath.startsWith(`${outputRoot}${path.sep}`))
  ) {
    throw new Error(`Invalid drop-rate resource path: ${relativePath}`);
  }

  return { outputPath, url };
}

export async function hydratePreviewDropRates({ baseUrl, outputDirectory }) {
  const normalizedBaseUrl = new URL(`${baseUrl.replace(/\/$/, "")}/`);
  const downloads = new Map();

  function downloadJson(resource) {
    const { outputPath, url } = getResourceLocation(
      normalizedBaseUrl,
      outputDirectory,
      resource,
    );

    const existingDownload = downloads.get(url.href);
    if (existingDownload) {
      return existingDownload;
    }

    const download = (async () => {
      const response = await fetch(url, {
        headers: { accept: "application/json" },
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });

      if (!response.ok) {
        throw new Error(
          `Could not download ${url.href}: ${response.status} ${response.statusText}`,
        );
      }

      const body = await response.text();
      let data;

      try {
        data = JSON.parse(body);
      } catch (error) {
        throw new Error(`Invalid JSON returned by ${url.href}`, {
          cause: error,
        });
      }

      await mkdir(path.dirname(outputPath), { recursive: true });
      await writeFile(outputPath, body, "utf8");

      return data;
    })();

    downloads.set(url.href, download);
    return download;
  }

  const rootIndex = await downloadJson("index.json");
  const games = Object.entries(rootIndex.games ?? {});

  await Promise.all(
    games.map(([game]) => {
      if (!/^[a-z0-9-]+$/.test(game)) {
        throw new Error(`Invalid game identifier in drop-rate index: ${game}`);
      }

      return downloadJson(`${game}/index.json`);
    }),
  );

  const leagues = games.flatMap(([, game]) => game.leagues ?? []);
  const leagueDocuments = await Promise.all(
    leagues.map(async (league) => {
      if (typeof league.url !== "string" || !league.url) {
        throw new Error("Drop-rate league index entry is missing its URL");
      }

      return downloadJson(league.url);
    }),
  );

  await Promise.all(
    leagueDocuments.flatMap((league) => {
      const context = league.context ?? {};

      return [context.time_buckets_url, context.locations_url]
        .filter((resource) => typeof resource === "string" && resource)
        .map((resource) => downloadJson(resource));
    }),
  );

  await Promise.all(downloads.values());

  return downloads.size;
}
