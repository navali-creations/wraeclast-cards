import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";
import type { DropRateLeague } from "../../../../../lib/dropRates";
import {
  type ComparisonMetric,
  type ComparisonView,
  isComparisonView,
} from "../StackedDecksComparisonPage.utils";
import {
  findDefaultBaselineId,
  getComparisonTransitions,
  getSelectedComparisonLeagueIds,
  resolveBaselineId,
  resolveComparisonTransitionId,
  type StackedDecksComparisonSearchParams,
  serializeComparisonLeagueIds,
} from "./useStackedDecksComparisonRouteState.utils";

const COMPARISON_ROUTE_ID =
  "/$game/$league/stacked-decks_/compare/$comparisonView" as const;
const COMPARISON_ROUTE_PATH =
  "/$game/$league/stacked-decks/compare/$comparisonView" as const;

function getSelectionSearch(
  leagues: readonly DropRateLeague[],
  selectedIds: readonly string[],
  baselineId: string,
  transitionId: string,
): Partial<StackedDecksComparisonSearchParams> {
  const selectedLeagues = leagues.filter((league) =>
    selectedIds.includes(league.id),
  );
  const resolvedBaselineId = resolveBaselineId(
    leagues,
    selectedIds,
    baselineId,
  );
  const transitions = getComparisonTransitions(leagues, selectedIds);
  const resolvedTransitionId = resolveComparisonTransitionId(
    transitions,
    transitionId,
  );
  const transition = transitions.find(
    (option) => option.id === resolvedTransitionId,
  );
  const transitionIsDefault = transition?.id === transitions[0]?.id;

  return {
    leagues: serializeComparisonLeagueIds(selectedIds, leagues),
    baseline:
      resolvedBaselineId === findDefaultBaselineId(selectedLeagues)
        ? undefined
        : resolvedBaselineId,
    from: transitionIsDefault ? undefined : transition?.fromLeague.id,
    to: transitionIsDefault ? undefined : transition?.toLeague.id,
    sortBy: undefined,
    sortAsc: undefined,
    page: undefined,
  };
}

