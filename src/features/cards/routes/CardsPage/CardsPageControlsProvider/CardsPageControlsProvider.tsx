import type { ReactNode } from "react";
import { CardsPageControlsContext } from "../CardsPageControlsContext";
import { useCardsPageControls } from "../useCardsPageControls/useCardsPageControls";

interface CardsPageControlsProviderProps {
  children: ReactNode;
}

export function CardsPageControlsProvider({
  children,
}: CardsPageControlsProviderProps) {
  const controls = useCardsPageControls();

  return (
    <CardsPageControlsContext.Provider value={controls}>
      {children}
    </CardsPageControlsContext.Provider>
  );
}
