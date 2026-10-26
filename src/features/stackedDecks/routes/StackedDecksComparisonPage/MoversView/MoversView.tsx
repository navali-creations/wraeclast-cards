import { useStackedDecksComparison } from "../StackedDecksComparisonContext/StackedDecksComparisonContext";
import { getComparisonMetric } from "../StackedDecksComparisonPage.utils";
import { MoversTable } from "./MoversTable/MoversTable";

export function MoversView() {
  const { moverTransition, metric, minimumObservations } =
    useStackedDecksComparison();
  const metricDetails = getComparisonMetric(metric);

  return (
    <section aria-labelledby="movers-heading">
      <div className="mb-3">
        <h2
          id="movers-heading"
          className="font-crimson text-2xl font-semibold text-(--wc-card-name)"
        >
          Biggest movers
        </h2>
        <p className="text-sm text-(--wc-text-dimmed)">
          {metricDetails.label}, ranked by absolute change from{" "}
          {moverTransition?.fromLeague.name ?? "the older league"} to{" "}
          {moverTransition?.toLeague.name ?? "the newer league"}.
          {minimumObservations > 0 &&
            ` Both values have at least ${minimumObservations.toLocaleString("en-US")} drops.`}
        </p>
      </div>

      <MoversTable />
    </section>
  );
}
