import { describe, expect, it } from "vitest";
import { getVisibilityForViewport } from "./useResponsiveColumnVisibility";

const config = {
  tabletHidden: ["weight"],
  mobileHidden: ["weight", "count"],
};

describe("getVisibilityForViewport", () => {
  it("keeps all columns visible on desktop", () => {
    expect(getVisibilityForViewport(config, 1024)).toEqual({});
  });

  it("hides tablet columns below 768px", () => {
    expect(getVisibilityForViewport(config, 700)).toEqual({ weight: false });
  });

  it("hides mobile columns below 640px", () => {
    expect(getVisibilityForViewport(config, 375)).toEqual({
      weight: false,
      count: false,
    });
  });
});
