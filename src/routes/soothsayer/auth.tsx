import { createFileRoute } from "@tanstack/react-router";
import {
  SoothsayerAuthPage,
  validateSearch,
} from "../../features/soothsayer-auth/routes/auth";
import { createStaticPageSeoHead } from "../../lib/seo";

export const Route = createFileRoute("/soothsayer/auth")({
  validateSearch,
  head: () => createStaticPageSeoHead("auth"),
  component: SoothsayerAuthPage,
});
