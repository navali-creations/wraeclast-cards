import { useGameContext } from "../../../../../app/game-context";
import { useLeagueContext } from "../../../../../app/league-context";
import { DivinationCard } from "../../../../../components/DivinationCard";
import { PageContent } from "../../../../../components/page-content/PageContent/PageContent";
import { PageHeader } from "../../../../../components/page-header/PageHeader/PageHeader";
import { divinationCardSlug } from "../../../../../lib/divinationCards";
import { useLeagueDropRates } from "../../../../../lib/dropRates";
import { Route } from "../../../../../routes/$game/$league/cards/$cardId";
import { EmptyMessage } from "../../../components/CardsGrid/EmptyMessage";
import { useCardsQuery } from "../../../hooks";
import { CardDetailsExternalLinks } from "../CardDetailsExternalLinks";
import { CardDetailsInfo } from "../CardDetailsInfo";
import { CardDetailsNotFound } from "../CardDetailsNotFound";
import { CardDetailsObservedOnly } from "../CardDetailsObservedOnly/CardDetailsObservedOnly";
import { CardDetailsSkeleton } from "../CardDetailsSkeleton";
import { CardDetailsPageActions } from "./CardDetailsPageActions";
import { CardDetailsPageSubtitle } from "./CardDetailsPageSubtitle";

export function CardDetailsPage() {
  const { cardId } = Route.useParams();
  const { game } = useGameContext();
  const { selectedLeague, selectedLeagueId } = useLeagueContext();
  const { data: cards, isLoading, error } = useCardsQuery();
  const {
    data: leagueData,
    isLoading: isLoadingDropRates,
    error: dropRatesError,
  } = useLeagueDropRates(game, selectedLeagueId);
  const card = cards?.find((candidate) => candidate.id === cardId);
  const observedCard = leagueData?.cards.find(
    (candidate) =>
      divinationCardSlug(candidate.name) === cardId && candidate.count > 0,
  );

  function renderContent() {
    if (isLoading) return <CardDetailsSkeleton />;
    if (!card && isLoadingDropRates) return <CardDetailsSkeleton />;
    if (!card && observedCard) {
      return (
        <CardDetailsObservedOnly
          card={observedCard}
          leagueName={selectedLeague.name}
        />
      );
    }
    if (error) return <EmptyMessage>Failed to load cards.</EmptyMessage>;
    if (!card) {
      if (dropRatesError) {
        return <EmptyMessage>Failed to load card observations.</EmptyMessage>;
      }

      return <CardDetailsNotFound />;
    }

    return (
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
  }

  const content = renderContent();

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <PageHeader
        title={card?.name ?? observedCard?.name ?? "Card details"}
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

      <PageContent>
        <div className="mx-auto flex w-full max-w-300 flex-1 flex-col justify-center px-4 py-6">
          {content}
        </div>
      </PageContent>
    </div>
  );
}
