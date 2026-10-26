import clsx from "clsx";
import { ComparisonSettings } from "../ComparisonSettings/ComparisonSettings";
import { useStackedDecksComparison } from "../StackedDecksComparisonContext/StackedDecksComparisonContext";
import type { ComparisonView } from "../StackedDecksComparisonPage.utils";
import { useComparisonDesktopLayout } from "../useComparisonDesktopLayout/useComparisonDesktopLayout";

const VIEWS: Array<{ id: ComparisonView; label: string; description: string }> =
  [
    {
      id: "movers",
      label: "Movers",
      description: "Biggest changes during one league transition",
    },
    {
      id: "matrix",
      label: "Matrix",
      description: "Every card across selected leagues",
    },
    {
      id: "history",
      label: "History",
      description: "One card through league history",
    },
  ];

export function ComparisonControls() {
  const { view, setView, selectedLeagues, baselineLeague, moverTransition } =
    useStackedDecksComparison();
  const isDesktopLayout = useComparisonDesktopLayout();
  const settingsReference =
    view === "movers"
      ? `${moverTransition?.fromLeague.name ?? "No"} → ${moverTransition?.toLeague.name ?? "transition"}`
      : `${baselineLeague?.name ?? "No"} baseline`;

  return (
    <section
      aria-label="Comparison controls"
      className="rounded-xl border border-(--wc-border) bg-(--wc-header-bg) p-3 shadow-lg sm:p-4"
    >
      <h2 className="sr-only">Comparison settings</h2>
      <div
        role="tablist"
        aria-label="Comparison view"
        className="grid w-full grid-cols-3 rounded-lg border border-(--wc-border) bg-(--wc-card-darker) p-1 sm:w-fit"
      >
        {VIEWS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={view === item.id}
            title={item.description}
            onClick={() => setView(item.id)}
            className={clsx(
              "min-h-10 rounded-md px-2 text-xs font-semibold transition-colors sm:px-4 sm:text-sm",
              {
                "bg-primary text-primary-content shadow-sm": view === item.id,
                "text-(--wc-text-60) hover:bg-(--wc-glow)/50 hover:text-(--wc-text-90)":
                  view !== item.id,
              },
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {isDesktopLayout ? (
        <div className="mt-4">
          <ComparisonSettings />
        </div>
      ) : (
        <details className="mt-3 rounded-lg border border-(--wc-border) bg-(--wc-card-darker)">
          <summary className="cursor-pointer px-3 py-3 text-sm font-semibold text-(--wc-gold-muted)">
            Comparison settings
            <span className="ml-2 font-normal text-(--wc-text-50)">
              {selectedLeagues.length} leagues · {settingsReference}
            </span>
          </summary>
          <div className="border-t border-(--wc-border) p-3">
            <ComparisonSettings />
          </div>
        </details>
      )}
    </section>
  );
}
