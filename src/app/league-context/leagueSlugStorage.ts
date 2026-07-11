import { safeGetItem, safeSetItem } from "../../lib/safeLocalStorage";

const STORAGE_KEY = "leagueSlugByGame";

export function loadLeagueSlugs(): Record<string, string> {
  try {
    return JSON.parse(safeGetItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function persistLeagueSlugs(
  slugsByGame: Record<string, string>,
): Record<string, string> {
  safeSetItem(STORAGE_KEY, JSON.stringify(slugsByGame));
  return slugsByGame;
}
