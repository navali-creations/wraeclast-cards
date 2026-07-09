import { EGame } from "../enums";

export type GameSlug = "path-of-exile" | "path-of-exile-2";

const GAME_TO_SLUG: Record<EGame, GameSlug> = {
  [EGame.Poe1]: "path-of-exile",
  [EGame.Poe2]: "path-of-exile-2",
};

const SLUG_TO_GAME: Record<GameSlug, EGame> = {
  "path-of-exile": EGame.Poe1,
  "path-of-exile-2": EGame.Poe2,
};

const GAME_TO_LABEL: Record<EGame, string> = {
  [EGame.Poe1]: "PoE 1",
  [EGame.Poe2]: "PoE 2",
};

export function gameToSlug(game: EGame): GameSlug {
  return GAME_TO_SLUG[game];
}

export function gameToLabel(game: EGame): string {
  return GAME_TO_LABEL[game];
}

export function slugToGame(slug: string): EGame | undefined {
  return SLUG_TO_GAME[slug as GameSlug];
}
