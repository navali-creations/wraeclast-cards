import { Heading } from "../../../../components/headings";
import { Text } from "../../../../components/text";
import {
  StackedDecksFilters,
  type StackedDecksView,
  VerifiedToggle,
  ViewToggle,
} from "../../components";

interface StackedDecksSummary {
  totalCount: number;
  leagueName: string | undefined;
}

interface StackedDecksHeaderProps {
  // undefined means "not loaded yet" — the count/league line is hidden until then.
  summary: StackedDecksSummary | undefined;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  suggestions: string[];
  view: StackedDecksView;
  onViewChange: (value: StackedDecksView) => void;
  verified: boolean;
  onVerifiedChange: (value: boolean) => void;
}

export function StackedDecksHeader({
  summary,
  searchTerm,
  onSearchTermChange,
  suggestions,
  view,
  onViewChange,
  verified,
  onVerifiedChange,
}: StackedDecksHeaderProps) {
  return (
    <div className="border-b border-base-100 pt-5 pb-4">
      <div className="mx-auto flex w-full max-w-300 flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <Heading
              as="h1"
              className="leading-none tracking-tight text-(--wc-gold-bright) sm:text-5xl"
            >
              Stacked Decks
            </Heading>
          </div>
          <Text size="sm" className="mt-1 min-h-5 text-(--wc-text-70)">
            {summary && (
              <>
                <Text as="span" weight="semibold" className="text-(--wc-gold)">
                  {summary.totalCount.toLocaleString()}
                </Text>{" "}
                observations · {summary.leagueName} league
              </>
            )}
          </Text>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <StackedDecksFilters
            value={searchTerm}
            onChange={onSearchTermChange}
            suggestions={suggestions}
          />
          <ViewToggle view={view} onChange={onViewChange} />
          <VerifiedToggle verified={verified} onChange={onVerifiedChange} />
        </div>
      </div>
    </div>
  );
}
