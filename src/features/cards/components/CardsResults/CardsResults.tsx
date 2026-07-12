import type { Card } from "../../types";
import { CardsGrid } from "../CardsGrid/CardsGrid";

interface CardsResultsProps {
  cards: Card[];
}

export function CardsResults({ cards }: CardsResultsProps) {
  return (
    <div className="space-y-3">
      <CardsGrid data={cards} />
    </div>
  );
}
