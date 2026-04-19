import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/downloads")({
  component: DownloadsPage,
});

function DownloadsPage() {
  return <h1 className="text-2xl font-bold">Downloads</h1>;
}
