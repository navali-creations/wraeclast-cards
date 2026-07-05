import { type PropsWithChildren, useMemo } from "react";
import {
  SoothsayerGalleryContext,
  type SoothsayerGalleryContextValue,
} from "../../contexts/SoothsayerGalleryContext/SoothsayerGalleryContext";

type SoothsayerGalleryProviderProps = PropsWithChildren<{
  activeFeatureId: string;
  onFeatureSelect: (featureId: string) => void;
}>;

export function SoothsayerGalleryProvider({
  activeFeatureId,
  onFeatureSelect,
  children,
}: SoothsayerGalleryProviderProps) {
  const value = useMemo<SoothsayerGalleryContextValue>(
    () => ({
      activeFeatureId,
      setActiveFeatureId: onFeatureSelect,
    }),
    [activeFeatureId, onFeatureSelect],
  );

  return (
    <SoothsayerGalleryContext.Provider value={value}>
      {children}
    </SoothsayerGalleryContext.Provider>
  );
}
