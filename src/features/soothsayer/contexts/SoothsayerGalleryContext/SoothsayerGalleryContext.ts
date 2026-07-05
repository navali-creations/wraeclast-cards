import { createContext } from "react";

export type SoothsayerGalleryContextValue = {
  activeFeatureId: string;
  setActiveFeatureId: (featureId: string) => void;
};

export const SoothsayerGalleryContext =
  createContext<SoothsayerGalleryContextValue | null>(null);
