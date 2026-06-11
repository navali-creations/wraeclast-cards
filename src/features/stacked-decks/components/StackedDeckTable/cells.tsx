export function CardImageCell({
  imageUrl,
  name,
}: {
  imageUrl?: string;
  name: string;
}) {
  if (!imageUrl) {
    return (
      <div className="flex h-44 w-28 items-center justify-center rounded border border-(--wc-accent-border) bg-(--color-base-300) text-[10px] text-(--wc-text-40)">
        ?
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={name}
      loading="lazy"
      className="h-44 w-28 rounded border border-(--wc-accent-border) object-cover shadow-[0_2px_8px_-2px_black]"
    />
  );
}

export function DropLocationsCell({ locations }: { locations: string[] }) {
  if (!locations.length) {
    return <span className="text-(--wc-text-40)">—</span>;
  }

  const shown = locations.slice(0, 2).join(", ");
  const extra = locations.length > 2 ? locations.length - 2 : null;

  return (
    <span className="flex items-center gap-1.5 text-xs text-(--wc-text-40)">
      {shown}
      {extra && (
        <span className="rounded border border-(--wc-accent-border) bg-(--color-base-300) px-1 py-0.5 text-[10px] font-medium text-(--wc-text-70)">
          +{extra}
        </span>
      )}
    </span>
  );
}
