import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/soothsayer")({
  component: SoothsayerLayout,
});

function SoothsayerLayout() {
  return <Outlet />;
}
