const SKELETON_COUNT = 24;

const SKELETON_IDS = Array.from(
  { length: SKELETON_COUNT },
  (_, i) => `grid-skeleton-${i}`,
);

export function CardsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {SKELETON_IDS.map((id) => (
        <div
          key={id}
          className="animate-pulse rounded-sm border border-(--wc-gold-dim) bg-(--wc-card-darker) opacity-50"
          style={{ aspectRatio: "3/4" }}
        />
      ))}
    </div>
  );
}
