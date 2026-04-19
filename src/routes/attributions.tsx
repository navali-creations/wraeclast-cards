import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/attributions")({
  component: AttributionsPage,
});

function AttributionsPage() {
  return <h1 className="text-2xl font-bold">Attributions</h1>;
}
