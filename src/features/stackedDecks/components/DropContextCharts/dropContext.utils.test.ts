import { describe, expect, it } from "vitest";
import {
  buildNormalizedLocationData,
  buildQuarterHourBuckets,
  buildQuarterHourDistributionProfile,
  buildThreeHourBuckets,
  buildTimeDistributionProfile,
  formatMinuteOfDay,
} from "./dropContext.utils";

describe("drop context chart data", () => {
  it("fills a complete day of quarter-hour buckets", () => {
    const buckets = buildQuarterHourBuckets({ 0: 3, 15: 5, 1425: 7 });

    expect(buckets).toHaveLength(96);
    expect(buckets[0]).toEqual({ minute: 0, count: 3 });
    expect(buckets[2]).toEqual({ minute: 30, count: 0 });
    expect(buckets.at(-1)).toEqual({ minute: 1425, count: 7 });
  });

  it("aggregates quarter-hours into eight three-hour windows", () => {
    const buckets = buildThreeHourBuckets({
      0: 3,
      15: 5,
      165: 7,
      180: 11,
      1425: 13,
    });

    expect(buckets).toEqual([
      { minute: 0, count: 15 },
      { minute: 180, count: 11 },
      { minute: 360, count: 0 },
      { minute: 540, count: 0 },
      { minute: 720, count: 0 },
      { minute: 900, count: 0 },
      { minute: 1080, count: 0 },
      { minute: 1260, count: 13 },
    ]);
  });

  it("formats a minute of day", () => {
    expect(formatMinuteOfDay(0)).toBe("00:00");
    expect(formatMinuteOfDay(185)).toBe("03:05");
  });

  it("normalizes time windows by all observed openings in each window", () => {
    const profile = buildTimeDistributionProfile(
      { 0: 10, 180: 10 },
      { 0: 1_000, 180: 500 },
    );

    expect(profile.buckets[0]).toMatchObject({
      count: 10,
      sampleSize: 1_000,
      cardShare: 0.5,
      activityShare: 2 / 3,
    });
    expect(profile.buckets[1]).toMatchObject({
      count: 10,
      sampleSize: 500,
      cardShare: 0.5,
      activityShare: 1 / 3,
    });
  });

  it("keeps all 96 buckets in the detailed time distribution", () => {
    const profile = buildQuarterHourDistributionProfile(
      { 15: 2, 1425: 1 },
      { 0: 100, 15: 200, 1425: 50 },
    );

    expect(profile.buckets).toHaveLength(96);
    expect(profile.buckets[1]).toMatchObject({
      minute: 15,
      count: 2,
      sampleSize: 200,
      cardShare: 2 / 3,
      activityShare: 200 / 350,
    });
    expect(profile.buckets.at(-1)?.minute).toBe(1425);
  });

  it("normalizes locations and ranks adequate samples before tiny ones", () => {
    const locations = buildNormalizedLocationData(
      { Mine: 4, Hideout: 12, Tiny: 1 },
      { Mine: 400, Hideout: 600, Tiny: 2 },
      17,
    );

    expect(locations.map(({ name }) => name)).toEqual([
      "Hideout",
      "Mine",
      "Tiny",
    ]);
    expect(locations[0]).toMatchObject({
      count: 12,
      sampleSize: 600,
      lowSample: false,
    });
    expect(locations[2]?.lowSample).toBe(true);
  });
});
