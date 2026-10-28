// @vitest-environment jsdom

import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { DivinationCardRarity } from "../../../../lib/divinationCards";
import type { Card } from "../../../cards/types";
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
  afterEach(() => {
    vi.restoreAllMocks();
  });

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

  it("randomly selects one eligible card from each rarity", () => {
    const cards = [
      createCard("Common A", 4),
      createCard("Common B", 4),
      createCard("Uncommon A", 3),
      createCard("Uncommon B", 3),
      createCard("Rare A", 2),
      createCard("Rare B", 2),
      createCard("Extremely rare A", 1),
      createCard("Extremely rare B", 1),
    ];
    const eligibleCardNames = new Set(cards.map((card) => card.name));
    const random = vi
      .spyOn(Math, "random")
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.99)
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.25);

    const { result, rerender } = renderHook(() =>
      useRarityPreviewCards(cards, eligibleCardNames),
    );

    expect(result.current.map((card) => card.name)).toEqual([
      "Common A",
      "Uncommon B",
      "Rare B",
      "Extremely rare A",
    ]);

    rerender();
    expect(random).toHaveBeenCalledTimes(4);
  });
});
