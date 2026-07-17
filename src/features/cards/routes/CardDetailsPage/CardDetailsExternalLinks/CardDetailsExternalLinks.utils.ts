function toUnderscoreSlug(name: string) {
  return name.trim().replace(/\s+/g, "_");
}

function toKebabSlug(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getPoeWikiUrl(name: string) {
  return `https://www.poewiki.net/wiki/${toUnderscoreSlug(name)}`;
}

export function getPoeNinjaUrl(name: string, league: string) {
  return `https://poe.ninja/poe1/economy/${league.toLowerCase()}/divination-cards/${toKebabSlug(name)}`;
}

export function getPoeDbUrl(name: string) {
  return `https://poedb.tw/us/${toUnderscoreSlug(name)}`;
}
