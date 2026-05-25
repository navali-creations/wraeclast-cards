import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { MarkdownPage } from "../components/markdown/MarkdownPage";

const PRIVACY_MD_URL =
  "https://raw.githubusercontent.com/navali-creations/wraeclast-cards/main/PRIVACY.md";

export const Route = createFileRoute("/privacy-policy")({
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["privacy-policy"],
    queryFn: async () => {
      const res = await fetch(PRIVACY_MD_URL);
      if (!res.ok) throw new Error("Failed to load Privacy Policy");
      return res.text();
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <span className="loading loading-spinner loading-md" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-error">
        Failed to load Privacy Policy. Please try again later.
      </p>
    );
  }

  return <MarkdownPage content={data ?? ""} />;
}
