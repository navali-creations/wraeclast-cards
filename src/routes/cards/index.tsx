import { createFileRoute } from "@tanstack/react-router";
import { Text } from "../../components/text/Text";
import { CardsFilters } from "../../features/cards/components/CardsFilters";
import { CardsResults } from "../../features/cards/components/CardsResults";

export const Route = createFileRoute("/cards/")({
  component: CardsPage,
});

function CardsPage() {
  return (
    <div className="-mx-4 -mt-6 -mb-6 flex flex-1 flex-col min-h-0">
      <div className="space-y-5 px-4 pt-5 pb-4">
        <div className="space-y-2">
          <h1 className="font-cinzel text-[2.15rem] leading-none font-bold tracking-[-0.02em] text-[color-mix(in_oklch,var(--wc-gold)_88%,white)] sm:text-[2.4rem]">
            Divination Cards
          </h1>
          <Text
            as="p"
            size="sm"
            className="font-medium text-[color-mix(in_oklch,var(--wc-gold-dim)_55%,var(--wc-text-30))]"
          >
            20 cards · Mirage league pricing
          </Text>
        </div>
        <CardsFilters />
      </div>

      <div className="relative left-1/2 mt-3 flex w-screen -translate-x-1/2 flex-1 flex-col bg-[#e8dcc8] min-h-0">
        <div className="mx-auto flex w-full max-w-300 flex-1 flex-col px-4 py-6 min-h-0">
          <CardsResults />
        </div>
      </div>
    </div>
  );
}