export function useStackedDecksComparisonRouteState(
  comparisonLeagues: readonly DropRateLeague[],
) {
  const search = useSearch({ from: COMPARISON_ROUTE_ID });
  const params = useParams({ from: COMPARISON_ROUTE_ID });
  const navigate = useNavigate({ from: COMPARISON_ROUTE_PATH });
  const selectedLeagueIds = useMemo(
    () => getSelectedComparisonLeagueIds(search.leagues, comparisonLeagues),
    [comparisonLeagues, search.leagues],
  );
  const selectedLeagues = useMemo(
    () =>
      comparisonLeagues.filter((league) =>
        selectedLeagueIds.includes(league.id),
      ),
    [comparisonLeagues, selectedLeagueIds],
  );
  const defaultBaselineId = findDefaultBaselineId(selectedLeagues);
  const baselineLeagueId = resolveBaselineId(
    comparisonLeagues,
    selectedLeagueIds,
    search.baseline ?? defaultBaselineId,
  );
  const moverTransitions = useMemo(
    () => getComparisonTransitions(comparisonLeagues, selectedLeagueIds),
    [comparisonLeagues, selectedLeagueIds],
  );
  const requestedTransitionId =
    search.from && search.to ? `${search.from}:${search.to}` : "";
  const moverTransitionId = resolveComparisonTransitionId(
    moverTransitions,
    requestedTransitionId,
  );
  const moverTransition = moverTransitions.find(
    (transition) => transition.id === moverTransitionId,
  );
  const updateSearch = useCallback(
    (updates: Partial<StackedDecksComparisonSearchParams>, replace = false) => {
      navigate({
        search: (previous) => ({ ...previous, ...updates }),
        replace,
      });
    },
    [navigate],
  );
  const setView = useCallback(
    (view: ComparisonView) => {
      navigate({
        to: COMPARISON_ROUTE_PATH,
        params: {
          game: params.game,
          league: params.league,
          comparisonView: view,
        },
        search: (previous) => ({
          ...previous,
          sortBy: undefined,
          sortAsc: undefined,
          page: undefined,
        }),
      });
    },
    [navigate, params.game, params.league],
  );
  const setMetric = useCallback(
    (metric: ComparisonMetric) =>
      updateSearch({
        metric: metric === "players-saw" ? undefined : metric,
        page: undefined,
      }),
    [updateSearch],
  );
  const setVerified = useCallback(
    (verified: boolean) =>
      updateSearch({ verified: verified ? true : undefined, page: undefined }),
    [updateSearch],
  );
  const setSearchTerm = useCallback(
    (value: string) =>
      updateSearch({ search: value || undefined, page: undefined }, true),
    [updateSearch],
  );
  const setMinimumObservations = useCallback(
    (value: number) =>
      updateSearch({ minDrops: value || undefined, page: undefined }),
    [updateSearch],
  );
  const setBaselineLeagueId = useCallback(
    (leagueId: string) =>
      updateSearch({
        baseline: leagueId === defaultBaselineId ? undefined : leagueId,
      }),
    [defaultBaselineId, updateSearch],
  );
  const setMoverTransitionId = useCallback(
    (transitionId: string) => {
      const transition = moverTransitions.find(
        (option) => option.id === transitionId,
      );
      const isDefault = transition?.id === moverTransitions[0]?.id;
      updateSearch({
        from: isDefault ? undefined : transition?.fromLeague.id,
        to: isDefault ? undefined : transition?.toLeague.id,
        page: undefined,
      });
    },
    [moverTransitions, updateSearch],
  );
  const setHistoryCardName = useCallback(
    (cardName: string, replace = false) =>
      updateSearch({ card: cardName || undefined }, replace),
    [updateSearch],
  );
  const setTableSort = useCallback(
    (column: string | undefined, ascending?: boolean) =>
      updateSearch({
        sortBy: column,
        sortAsc: column && ascending ? true : undefined,
        page: undefined,
      }),
    [updateSearch],
  );
  const setPage = useCallback(
    (page: number, replace = false) =>
      updateSearch({ page: page > 1 ? page : undefined }, replace),
    [updateSearch],
  );
  const toggleLeague = useCallback(
    (leagueId: string) => {
      const isSelected = selectedLeagueIds.includes(leagueId);
      if (isSelected && selectedLeagueIds.length <= 2) return;

      const nextSelected = new Set(selectedLeagueIds);
      if (isSelected) nextSelected.delete(leagueId);
      else nextSelected.add(leagueId);
      const nextIds = comparisonLeagues
        .map((league) => league.id)
        .filter((id) => nextSelected.has(id));

      updateSearch(
        getSelectionSearch(
          comparisonLeagues,
          nextIds,
          baselineLeagueId,
          moverTransitionId,
        ),
      );
    },
    [
      baselineLeagueId,
      comparisonLeagues,
      moverTransitionId,
      selectedLeagueIds,
      updateSearch,
    ],
  );
  const selectAllLeagues = useCallback(() => {
    const allIds = comparisonLeagues.map((league) => league.id);
    updateSearch(
      getSelectionSearch(
        comparisonLeagues,
        allIds,
        baselineLeagueId,
        moverTransitionId,
      ),
    );
  }, [baselineLeagueId, comparisonLeagues, moverTransitionId, updateSearch]);

  return {
    selectedLeagueIds,
    selectedLeagues,
    baselineLeagueId,
    moverTransitions,
    moverTransition,
    view: isComparisonView(params.comparisonView)
      ? params.comparisonView
      : "movers",
    metric: search.metric ?? "players-saw",
    verified: search.verified ?? false,
    searchTerm: search.search ?? "",
    minimumObservations: search.minDrops ?? 0,
    historyCardName: search.card ?? "",
    sortBy: search.sortBy,
    sortAscending: search.sortAsc,
    page: search.page ?? 1,
    setView,
    setMetric,
    setVerified,
    setSearchTerm,
    setMinimumObservations,
    setBaselineLeagueId,
    setMoverTransitionId,
    setHistoryCardName,
    setTableSort,
    setPage,
    toggleLeague,
    selectAllLeagues,
  };
}
