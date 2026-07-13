import { useSoothsayerGallery } from "../../hooks/useSoothsayerGallery/useSoothsayerGallery";
import { soothsayerFeatures } from "../../routes/SoothsayerPage/SoothsayerPage.utils";
import { SoothsayerFeatureDetails } from "../SoothsayerFeatureDetails/SoothsayerFeatureDetails";
import { SoothsayerFeatureImage } from "../SoothsayerFeatureImage/SoothsayerFeatureImage";
import { SoothsayerFeatureThumbnails } from "../SoothsayerFeatureThumbnails/SoothsayerFeatureThumbnails";
import "./SoothsayerFeatureGallery.css";

export function SoothsayerFeatureGallery() {
  const { activeFeatureId } = useSoothsayerGallery();
  const activeFeature =
    soothsayerFeatures.find((feature) => feature.id === activeFeatureId) ??
    soothsayerFeatures[0];

  if (!activeFeature) return null;

  return (
    <section className="w-full min-w-0 rounded-lg border border-(--wc-border-dimmed) bg-(--wc-bg-dimmed) p-4 lg:p-5">
      <div className="grid min-w-0 gap-4 lg:h-[34rem] lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="aspect-[16/10] min-w-0 overflow-hidden rounded-md border border-(--wc-border-dimmed) bg-(--wc-card-darker) shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--wc-gold)_8%,transparent)] lg:row-span-2 lg:h-full lg:aspect-auto">
          <SoothsayerFeatureImage
            key={activeFeature.id}
            feature={activeFeature}
            variant="hero"
          />
        </div>

        <SoothsayerFeatureThumbnails />

        <SoothsayerFeatureDetails feature={activeFeature} />
      </div>
    </section>
  );
}
