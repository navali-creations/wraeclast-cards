import type { DropRateLeague } from "../../../../lib/dropRates";
import { comparedToReferenceDelta } from "../../../../lib/dropRates/referenceComparison";
import {
  STACKED_DECKS_COMPARISON_VIEWS,
  type StackedDecksComparisonView,
} from "../../../../lib/stackedDecksComparisonViews";

export type ComparisonView = StackedDecksComparisonView;
export type ComparisonMetric =
  | "players-saw"
  | "compared-to-reference"
  | "community-weight"
  | "drops-reported";

export const COMPARISON_METRICS: ReadonlyArray<{
  id: ComparisonMetric;
  label: string;
}> = [
  { id: "players-saw", label: "Players saw" },
  { id: "compared-to-reference", label: "Compared to reference" },
  { id: "community-weight", label: "Community weight" },
  { id: "drops-reported", label: "Drops reported" },
];

export function isComparisonView(value: unknown): value is ComparisonView {
  return STACKED_DECKS_COMPARISON_VIEWS.some((view) => view === value);
}

export function isComparisonMetric(value: unknown): value is ComparisonMetric {
  return COMPARISON_METRICS.some((metric) => metric.id === value);
}

export function getComparisonMetric(metric: ComparisonMetric) {
  return (
    COMPARISON_METRICS.find((option) => option.id === metric) ??
    COMPARISON_METRICS[0]
  );
}

export function formatObservedShare(value: number | null): string {
  if (value === null) return "—";

  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  }).format(value);
}

export function formatComparisonMetricValue(
  metric: ComparisonMetric,
  value: number | null,
): string {
  if (value === null) return "—";
  if (metric === "players-saw") return formatObservedShare(value);
  if (metric === "drops-reported") return value.toLocaleString("en-US");
  if (metric === "community-weight") {
    return Math.round(value).toLocaleString("en-US");
  }

  const delta = comparedToReferenceDelta(value);
  if (delta === null) return "—";
  if (delta === 0) return "About expected";

  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: "exceptZero",
  }).format(delta);
}

export function formatMetricDifference(
  metric: ComparisonMetric,
  value: number | null,
): string {
  if (value === null) return "No comparable value";

  const sign = value >= 0 ? "+" : "";
  if (metric === "players-saw" || metric === "compared-to-reference") {
    return `${sign}${(value * 100).toFixed(4)} pp`;
  }
  if (metric === "community-weight") {
    return `${sign}${Math.round(value).toLocaleString("en-US")} weight`;
  }

  return `${sign}${Math.round(value).toLocaleString("en-US")} drops`;
}

export function formatObservationCount(value: number | null): string {
  return value === null ? "—" : value.toLocaleString("en-US");
}

function formatCompactObservationCount(observationCount: number): string {
  if (observationCount >= 1_000_000) {
    const millions = Math.floor(observationCount / 100_000) / 10;
    const formattedMillions = Number.isInteger(millions)
      ? millions.toFixed(0)
      : millions.toFixed(1);

    return `~${formattedMillions}M`;
  }

  if (observationCount >= 1_000) {
    return `~${Math.floor(observationCount / 1_000)}k`;
  }

  return observationCount.toLocaleString("en-US");
}

export function formatComparisonSubtitle(
  leagues: readonly DropRateLeague[],
  observationCountByLeagueId: ReadonlyMap<string, number>,
): string | undefined {
  if (leagues.length < 2) return undefined;

  const summaries = leagues.map((league) => {
    const observationCount = observationCountByLeagueId.get(league.id);
    if (observationCount === undefined) return undefined;

    return `${league.name} (${formatCompactObservationCount(observationCount)} observations)`;
  });

  if (summaries.some((summary) => summary === undefined)) return undefined;

  const labels = summaries as string[];
  if (labels.length === 2) {
    return `Comparing ${labels[0]} with ${labels[1]}`;
  }

  return `Comparing ${labels.slice(0, -1).join(", ")} and ${labels.at(-1)}`;
}
