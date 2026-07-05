import { Heading } from "../../../../components/headings";
import { Text } from "../../../../components/text";
import type { SoothsayerFeature } from "../../types";

type SoothsayerFeatureDetailsProps = {
  feature: SoothsayerFeature;
};

export function SoothsayerFeatureDetails({
  feature,
}: SoothsayerFeatureDetailsProps) {
  return (
    <div className="flex min-h-36 min-w-0 flex-col justify-end border-t border-(--wc-border-dimmed) pt-4 text-(--wc-text-dimmed) lg:min-h-0 lg:border-t-0 lg:pt-0">
      <Heading
        as="h2"
        className="font-fontin leading-none tracking-tight text-(--wc-card-name)"
      >
        {feature.title}
      </Heading>
      <Text
        size="sm"
        className="mt-3 max-w-sm leading-relaxed text-(--wc-text-dimmed)"
      >
        {feature.description}
      </Text>
    </div>
  );
}
