import { InternalLink } from "../links";
import { Text } from "../text";

export function FooterBrand() {
  return (
    <div className="sm:max-w-72 md:max-w-md lg:max-w-2xl">
      <InternalLink
        to=""
        className="font-cinzel text-base font-bold tracking-widest uppercase text-(--wc-gold)"
      >
        Wraeclast<span className="text-(--color-primary)">.</span>Cards
      </InternalLink>
      <Text size="sm" muted className="mt-2 lg:whitespace-nowrap">
        Divination card database, price tracking, and stacked deck analytics for
        Path of Exile.
      </Text>
    </div>
  );
}
