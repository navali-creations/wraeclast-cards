import { InternalLink } from "../links";

export function HeaderBrand() {
  return (
    <InternalLink
      to=""
      className="font-cinzel text-lg font-bold tracking-widest uppercase text-(--wc-gold) px-2"
    >
      Wraeclast<span className="text-(--color-primary)">.</span>Cards
    </InternalLink>
  );
}
