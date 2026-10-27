import clsx from "clsx";
import type { Card } from "../../../types";
import { CardDetailsDropRateTables } from "../CardDetailsDropRateTables/CardDetailsDropRateTables";
import { CardDropContextSection } from "../CardDropContext/CardDropContextSection/CardDropContextSection";
import { SectionHeader } from "./SectionHeader/SectionHeader";
import { useDropRateViewMode } from "./useDropRateViewMode/useDropRateViewMode";
import { ViewModeButton } from "./ViewModeButton/ViewModeButton";
import "./CardDetailsInfo.css";

export function CardDetailsInfo({ card }: { card: Card }) {
  const [viewMode, handleViewModeChange] = useDropRateViewMode();

  return (
    <div className="min-w-0 w-full max-w-2xl space-y-4">
      <section className="overflow-hidden rounded-xl border border-(--wc-border-dimmed) bg-(--wc-bg-dimmed)">
        <SectionHeader
          title="Drop-rate evidence"
          description="Community observations for this card across available league data."
          aside={
            <fieldset className="wc-card-details-view-mode-switch inline-grid grid-cols-2 rounded-lg border border-(--wc-border-dimmed) bg-(--wc-bg-dimmed)/80 p-1">
              <legend className="sr-only">Drop-rate evidence view</legend>
              <span
                aria-hidden="true"
                className={clsx(
                  "wc-card-details-view-mode-indicator",
                  viewMode === "advanced" &&
                    "wc-card-details-view-mode-indicator-advanced",
                )}
              />
              <ViewModeButton
                mode="basic"
                currentMode={viewMode}
                onChange={handleViewModeChange}
              >
                Basic
              </ViewModeButton>
              <ViewModeButton
                mode="advanced"
                currentMode={viewMode}
                onChange={handleViewModeChange}
              >
                Advanced
              </ViewModeButton>
            </fieldset>
          }
        />
        <div className="p-4 sm:p-5">
          <CardDetailsDropRateTables card={card} viewMode={viewMode} />
        </div>
      </section>

      <CardDropContextSection cardName={card.name} />
    </div>
  );
}
