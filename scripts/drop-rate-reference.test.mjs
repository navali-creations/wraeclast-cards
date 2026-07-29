import { describe, expect, it } from "vitest";
import { validateReferenceCards } from "./drop-rate-reference.mjs";

describe("validateReferenceCards", () => {
  it.each([null, 0, 264])("accepts a reference weight of %s", (weight) => {
    const cards = [
      {
        name: "Desecrated Virtue",
        weight,
        is_disabled: false,
        from_boss: false,
      },
    ];

    expect(() => validateReferenceCards(cards, "Allflame")).not.toThrow();
  });

  it("rejects an invalid reference weight", () => {
    const cards = [
      {
        name: "Desecrated Virtue",
        weight: "unknown",
        is_disabled: false,
        from_boss: false,
      },
    ];

    expect(() => validateReferenceCards(cards, "Allflame")).toThrow(
      "Invalid reference card row for Allflame at index 0",
    );
  });
});
