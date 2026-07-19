import { useLeagueContext } from "../../../../app/league-context";
import { CardsPageContent } from "./CardsPageContent/CardsPageContent";
import { CardsPageControlsProvider } from "./CardsPageControlsProvider/CardsPageControlsProvider";
import { ObservedCardsPage } from "./ObservedCardsPage/ObservedCardsPage";

export function CardsPage() {
  const { selectedLeague } = useLeagueContext();
  if (
    selectedLeague.historical &&
    selectedLeague.reference_source_url === undefined
  ) {
    return <ObservedCardsPage />;
  }

  return (
    <CardsPageControlsProvider>
      <CardsPageContent />
    </CardsPageControlsProvider>
  );
}
