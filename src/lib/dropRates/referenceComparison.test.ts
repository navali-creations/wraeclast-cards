import { describe, expect, it } from "vitest";
import { comparedToReferenceDelta } from "./referenceComparison";

describe("comparedToReferenceDelta", () => {
  it("treats values inside the reference tolerance as expected", () => {
    expect(comparedToReferenceDelta(1)).toBe(0);
    expect(comparedToReferenceDelta(1.03)).toBe(0);
    expect(comparedToReferenceDelta(0.97)).toBe(0);
  });

  it("treats sub-display precision leftovers as expected", () => {
    expect(comparedToReferenceDelta(1.030001544365)).toBe(0);
  });

  it("returns the delta beyond the reference tolerance", () => {
    expect(comparedToReferenceDelta(1.035)).toBeCloseTo(0.005);
    expect(comparedToReferenceDelta(0.965)).toBeCloseTo(-0.005);
  });

  it("returns null when the comparison is unavailable", () => {
    expect(comparedToReferenceDelta(null)).toBeNull();
    expect(comparedToReferenceDelta(undefined)).toBeNull();
  });
});
