import { describe, expect, it } from "vitest";
import type { DropRateCard } from "../../../lib/dropRates";
import { featuredObservedDropRates } from "./homepageStats";

function dropRateCard(
  name: string,
  count: number,
  ratio: number,
): DropRateCard {
  return {
    name,
    count,
    ratio,
    verified_count: 0,
    verified_ratio: 0,
    reference_estimated_chance: null,
    seen_vs_reference: null,
    verified_seen_vs_reference: null,
    reference_weight: null,
    community_estimated_weight: null,
    verified_community_estimated_weight: null,
    community_estimated_weight_delta_vs_reference: null,
    verified_community_estimated_weight_delta_vs_reference: null,
  };
}

describe("featuredObservedDropRates", () => {
  it("preserves featured-card order and keeps cards without observations", () => {
    const rates = featuredObservedDropRates(
      [
        dropRateCard("Common Card", 20, 0.125),
        dropRateCard("Rare Card", 1, 0.00004),
        dropRateCard("Unseen Card", 0, 0),
      ],
      ["Unseen Card", "Missing Card", "Common Card", "Rare Card"],
    );

    expect(rates).toEqual([
      { cardName: "Unseen Card", rate: null },
      { cardName: "Missing Card", rate: null },
      { cardName: "Common Card", rate: "12.5%" },
      { cardName: "Rare Card", rate: "<0.01%" },
    ]);
  });
});
