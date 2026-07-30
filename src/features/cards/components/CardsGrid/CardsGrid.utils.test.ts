import { describe, expect, it } from "vitest";
import { getCardsGridColumnCount, getCardsPageSize } from "./CardsGrid.utils";

describe("cards grid responsive sizing", () => {
  it.each([
    [375, 1, 4],
    [640, 2, 8],
    [768, 3, 12],
    [1024, 4, 16],
    [1280, 5, 25],
  ])("at %ipx uses %i columns and %i cards", (width, columns, pageSize) => {
    expect(getCardsGridColumnCount(width)).toBe(columns);
    expect(getCardsPageSize(width)).toBe(pageSize);
  });
});
