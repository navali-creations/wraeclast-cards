import { soothsayerFeatures } from "../../routes/SoothsayerPage/SoothsayerPage.utils";
import { SoothsayerFeatureThumbnail } from "../SoothsayerFeatureThumbnail/SoothsayerFeatureThumbnail";
import "./SoothsayerFeatureThumbnails.css";

export function SoothsayerFeatureThumbnails() {
  return (
    <div className="soothsayer-feature-thumbnails-scrollbar flex min-w-0 snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain pr-2 pb-4 lg:grid lg:grid-cols-2 lg:content-start lg:overflow-visible lg:pr-0 lg:pb-0">
      {soothsayerFeatures.map((feature) => (
        <SoothsayerFeatureThumbnail key={feature.id} feature={feature} />
      ))}
    </div>
  );
}
