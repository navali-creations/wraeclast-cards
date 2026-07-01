import { ButtonInternalLink } from "../../../components/buttons";
import { Heading } from "../../../components/headings";
import { Text } from "../../../components/text";
import { useDropRatesIndex } from "../api/dropRatesIndex";

const PREVIEW_COUNT = 3;
const SKELETON_KEYS = Array.from(
  { length: PREVIEW_COUNT },
  (_, idx) => `skeleton-league-${idx}`,
);

export function DownloadsPanel() {
  const { data, isLoading } = useDropRatesIndex();
  const leagues = data?.games.poe1.leagues ?? [];
  const preview = leagues.slice(0, PREVIEW_COUNT);
  const remaining = leagues.length - preview.length;

  return (
    <div className="flex-1 rounded-xl border border-(--wc-border) bg-base-300 p-6">
      <div className="flex h-full flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Text
            size="xs"
            weight="semibold"
            uppercase
            className="tracking-wider text-info"
          >
            Downloads
          </Text>
          <Heading as="h2" size="lg" className="text-(--wc-text-90)">
            Per-league datasets
          </Heading>
        </div>

        <Text size="sm" className="text-(--wc-text-60)">
          100–200 MB NDJSON archives of pricing data — one file per league.
        </Text>

        <div className="flex items-center gap-2 overflow-x-auto">
          {isLoading
            ? SKELETON_KEYS.map((key) => (
                <span
                  key={key}
                  className="skeleton h-7 w-20 rounded-full shrink-0"
                />
              ))
            : preview.map((league) => (
                <span
                  key={league.id}
                  className="rounded-full border border-(--wc-border) px-4 py-1.5 text-xs text-(--wc-text-60) shrink-0"
                >
                  {league.name}
                </span>
              ))}
        </div>

        {!isLoading && remaining > 0 && (
          <span className="text-xs text-(--wc-text-50)">
            + {remaining} more
          </span>
        )}

        <ButtonInternalLink
          to="/downloads"
          className="mt-auto flex w-full items-center gap-2 rounded-lg border border-(--wc-accent-border) bg-(--wc-glow) px-4 py-2 text-sm font-medium text-(--wc-text-90) transition-colors hover:brightness-110"
        >
          <span>⬇</span>
          Browse all archives
        </ButtonInternalLink>
      </div>
    </div>
  );
}
