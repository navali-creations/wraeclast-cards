import { createFileRoute } from "@tanstack/react-router";
import { SoothsayerPage } from "../../../../features/soothsayer/routes/SoothsayerPage/SoothsayerPage";
import { asString } from "../../../../lib/searchParams";

export const Route = createFileRoute("/$game/$league/soothsayer/")({
  validateSearch: (search: Record<string, unknown>) => ({
    gallery: asString(search.gallery),
  }),
  component: SoothsayerPage,
});
