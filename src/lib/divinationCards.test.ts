import { describe, expect, it } from "vitest";
import { divinationCardRarity, parseDivinationCards } from "./divinationCards";

function cardWithWeight(weight: unknown) {
  return {
    name: "Desecrated Virtue",
    stack_size: 9,
    description: "Level 4 Exceptional Support Gem",
    is_disabled: false,
    from_boss: false,
    weight,
  };
}

describe("parseDivinationCards", () => {
  it("accepts a null weight", () => {
    expect(parseDivinationCards([cardWithWeight(null)])[0]).toMatchObject({
      name: "Desecrated Virtue",
      weight: null,
    });
  });

  it("rejects an invalid weight", () => {
    expect(() => parseDivinationCards([cardWithWeight("unknown")])).toThrow(
      "Invalid divination card data",
    );
  });
});

describe("divinationCardRarity", () => {
  it("treats a null weight as unknown", () => {
    expect(divinationCardRarity(null)).toBe(0);
  });
});
