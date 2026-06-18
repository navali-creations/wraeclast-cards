import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Heading } from "../components/headings";
import { Text } from "../components/text";
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

  return (
    <div className="-mx-4 -mt-6 -mb-6 flex flex-1 flex-col min-h-0">
      <div className="border-b border-base-100 px-4 pt-5 pb-4">
        <div className="flex flex-row items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <Heading
                as="h1"
                font="fontin"
                size="3xl"
                className="leading-none tracking-tight text-(--wc-gold-bright) sm:text-5xl"
              >
                Stacked Decks
              </Heading>
            </div>
            <Text size="sm" className="mt-1 text-(--wc-text-70)">
              <Text as="span" weight="semibold" className="text-(--wc-gold)">
                29,919
              </Text>{" "}
              stacked deck openings · Mirage league
            </Text>
          </div>

          <div className="shrink-0">
            <StackedDecksFilters value={searchTerm} onChange={setSearchTerm} />
          </div>
        </div>
      </div>

      <div className="relative left-1/2 mt-3 flex w-screen -translate-x-1/2 flex-1 flex-col bg-primary-content min-h-0">
        <div className="mx-auto flex w-full max-w-300 flex-1 flex-col px-4 py-6 min-h-0 space-y-6">
          <Methodology />
          <StackedDecksResults />
        </div>
      </div>
    </div>
  );
}
