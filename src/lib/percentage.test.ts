import { describe, expect, it } from "vitest";
import { formatPercentage, formatSignedPercentage } from "./percentage";

describe("percentage formatting", () => {
  it("always displays six percentage decimal places", () => {
    expect(formatPercentage(0.0000644143511)).toBe("0.006441%");
    expect(formatPercentage(0.0123456789)).toBe("1.234568%");
    expect(formatPercentage(0)).toBe("0.000000%");
  });

  it("adds a sign only to non-zero differences", () => {
    expect(formatSignedPercentage(0.0000644143511)).toBe("+0.006441%");
    expect(formatSignedPercentage(-0.0000644143511)).toBe("-0.006441%");
    expect(formatSignedPercentage(0)).toBe("0.000000%");
  });
});
