import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/soothsayer")({
  component: SoothsayerPage,
});

function SoothsayerPage() {
  return <h1 className="text-2xl font-bold">Soothsayer</h1>;
}
