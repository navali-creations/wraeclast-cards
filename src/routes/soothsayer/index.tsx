import { createFileRoute } from "@tanstack/react-router";
import { SoothsayerPage } from "../../features/soothsayer/routes/SoothsayerPage/SoothsayerPage";
import {
  defaultSoothsayerFeatureId,
  isSoothsayerFeatureId,
} from "../../features/soothsayer/routes/SoothsayerPage/SoothsayerPage.utils";

export const Route = createFileRoute("/soothsayer/")({
  validateSearch: (search: Record<string, unknown>) => ({
    gallery: typeof search.gallery === "string" ? search.gallery : undefined,
  }),
  component: SoothsayerRoute,
});

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void | Promise<void>) => {
    finished: Promise<void>;
    ready: Promise<void>;
    updateCallbackDone: Promise<void>;
    skipTransition: () => void;
  };
};

function SoothsayerRoute() {
  const { gallery } = Route.useSearch();
  const navigate = Route.useNavigate();
  const activeFeatureId = isSoothsayerFeatureId(gallery)
    ? gallery
    : defaultSoothsayerFeatureId;

  const handleFeatureSelect = (featureId: string) => {
    if (featureId === activeFeatureId) return;

    const navigateToFeature = () =>
      navigate({
        search: (prev) => ({
          ...prev,
          gallery: featureId,
        }),
      });
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      navigateToFeature();
      return;
    }

    const startViewTransition = (document as ViewTransitionDocument)
      .startViewTransition;

    if (typeof startViewTransition === "function") {
      startViewTransition.call(document, navigateToFeature);
      return;
    }

    navigateToFeature();
  };

  return (
    <SoothsayerPage
      activeFeatureId={activeFeatureId}
      onFeatureSelect={handleFeatureSelect}
    />
  );
}
