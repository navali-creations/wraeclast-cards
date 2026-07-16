import { CardsPageContent } from "./CardsPageContent/CardsPageContent";
import { CardsPageControlsProvider } from "./CardsPageControlsProvider/CardsPageControlsProvider";

export function CardsPage() {
  return (
    <CardsPageControlsProvider>
      <CardsPageContent />
    </CardsPageControlsProvider>
  );
}
