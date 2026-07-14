import { createContext, useContext } from "react";
import type { useCardsPageControls } from "./useCardsPageControls/useCardsPageControls";

export type CardsPageControlsContextValue = ReturnType<
  typeof useCardsPageControls
>;

export const CardsPageControlsContext =
  createContext<CardsPageControlsContextValue | null>(null);

export function useCardsPageControlsContext() {
  const context = useContext(CardsPageControlsContext);
  if (!context) {
    throw new Error(
      "useCardsPageControlsContext must be used within CardsPageControlsProvider",
    );
  }

  return context;
}
