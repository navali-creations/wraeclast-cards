import clsx from "clsx";
import { InternalLink } from "../links";

interface SiteLogoProps {
  className?: string;
}

export function SiteLogo({ className }: SiteLogoProps) {
  return (
    <InternalLink
      to=""
      className={clsx(
        "inline-block font-fontin font-bold tracking-wide text-(--wc-gold)",
        className,
      )}
    >
      wraeclast<span className="text-(--color-primary)">.</span>cards
    </InternalLink>
  );
}
