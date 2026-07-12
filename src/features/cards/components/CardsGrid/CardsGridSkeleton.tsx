const SKELETON_COUNT = 24;

const SKELETON_IDS = Array.from(
  { length: SKELETON_COUNT },
  (_, i) => `grid-skeleton-${i}`,
);

export function CardsGridSkeleton() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-4">
      {SKELETON_IDS.map((id) => (
        <div
          key={id}
          className="wc-card-shimmer aspect-3/4 rounded-sm border border-(--wc-gold-dim)"
        />
      ))}
    </div>
  );
}
