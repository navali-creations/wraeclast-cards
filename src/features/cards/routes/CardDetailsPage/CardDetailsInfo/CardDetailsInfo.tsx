import clsx from "clsx";
import { FiArchive, FiHash, FiPercent, FiTarget } from "react-icons/fi";
import { Text } from "../../../../../components/text";
import { useCardDropRate } from "../../../hooks";
import type { Card } from "../../../types";
import { CardDetailsDropRateTables } from "../CardDetailsDropRateTables";
import {
  getDropRateLabel,
  getPlural,
  getSourceLabel,
  getWeightLabel,
} from "./cardLabels";
import { DetailItem } from "./DetailItem";
import { SectionHeader } from "./SectionHeader";
import { useDropRateViewMode } from "./useDropRateViewMode";
import { ViewModeButton } from "./ViewModeButton";
import "./CardDetailsInfo.css";

export function CardDetailsInfo({ card }: { card: Card }) {
  const [viewMode, handleViewModeChange] = useDropRateViewMode();
  const { dropRate, isLoading: isDropRateLoading } = useCardDropRate(card);

  return (
    <div className="w-full max-w-2xl space-y-4">
      <section className="overflow-hidden rounded-xl">
        <SectionHeader
          title="Overview"
          description="Turn-in requirements and current drop-rate context."
          aside={
            <Text
              as="span"
              weight="medium"
              uppercase
              muted
              className="inline-flex rounded border border-(--wc-border-dimmed) px-2 py-1 text-[11px] leading-none tracking-[0.12em]"
            >
              Live data
            </Text>
          }
        />
        <div className="grid sm:grid-cols-2">
          <DetailItem
            icon={<FiHash aria-hidden="true" className="size-4" />}
            label="Stack size"
            value={`${card.stackSize} ${getPlural(card.stackSize, "card")}`}
            hint="Required for one complete turn-in."
            highlight
          />
          <DetailItem
            icon={<FiPercent aria-hidden="true" className="size-4" />}
            label="Drop rate"
            value={getDropRateLabel(dropRate, isDropRateLoading)}
            hint={
              dropRate == null
                ? "Not enough reported drops for this card yet."
                : "Share of community-reported drops, same figure as Stacked Decks."
            }
          />
          <DetailItem
            icon={<FiArchive aria-hidden="true" className="size-4" />}
            label="Reference weight"
            value={getWeightLabel(card)}
            hint={
              card.weight && card.weight > 0
                ? "Relative benchmark, not a known drop chance."
                : "Unavailable in the global weight pool."
            }
          />
          <DetailItem
            icon={<FiTarget aria-hidden="true" className="size-4" />}
            label="Source"
            value={getSourceLabel(card)}
            hint={
              card.fromBoss
                ? "Flagged as a boss-sourced divination card."
                : "No boss-only source flag in this dataset."
            }
          />
        </div>
      </section>

      <div className="wc-divider-glow wc-divider-glow-no-dot pt-5">
        <section className="rounded-xl p-4 sm:p-5">
          <div className="-mx-4 -mt-4 border-b border-(--wc-border-dimmed) sm:-mx-5 sm:-mt-5">
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
          </div>
          <div className="mt-4">
            <CardDetailsDropRateTables card={card} viewMode={viewMode} />
          </div>
        </section>
      </div>
    </div>
  );
}
