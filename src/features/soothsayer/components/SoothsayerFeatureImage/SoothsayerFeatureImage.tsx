import clsx from "clsx";
import { useState } from "react";
import { Text } from "../../../../components/text";
import type { SoothsayerFeature } from "../../types";

type SoothsayerFeatureImageProps = {
  feature: SoothsayerFeature;
  variant: "hero" | "thumbnail";
};

export function SoothsayerFeatureImage({
  feature,
  variant,
}: SoothsayerFeatureImageProps) {
  const [imageMissing, setImageMissing] = useState(false);
  const src = variant === "thumbnail" ? feature.thumbnailSrc : feature.imageSrc;

  const handleImageError = () => {
    setImageMissing(true);
  };

  if (imageMissing) {
    return (
      <div
        className={clsx(
          "flex h-full w-full items-center justify-center bg-base-100 px-3 text-center",
          variant === "hero"
            ? "min-h-[18rem] sm:min-h-[24rem] lg:min-h-full"
            : "min-h-14",
        )}
      >
        <Text
          as="span"
          weight="bold"
          className={clsx(
            "font-fontin text-(--wc-gold-bright)",
            variant === "hero" ? "text-2xl" : "text-xs",
          )}
        >
          {feature.title}
        </Text>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={feature.imageAlt}
      className={clsx(
        "h-full w-full",
        variant === "hero"
          ? "min-h-[18rem] object-contain sm:min-h-[24rem] lg:min-h-full"
          : "object-cover",
      )}
      loading={variant === "hero" ? "eager" : "lazy"}
      decoding="async"
      onError={handleImageError}
    />
  );
}
