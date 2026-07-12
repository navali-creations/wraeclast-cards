import { clsx } from "clsx";

const SKELETON_ROWS = Array.from({ length: 20 }, (_, i) => ({
  key: `skeleton-${i}`,
  isOdd: i % 2 !== 0,
}));
const SKELETON_TOGGLES = [
  "reference",
  "players",
  "comparison",
  "drops",
] as const;

export function Skeleton() {
  return (
    <div className="flex flex-col gap-4">
      <section className="animate-pulse overflow-hidden rounded-lg border border-(--wc-border-dimmed) bg-(--wc-bg-dimmed)">
        <div className="flex xs:hidden border-b border-(--wc-border-dimmed) bg-(--wc-glow)">
          {SKELETON_TOGGLES.map((key) => (
            <div
              key={`mobile-toggle-${key}`}
              className="flex flex-1 justify-center border-r border-(--wc-border-dimmed) py-3 last:border-r-0"
            >
              <div className="h-3 w-20 rounded bg-(--wc-skeleton)" />
            </div>
          ))}
        </div>

        <div className="hidden xs:flex border-b border-(--wc-border-dimmed) bg-(--wc-glow) md:hidden">
          {SKELETON_TOGGLES.map((key) => (
            <div
              key={`tablet-toggle-${key}`}
              className="flex flex-1 justify-center border-r border-(--wc-border-dimmed) py-3 last:border-r-0"
            >
              <div className="h-3 w-20 rounded bg-(--wc-skeleton)" />
            </div>
          ))}
        </div>

        <div className="h-10 bg-(--color-base-100)" />
        {SKELETON_ROWS.map(({ key, isOdd }) => (
          <div
            key={key}
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
        ))}

        <div className="flex items-center justify-between border-t border-(--wc-accent-border) bg-(--wc-glow) px-3 py-2">
          <div className="h-3 w-64 max-w-[65%] rounded bg-(--wc-skeleton)" />
          <div className="h-4 w-16 rounded bg-(--wc-skeleton)" />
        </div>
      </section>

      <div className="flex h-9 items-center justify-center">
        <div className="h-9 w-44 rounded bg-(--wc-skeleton)" />
      </div>
    </div>
  );
}
