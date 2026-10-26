import { type ReactNode, useMemo } from "react";
import { useLeagueContext } from "../../../../../app/league-context";
import { StackedDecksComparisonContext } from "../StackedDecksComparisonContext/StackedDecksComparisonContext";
import { useStackedDecksComparisonData } from "../useStackedDecksComparisonData/useStackedDecksComparisonData";
import {
  buildComparisonRows,
  filterComparisonRows,
  getLeagueObservationCount,
} from "../useStackedDecksComparisonData/useStackedDecksComparisonData.utils";
import { useStackedDecksComparisonRouteState } from "../useStackedDecksComparisonRouteState/useStackedDecksComparisonRouteState";
import { getComparableLeagues } from "../useStackedDecksComparisonRouteState/useStackedDecksComparisonRouteState.utils";

export function StackedDecksComparisonProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { leagues } = useLeagueContext();
  const comparisonLeagues = useMemo(
    () => getComparableLeagues(leagues),
    [leagues],
  );
  const routeState = useStackedDecksComparisonRouteState(comparisonLeagues);
  const {
    selectedLeagues,
    baselineLeagueId,
    moverTransition,
    verified,
    metric,
    minimumObservations,
    searchTerm,
  } = routeState;
  const baselineLeague = selectedLeagues.find(
    (league) => league.id === baselineLeagueId,
  );
  const {
    dataByLeagueId,
    failedLeagueNames,
    loadingLeagueCount,
    loadedLeagueCount,
    isLoading,
    retryFailedLeagues,
  } = useStackedDecksComparisonData(selectedLeagues);
  const observationCountByLeagueId = useMemo(
    () =>
      new Map(
        selectedLeagues.flatMap((league) => {
          const leagueData = dataByLeagueId.get(league.id);

          return leagueData
            ? [[league.id, getLeagueObservationCount(leagueData, verified)]]
            : [];
        }),
      ),
    [dataByLeagueId, selectedLeagues, verified],
  );
  const comparisonRows = useMemo(
    () =>
      buildComparisonRows({
        leagues: selectedLeagues,
        dataByLeagueId,
        baselineLeagueId,
        verified,
        metric,
        minimumObservations,
      }),
    [
      selectedLeagues,
      dataByLeagueId,
      baselineLeagueId,
      verified,
      metric,
      minimumObservations,
    ],
  );
  const rows = useMemo(
    () => filterComparisonRows(comparisonRows, searchTerm),
    [comparisonRows, searchTerm],
  );

  return (
    <StackedDecksComparisonContext.Provider
      value={{
        ...routeState,
        leagues: comparisonLeagues,
        baselineLeague,
        moverTransition,
        rows,
        observationCountByLeagueId,
        isLoading,
        hasComparableData: loadedLeagueCount >= 2,
        loadingLeagueCount,
        failedLeagueNames,
        retryFailedLeagues,
      }}
    >
      {children}
    </StackedDecksComparisonContext.Provider>
  );
}
