import { createFileRoute } from "@tanstack/react-router";
import { SoothsayerPage } from "../../features/soothsayer/routes/SoothsayerPage/SoothsayerPage";
import { createStaticPageSeoHead } from "../../lib/seo";

export const Route = createFileRoute("/soothsayer/")({
  validateSearch: (search: Record<string, unknown>) => ({
    gallery: typeof search.gallery === "string" ? search.gallery : undefined,
  }),
  head: () => createStaticPageSeoHead("soothsayer"),
  component: SoothsayerPage,
});
