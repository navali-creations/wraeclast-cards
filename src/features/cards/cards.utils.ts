import {
  divinationCardMarkupToText,
  normalizeDivinationCardWikiMarkup,
} from "../../lib/divinationCards";

const REWARD_TAG_LABELS: Record<string, string> = {
  augmented: "Quality",
  corrupted: "Corrupted",
  crafted: "Crafted",
  currency: "Currency",
  default: "Default",
  divination: "Divination",
  enchanted: "Enchanted",
  fractured: "Fractured",
  gem: "Gem",
  magic: "Magic",
  normal: "Normal",
  rare: "Rare",
  unique: "Unique",
  white: "White",
};

export function stripHtmlText(html: string): string {
  return divinationCardMarkupToText(html);
}

export function cleanRewardHtml(html: string): string {
  let result = normalizeDivinationCardWikiMarkup(html, "");

  let prev = "";
  while (prev !== result) {
    prev = result;
    result = result.replace(
      /<span[^>]*class=(["'])(.*?)\1[^>]*>([\s\S]*?)<\/span>/gi,
      (match, _quote, className, content) =>
        className.trim().split(/\s+/).includes("tc") ? match : content,
    );
  }

  return result.trim();
}

export function getRewardSearchText(html: string): string {
  return divinationCardMarkupToText(html);
}

export function extractRewardTags(html: string | undefined): string[] {
  if (!html) return [];

  const tags = new Set<string>();
  const classMatches = html.matchAll(/class=(["'])(.*?)\1/g);

  for (const match of classMatches) {
    const classNames = match[2].trim().split(/\s+/);
    if (!classNames.includes("tc")) continue;

    for (const className of classNames) {
      if (/^-[a-z0-9-]+$/i.test(className)) {
        tags.add(className.slice(1).toLowerCase());
      }
    }
  }

  return [...tags].sort();
}

export function getRewardTagLabel(tag: string): string {
  return (
    REWARD_TAG_LABELS[tag] ??
    tag
      .split("-")
      .filter(Boolean)
      .map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
      .join(" ")
  );
}
