import { describe, expect, it } from "vitest";
import { filterPublishedDropRateLeagues } from "./drop-rate-leagues.mjs";

describe("filterPublishedDropRateLeagues", () => {
  it("excludes Standard from published drop-rate leagues", () => {
    const leagues = [
      { id: "standard", name: "Standard" },
      { id: "keepers", name: "Keepers" },
      { id: "mirage", name: "Mirage" },
    ];

    expect(filterPublishedDropRateLeagues(leagues)).toEqual([
      { id: "keepers", name: "Keepers" },
      { id: "mirage", name: "Mirage" },
    ]);
  });
});
