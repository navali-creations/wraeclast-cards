import { useContext } from "react";
import { SoothsayerGalleryContext } from "../../contexts/SoothsayerGalleryContext/SoothsayerGalleryContext";

export function useSoothsayerGallery() {
  const context = useContext(SoothsayerGalleryContext);

  if (!context) {
    throw new Error(
      "useSoothsayerGallery must be used inside SoothsayerGalleryProvider",
    );
  }

  return context;
}
