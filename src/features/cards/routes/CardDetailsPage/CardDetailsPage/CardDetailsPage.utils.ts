import type { QueryClient } from "@tanstack/react-query";
import type { EGame } from "../../../../../enums";
import {
  DIVINATION_CARD_RARITY_LABELS,
  divinationCardSlug,
} from "../../../../../lib/divinationCards";
import {
  type DropRateCard,
  gameDropRatesQueryOptions,
  leagueDropRatesQueryOptions,
} from "../../../../../lib/dropRates";
import { findLeagueBySlug } from "../../../../../lib/leagueSlug";
import { leagueSlugToName } from "../../../../../lib/seo";
import type { CardSeoFacts } from "../../../../../lib/seoMetadata";
import { cardsQueryOptions } from "../../../hooks/useCardsQuery";
import type { Card } from "../../../types";

export interface CardSeoRouteData {
  leagueName: string;
  card?: Card;
  observedCard?: DropRateCard;
  facts?: CardSeoFacts;
  status?: "error" | "not-found";
}

export async function loadCardSeoRouteData(
  queryClient: QueryClient,
  game: EGame,
  leagueSlug: string,
  cardId: string,
): Promise<CardSeoRouteData> {
  const fallback = { leagueName: leagueSlugToName(leagueSlug) };

  try {
    const { leagues } = await queryClient.ensureQueryData(
      gameDropRatesQueryOptions(game),
    );
    const league = findLeagueBySlug(leagues, leagueSlug);
    if (!league) return { ...fallback, status: "not-found" };

    const leagueDataPromise = queryClient.ensureQueryData(
      leagueDropRatesQueryOptions(game, league.id),
    );
    const initialCardsPromise =
      league.reference_source_url !== undefined || !league.historical
        ? queryClient.ensureQueryData(
            cardsQueryOptions({
              game,
              cardDataUrl: league.reference_source_url,
              allowDefaultSource: !league.historical,
            }),
          )
        : undefined;
    const leagueData = await leagueDataPromise;
    const observedCard = leagueData.cards.find(
      (candidate) =>
        divinationCardSlug(candidate.name) === cardId && candidate.count > 0,
    );
    const observedFacts = observedCard
      ? {
          name: observedCard.name,
          slug: divinationCardSlug(observedCard.name),
          observedCount: observedCard.count,
          observedRate: observedCard.ratio,
        }
      : undefined;
    let cards: Card[];
    try {
      cards =
        initialCardsPromise !== undefined
          ? await initialCardsPromise
          : await queryClient.ensureQueryData(
              cardsQueryOptions({
                game,
                cardDataUrl: leagueData.reference?.source_url,
                allowDefaultSource: false,
              }),
            );
    } catch (error) {
      if (!observedFacts) throw error;
      if (import.meta.env.DEV) {
        console.warn(
          "Unable to load the card catalog; using observations.",
          error,
        );
      }

      return {
        leagueName: league.name,
        observedCard,
        facts: observedFacts,
      };
    }
    const card = cards.find((candidate) => candidate.id === cardId);

    if (!card) {
      if (!observedFacts) {
        return { leagueName: league.name, status: "not-found" };
      }

      return {
        leagueName: league.name,
        observedCard,
        facts: observedFacts,
      };
    }

    return {
      leagueName: league.name,
      card,
      observedCard,
      facts: {
        name: card.name,
        slug: card.id,
        rewardText: card.rewardText,
        stackSize: card.stackSize,
        fromBoss: card.fromBoss,
        rarity: DIVINATION_CARD_RARITY_LABELS[card.rarity],
        imageUrl: card.imageUrl,
        observedCount: observedCard?.count,
        observedRate: observedCard?.ratio,
      },
    };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("Unable to load card SEO data.", error);
    }

    return { ...fallback, status: "error" };
  }
}
