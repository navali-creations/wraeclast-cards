import { PageHeader } from "../../../../components/page-header/PageHeader/PageHeader";
import { Route } from "../../../../routes/$game/$league/soothsayer";
import { SoothsayerFeatureGallery } from "../../components/SoothsayerFeatureGallery/SoothsayerFeatureGallery";
import { SoothsayerGalleryProvider } from "../../components/SoothsayerGalleryProvider/SoothsayerGalleryProvider";
import {
  defaultSoothsayerFeatureId,
  isSoothsayerFeatureId,
} from "./SoothsayerPage.utils";
import { SoothsayerPageActions } from "./SoothsayerPageActions/SoothsayerPageActions";
import { SoothsayerPageSubtitle } from "./SoothsayerPageSubtitle/SoothsayerPageSubtitle";
import { runWithViewTransition } from "./viewTransition";

export function SoothsayerPage() {
  const { gallery } = Route.useSearch();
  const navigate = Route.useNavigate();
  const activeFeatureId = isSoothsayerFeatureId(gallery)
    ? gallery
    : defaultSoothsayerFeatureId;

  const handleFeatureSelect = (featureId: string) => {
    if (featureId === activeFeatureId) return;

    runWithViewTransition(() =>
      navigate({
        search: (prev) => ({
          ...prev,
          gallery: featureId,
        }),
      }),
    );
  };

  return (
    <div className="flex flex-1 flex-col min-h-0 bg-(--wc-header-bg)">
      <PageHeader
        title="Soothsayer"
        subtitle={<SoothsayerPageSubtitle />}
        actions={<SoothsayerPageActions />}
      />

      <div className="mt-3 flex flex-1 flex-col bg-primary-content min-h-0">
        <div className="justify-center mx-auto flex w-full max-w-300 flex-1 flex-col min-h-0">
          <SoothsayerGalleryProvider
            activeFeatureId={activeFeatureId}
            onFeatureSelect={handleFeatureSelect}
          >
            <SoothsayerFeatureGallery />
          </SoothsayerGalleryProvider>
        </div>
      </div>
    </div>
  );
}
