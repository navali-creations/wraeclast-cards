import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useGameContext } from "../../../../../app/game-context";
import type {
  DropRateLeague,
  LeagueDropRates,
} from "../../../../../lib/dropRates";
import { leagueDropRatesQueryOptions } from "../../../../../lib/dropRates";

export function useStackedDecksComparisonData(
  selectedLeagues: readonly DropRateLeague[],
) {
  const { game } = useGameContext();
  const queryClient = useQueryClient();
  const results = useQueries({
    queries: selectedLeagues.map((league) => {
      const options = leagueDropRatesQueryOptions(game, league.id);

      return {
        ...options,
        enabled:
          typeof window !== "undefined" ||
          queryClient.getQueryData(options.queryKey) !== undefined,
      };
    }),
  });

  const dataByLeagueId = useMemo(
    () =>
      new Map<string, LeagueDropRates | undefined>(
        selectedLeagues.map((league, index) => [
          league.id,
          results[index]?.data,
        ]),
      ),
    [results, selectedLeagues],
  );
  const failedLeagueNames = selectedLeagues
    .filter((_, index) => results[index]?.isError)
    .map((league) => league.name);
  const loadingLeagueCount = results.filter(
    (result) => result.data === undefined && !result.isError,
  ).length;
  const loadedLeagueCount = results.filter(
    (result) => result.data !== undefined,
  ).length;
  function retryFailedLeagues() {
    for (const result of results) {
      if (result.isError) void result.refetch();
    }
  }

  return {
    dataByLeagueId,
    failedLeagueNames,
    loadingLeagueCount,
    loadedLeagueCount,
    isLoading: loadingLeagueCount > 0,
    retryFailedLeagues,
  };
}
