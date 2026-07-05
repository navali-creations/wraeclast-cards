import type { SoothsayerFeature } from "../../types";

type SoothsayerFeatureDetailsProps = {
  feature: SoothsayerFeature;
};

export function SoothsayerFeatureDetails({
  feature,
}: SoothsayerFeatureDetailsProps) {
  return (
    <div className="flex min-h-36 min-w-0 flex-col justify-end border-t border-(--wc-border-dimmed) pt-4 text-(--wc-text-dimmed) lg:min-h-0 lg:border-t-0 lg:pt-0">
      <h2 className="font-fontin text-3xl leading-none font-bold tracking-tight text-(--wc-card-name)">
        {feature.title}
      </h2>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-(--wc-text-dimmed)">
        {feature.description}
      </p>
    </div>
  );
}
