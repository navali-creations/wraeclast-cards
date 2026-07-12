import { Text } from "../text";

export function FooterBottomBar() {
  return (
    <div className="mt-6 sm:mt-8 pt-4 border-t border-(--wc-border) flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs text-(--wc-text-50)">
      <Text size="xs" muted className="min-w-0 max-w-none">
        <Text as="span" weight="semibold">
          Disclaimer:
        </Text>{" "}
        This product is not affiliated with or endorsed by Grinding Gear Games,
        Path of Exile and all related content, artwork, and trademarks are the
        property of Grinding Gear Games Ltd. All divination cards artwork is
        copyright © Grinding Gear Games.
      </Text>
      <Text size="xs" muted className="sm:shrink-0">
        © {new Date().getFullYear()} wraeclast.cards
      </Text>
    </div>
  );
}
