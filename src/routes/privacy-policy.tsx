import { createFileRoute } from "@tanstack/react-router";
import privacyContent from "../../PRIVACY.md?raw";
import { MarkdownPage } from "../components/markdown/MarkdownPage";
import { createStaticPageSeoHead } from "../lib/seo";

export const Route = createFileRoute("/privacy-policy")({
  head: () => createStaticPageSeoHead("privacy"),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return <MarkdownPage content={privacyContent} />;
}
