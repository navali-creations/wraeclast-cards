import { clsx } from "clsx";

function SkeletonRow({ isOdd }: { isOdd: boolean }) {
  return (
    <div
      className={clsx(
        "flex items-center gap-4 border-t border-(--wc-border-dimmed) px-4 py-3",
        isOdd ? "bg-(--wc-table-odd)" : "bg-(--wc-table-even)",
      )}
    >
      <div className="hidden h-4 w-5 rounded bg-(--wc-skeleton) sm:block" />
      <div className="h-4 w-44 rounded bg-(--wc-skeleton)" />
      <div className="ml-auto hidden h-4 w-16 rounded bg-(--wc-skeleton) sm:block" />
      <div className="ml-auto h-5 w-14 rounded-full bg-(--wc-skeleton) sm:ml-0" />
      <div className="hidden h-4 w-10 rounded bg-(--wc-skeleton) lg:block" />
    </div>
  );
}

const SKELETON_ROWS = Array.from({ length: 8 }, (_, i) => ({
  key: `skeleton-${i}`,
  isOdd: i % 2 !== 0,
}));

export function Skeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-lg border border-(--wc-border-dimmed)">
      <div className="h-10 bg-(--color-base-100)" />
      {SKELETON_ROWS.map(({ key, isOdd }) => (
        <SkeletonRow key={key} isOdd={isOdd} />
      ))}
    </div>
  );
}
