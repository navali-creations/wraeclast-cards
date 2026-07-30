import { HeadContent, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { removeStaticSeoElements } from "../../../lib/seo";

interface DocumentHeadProps {
  prerender: boolean;
}

export function DocumentHead({ prerender }: DocumentHeadProps) {
  const [isManagedByReact, setIsManagedByReact] = useState(!prerender);
  const isNotFound = useRouterState({
    select: (state) => state.statusCode === 404,
  });

  useEffect(() => {
    if (!prerender) return;

    removeStaticSeoElements();
    setIsManagedByReact(true);
  }, [prerender]);

  if (!isManagedByReact) return null;

  return isNotFound ? (
    <>
      <title>Page Not Found | wraeclast.cards</title>
      <meta
        name="description"
        content="The requested wraeclast.cards page could not be found."
      />
      <meta name="robots" content="noindex, nofollow" />
    </>
  ) : (
    <HeadContent />
  );
}
