import { createFileRoute } from "@tanstack/react-router";
import attributionsContent from "../../content/attributions.md?raw";
import { MarkdownPage } from "../components/markdown/MarkdownPage";
import { createStaticPageSeoHead } from "../lib/seo";

export const Route = createFileRoute("/attributions")({
  head: () => createStaticPageSeoHead("attributions"),
  component: AttributionsPage,
});

function AttributionsPage() {
  return <MarkdownPage content={attributionsContent} />;
}
