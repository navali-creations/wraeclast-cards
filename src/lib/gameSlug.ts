import { EGame } from "../enums.ts";

export type GameSlug = "path-of-exile" | "path-of-exile-2";

export interface GameMetadata {
  slug: GameSlug;
  label: string;
  seoLabel: string;
}

export const GAME_METADATA: Readonly<Record<EGame, GameMetadata>> = {
  [EGame.Poe1]: {
    slug: "path-of-exile",
    label: "PoE 1",
    seoLabel: "Path of Exile",
  },
  [EGame.Poe2]: {
    slug: "path-of-exile-2",
    label: "PoE 2",
    seoLabel: "Path of Exile 2",
  },
};

const SLUG_TO_GAME: Record<GameSlug, EGame> = {
  "path-of-exile": EGame.Poe1,
  "path-of-exile-2": EGame.Poe2,
};

export function gameToSlug(game: EGame): GameSlug {
  return GAME_METADATA[game].slug;
}

export function gameToLabel(game: EGame): string {
  return GAME_METADATA[game].label;
}

export function gameToSeoLabel(game: EGame): string {
  return GAME_METADATA[game].seoLabel;
}

export function slugToGame(slug: string): EGame | undefined {
  return SLUG_TO_GAME[slug as GameSlug];
}
