import { useLeagueContext } from "../../../../app/league-context";
import { PageHeader } from "../../../../components/page-header/PageHeader/PageHeader";
import { CardsResults } from "../../components";
import { CardsPageActions } from "./CardsPageActions/CardsPageActions";
import { CardsPageSubtitle } from "./CardsPageSubtitle/CardsPageSubtitle";
import { useCardsPageControls } from "./useCardsPageControls/useCardsPageControls";

export function CardsPage() {
  const { selectedLeague } = useLeagueContext();
  const { actionsProps, cardCount, filteredCards, hasError, isLoading } =
    useCardsPageControls();

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <PageHeader
        title="Divination Cards"
        subtitle={
          <CardsPageSubtitle
            cardCount={cardCount}
            leagueName={selectedLeague.name}
          />
        }
        actions={<CardsPageActions {...actionsProps} />}
      />

      <div className="mt-3 flex flex-1 flex-col bg-primary-content min-h-0">
        <div className="mx-auto flex w-full max-w-300 flex-1 flex-col px-4 py-6 min-h-0">
          <CardsResults
            cards={filteredCards}
            hasError={hasError}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
