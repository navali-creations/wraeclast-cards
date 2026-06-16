import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useGame } from "../app/game-context";
import { EGame } from "../enums";
import {
  Methodology,
  StackedDecksFilters,
  StackedDecksResults,
} from "../features/stackedDecks/components";

export const Route = createFileRoute("/stacked-decks")({
  component: StackedDecksPage,
});

function StackedDecksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { game } = useGame();

  return (
    <div className="-mx-4 -mt-6 -mb-6 flex flex-1 flex-col min-h-0">
      <div className="border-b border-[color-mix(in_oklch,var(--wc-border)_65%,black)] px-4 pt-5 pb-4 shadow-[inset_0_-16px_36px_-28px_black]">
        <div className="flex flex-row items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-fontin text-4xl leading-none font-bold tracking-tight text-[color-mix(in_oklch,var(--wc-gold)_88%,white)] sm:text-5xl">
                Stacked Decks
              </h1>
              <span className="rounded border border-(--wc-accent-border) px-2.5 py-1 text-[12px] font-semibold bg-accent text-accent-content">
                {game === EGame.Poe2 ? "PoE 2" : "PoE 1"}
              </span>
            </div>
            <p className="mt-1 text-sm text-[color-mix(in_oklch,var(--wc-text-70)_92%,white)]">
              <span className="font-semibold text-(--wc-gold)">29,919</span>{" "}
              stacked deck openings · Mirage league
            </p>
          </div>

          <div className="shrink-0">
            <StackedDecksFilters value={searchTerm} onChange={setSearchTerm} />
          </div>
        </div>
      </div>

      <div className="relative left-1/2 mt-3 flex w-screen -translate-x-1/2 flex-1 flex-col bg-[#e8dcc8] min-h-0">
        <div className="mx-auto flex w-full max-w-300 flex-1 flex-col px-4 py-6 min-h-0 space-y-6">
          <Methodology />
          <StackedDecksResults />
        </div>
      </div>
    </div>
  );
}
