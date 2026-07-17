import { useLeagueContext } from "../../../../../app/league-context";
import { DivinationCard } from "../../../../../components/DivinationCard";
import { PageHeader } from "../../../../../components/page-header/PageHeader/PageHeader";
import { Route } from "../../../../../routes/$game/$league/cards/$cardId";
import { EmptyMessage } from "../../../components/CardsGrid/EmptyMessage";
import { useCardsQuery } from "../../../hooks";
import { CardDetailsExternalLinks } from "../CardDetailsExternalLinks";
import { CardDetailsInfo } from "../CardDetailsInfo";
import { CardDetailsNotFound } from "../CardDetailsNotFound";
import { CardDetailsSkeleton } from "../CardDetailsSkeleton";
import { CardDetailsPageActions } from "./CardDetailsPageActions";
import { CardDetailsPageSubtitle } from "./CardDetailsPageSubtitle";

export function CardDetailsPage() {
  const { cardId } = Route.useParams();
  const { selectedLeague } = useLeagueContext();
  const { data: cards, isLoading, error } = useCardsQuery();
  const card = cards?.find((candidate) => candidate.id === cardId);

  const content = error ? (
    <EmptyMessage>Failed to load cards.</EmptyMessage>
  ) : isLoading ? (
    <CardDetailsSkeleton />
  ) : !card ? (
    <CardDetailsNotFound />
  ) : (
    <div className="overflow-hidden rounded-2xl border border-(--wc-border-dimmed) bg-(--wc-bg-dimmed)/40 p-4 sm:p-6">
      <div className="grid flex-1 items-start justify-items-center gap-8 xl:grid-cols-[minmax(18rem,22rem)_minmax(0,42rem)] xl:justify-center xl:gap-12">
        <div className="flex w-full max-w-88 flex-col items-center gap-4 xl:sticky xl:top-8 xl:self-start">
          <DivinationCard
            card={card}
            className="shrink-0"
            scaleClassName="[--wc-card-scale:0.9] xs:[--wc-card-scale:1]"
          />
          <CardDetailsExternalLinks card={card} />
        </div>
        <CardDetailsInfo card={card} />
      </div>
    </div>
  );

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <PageHeader
        title={card?.name ?? "Card details"}
        subtitle={
          card && (
            <CardDetailsPageSubtitle
              rarity={card.rarity}
              leagueName={selectedLeague.name}
            />
          )
        }
        actions={<CardDetailsPageActions />}
      />

      <div className="mt-3 flex flex-1 flex-col bg-primary-content min-h-0">
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8">
          {content}
        </div>
      </div>
    </div>
  );
}
