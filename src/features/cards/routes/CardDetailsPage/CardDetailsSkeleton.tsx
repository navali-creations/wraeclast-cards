import {
  DIVINATION_CARD_HEIGHT,
  DIVINATION_CARD_WIDTH,
} from "../../../../components/DivinationCard/constants";

export function CardDetailsSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-(--wc-border-dimmed) bg-(--wc-bg-dimmed)/40 p-4 sm:p-6">
      <div className="grid flex-1 items-start justify-items-center gap-8 xl:grid-cols-[minmax(18rem,22rem)_minmax(0,42rem)] xl:justify-center xl:gap-12">
        <div className="flex w-full max-w-88 flex-col items-center gap-4 xl:self-start">
          <div
            className="wc-card-shimmer shrink-0 rounded-sm border border-(--wc-gold-dim)"
            style={{
              width: DIVINATION_CARD_WIDTH,
              height: DIVINATION_CARD_HEIGHT,
            }}
          />
          <div className="wc-divider-glow grid w-full grid-cols-3 gap-2 pt-5">
            <div className="wc-card-shimmer h-10 rounded-md border border-(--wc-border-dimmed)" />
            <div className="wc-card-shimmer h-10 rounded-md border border-(--wc-border-dimmed)" />
            <div className="wc-card-shimmer h-10 rounded-md border border-(--wc-border-dimmed)" />
          </div>
        </div>
        <div className="w-full max-w-2xl space-y-4">
          <div className="overflow-hidden rounded-xl">
            <div className="flex items-start justify-between gap-4 bg-(--wc-bg-dimmed)/45 px-4 py-4 sm:px-5">
              <div>
                <div className="wc-card-shimmer h-4 w-20 rounded" />
                <div className="wc-card-shimmer mt-2 h-3 w-64 max-w-full rounded" />
              </div>
              <div className="wc-card-shimmer h-6 w-20 shrink-0 rounded border border-(--wc-border-dimmed)" />
            </div>
            <div className="grid sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: Static loading placeholders do not reorder.
                  key={index}
                  className="flex min-h-28 gap-3 border-t border-(--wc-border-dimmed) p-4 sm:p-5 sm:nth-[2n]:border-l"
                >
                  <div className="wc-card-shimmer size-9 shrink-0 rounded-md border border-(--wc-border-dimmed)" />
                  <div className="min-w-0 flex-1">
                    <div className="wc-card-shimmer h-3 w-20 rounded" />
                    <div className="wc-card-shimmer mt-3 h-5 w-28 rounded" />
                    <div className="wc-card-shimmer mt-3 h-3 w-full rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl p-4 sm:p-5">
            <div className="-mx-4 -mt-4 border-b border-(--wc-border-dimmed) bg-(--wc-bg-dimmed)/45 px-4 py-4 sm:-mx-5 sm:-mt-5 sm:px-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="wc-card-shimmer h-4 w-24 rounded" />
                  <div className="wc-card-shimmer mt-2 h-3 w-72 max-w-full rounded" />
                </div>
                <div className="hidden rounded-lg border border-(--wc-border-dimmed) bg-(--wc-bg-dimmed)/80 p-1 sm:inline-flex">
                  <div className="wc-card-shimmer h-8 w-22 rounded-md" />
                  <div className="wc-card-shimmer h-8 w-22 rounded-md" />
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:hidden">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: Static loading placeholders do not reorder.
                  key={index}
                  className="rounded-md border border-(--wc-border-dimmed) bg-(--wc-table-even) p-3"
                >
                  <div className="wc-card-shimmer h-3 w-20 rounded" />
                  <div className="wc-card-shimmer mt-3 h-4 w-24 rounded" />
                </div>
              ))}
            </div>
            <div className="wc-card-shimmer mt-4 hidden h-55 w-full rounded-lg border border-(--wc-border-dimmed) sm:block" />
          </div>
        </div>
      </div>
    </div>
  );
}
