// @vitest-environment jsdom

import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { DivinationCardRarity } from "../../../lib/divinationCards";
import type { Card } from "../../cards/types";
import { useRarityPreviewCards } from "./useRarityPreviewCards";

function createCard(
  name: string,
  rarity: DivinationCardRarity,
  imageUrl = `${name}.png`,
): Card {
  return {
    id: name,
    name,
    imageUrl,
    frameUrl: "frame.png",
    separatorUrl: "separator.png",
    rewardText: "Reward",
    rewardHtml: "Reward",
    rewardSearchText: "reward",
    rewardTags: [],
    stackSize: 1,
    dropLocations: [],
    rarity,
    fromBoss: false,
    isDisabled: false,
  };
}

describe("useRarityPreviewCards", () => {
  it("selects only image-backed cards eligible for the selected league", () => {
    const cards = [
      createCard("Observed common", 4),
      createCard("Unobserved common", 4),
      createCard("Observed uncommon", 3),
      createCard("Observed without image", 2, ""),
      createCard("Observed rare", 1),
    ];
    const eligibleCardNames = new Set([
      "Observed common",
      "Observed uncommon",
      "Observed without image",
      "Observed rare",
    ]);

    const { result } = renderHook(() =>
      useRarityPreviewCards(cards, eligibleCardNames),
    );

    expect(result.current.map((card) => card.name)).toEqual([
      "Observed common",
      "Observed uncommon",
      "Observed rare",
    ]);
  });
});
