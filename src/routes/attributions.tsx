import { createFileRoute } from "@tanstack/react-router";
import attributionsContent from "../../content/attributions.md?raw";
import { MarkdownPage } from "../components/markdown/MarkdownPage";

export const Route = createFileRoute("/attributions")({
  component: AttributionsPage,
});

function AttributionsPage() {
  return <MarkdownPage content={attributionsContent} />;
}
