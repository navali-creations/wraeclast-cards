import { createFileRoute } from "@tanstack/react-router";
import { createStaticPageSeoHead } from "../lib/seo";

export const Route = createFileRoute("/downloads")({
  head: () => createStaticPageSeoHead("downloads"),
  component: DownloadsPage,
});

function DownloadsPage() {
  return <h1 className="text-2xl font-bold">Downloads</h1>;
}
