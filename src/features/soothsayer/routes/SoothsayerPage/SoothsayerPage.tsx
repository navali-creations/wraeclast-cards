import { Heading } from "../../../../components/headings";
import { Text } from "../../../../components/text";
import { SoothsayerDownloadActions } from "../../components/SoothsayerDownloadActions/SoothsayerDownloadActions";
import { SoothsayerFeatureGallery } from "../../components/SoothsayerFeatureGallery/SoothsayerFeatureGallery";
import { SoothsayerGalleryProvider } from "../../components/SoothsayerGalleryProvider/SoothsayerGalleryProvider";

type SoothsayerPageProps = {
  activeFeatureId: string;
  onFeatureSelect: (featureId: string) => void;
};

export function SoothsayerPage({
  activeFeatureId,
  onFeatureSelect,
}: SoothsayerPageProps) {
  return (
    <div className="flex flex-1 flex-col min-h-0 bg-(--wc-header-bg)">
      <div className="border-b border-[color-mix(in_oklch,var(--wc-border)_65%,black)] px-4 pt-5 pb-4 shadow-[inset_0_-16px_36px_-28px_black]">
        <div className="mx-auto flex w-full max-w-300 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-2">
            <Heading
              as="h1"
              className="font-fontin leading-none tracking-tight text-[color-mix(in_oklch,var(--wc-gold)_88%,white)] sm:text-5xl"
            >
              Soothsayer
            </Heading>
            <Text
              size="sm"
              className="max-w-3xl leading-relaxed text-(--wc-text-70) max-md:max-w-[calc(100dvw-2rem)]"
            >
              An open-source desktop companion for live stacked deck sessions,
              personal card history, economy-aware forecasting, and rarity
              research.
            </Text>
          </div>

          <SoothsayerDownloadActions />
        </div>
      </div>

      <div className="mt-3 flex flex-1 flex-col bg-primary-content min-h-0">
        <div className="justify-center mx-auto flex w-full max-w-300 flex-1 flex-col min-h-0">
          <SoothsayerGalleryProvider
            activeFeatureId={activeFeatureId}
            onFeatureSelect={onFeatureSelect}
          >
            <SoothsayerFeatureGallery />
          </SoothsayerGalleryProvider>
        </div>
      </div>
    </div>
  );
}
