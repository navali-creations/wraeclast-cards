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
    <div className="-mx-4 -mt-6 -mb-6 flex flex-1 flex-col min-h-0">
      <div className="border-b border-[color-mix(in_oklch,var(--wc-border)_65%,black)] px-4 pt-5 pb-4 shadow-[inset_0_-16px_36px_-28px_black]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-2">
            <h1 className="font-fontin text-4xl leading-none font-bold tracking-tight text-[color-mix(in_oklch,var(--wc-gold)_88%,white)] sm:text-5xl">
              Soothsayer
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-(--wc-text-70) max-md:max-w-[calc(100dvw-2rem)]">
              An open-source desktop companion for live stacked deck sessions,
              personal card history, economy-aware forecasting, and rarity
              research.
            </p>
          </div>

          <SoothsayerDownloadActions />
        </div>
      </div>

      <div className="relative mt-3 flex flex-1 flex-col bg-primary-content min-h-0 md:left-1/2 md:w-screen md:-translate-x-1/2">
        <div className="mx-auto flex w-full max-w-300 flex-1 flex-col px-4 py-6 min-h-0">
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
