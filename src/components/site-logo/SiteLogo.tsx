import clsx from "clsx";
import { InternalLink } from "../links";

interface SiteLogoProps {
  className?: string;
  betaClassName?: string;
}

export function SiteLogo({ className, betaClassName }: SiteLogoProps) {
  return (
    <InternalLink
      to=""
      className={clsx(
        "relative inline-block font-fontin font-bold tracking-wide text-(--wc-gold)",
        className,
      )}
    >
      wraeclast<span className="text-(--color-primary)">.</span>cards
      <span
        className={clsx(
          "absolute -top-1.5 -right-7 rounded-full border border-(--wc-gold-dim) bg-(--wc-card-darker) px-1.5 py-0.5 font-sans text-[9px] leading-none font-bold tracking-wider text-(--wc-gold-muted) uppercase",
          betaClassName,
        )}
      >
        beta
      </span>
    </InternalLink>
  );
}
