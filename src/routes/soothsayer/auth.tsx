import { createFileRoute } from "@tanstack/react-router";
import {
  SoothsayerAuthPage,
  validateSearch,
} from "../../features/soothsayer-auth/routes/auth";

export const Route = createFileRoute("/soothsayer/auth")({
  validateSearch,
  component: SoothsayerAuthPage,
});
