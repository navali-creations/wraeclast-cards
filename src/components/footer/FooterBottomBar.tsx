export function FooterBottomBar() {
  return (
    <div className="mt-8 pt-4 border-t border-(--wc-border) flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs text-(--wc-text-50)">
      <p className="max-w-lg">
        <span className="font-semibold">Disclaimer:</span> This product is not
        affiliated with or endorsed by Grinding Gear Games, Path of Exile and
        all related content, artwork, and trademarks are the property of
        Grinding Gear Games Ltd. All divination cards artwork is copyright ©
        Grinding Gear Games.
      </p>
      <p className="sm:shrink-0">
        © {new Date().getFullYear()} wraeclast.cards
      </p>
    </div>
  );
}
