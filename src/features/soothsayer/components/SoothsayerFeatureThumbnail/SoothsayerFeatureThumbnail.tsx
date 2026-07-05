import clsx from "clsx";
import { useSoothsayerGallery } from "../../hooks/useSoothsayerGallery/useSoothsayerGallery";
import type { SoothsayerFeature } from "../../types";
import { SoothsayerFeatureImage } from "../SoothsayerFeatureImage/SoothsayerFeatureImage";

type SoothsayerFeatureThumbnailProps = {
  feature: SoothsayerFeature;
};

export function SoothsayerFeatureThumbnail({
  feature,
}: SoothsayerFeatureThumbnailProps) {
  const { activeFeatureId, setActiveFeatureId } = useSoothsayerGallery();
  const active = feature.id === activeFeatureId;

  const handleSelect = () => {
    setActiveFeatureId(feature.id);
  };

  return (
    <button
      type="button"
      aria-label={`Show ${feature.title}`}
      aria-current={active ? "true" : undefined}
      onClick={handleSelect}
      className={clsx(
        "aspect-[16/10] w-24 shrink-0 snap-start overflow-hidden rounded-md border bg-(--wc-card-darker) transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--wc-gold-dim) sm:w-28 lg:w-full",
        active
          ? "border-(--wc-gold-dim) shadow-[0_0_0_2px_color-mix(in_oklch,var(--wc-gold-dim)_28%,transparent)]"
          : "border-(--wc-border-dimmed) opacity-75 hover:border-(--wc-accent-border) hover:opacity-100",
      )}
    >
      <SoothsayerFeatureImage feature={feature} variant="thumbnail" />
    </button>
  );
}
