import { createContext, useContext } from "react";
import type { DropRateLeague } from "../../../../../lib/dropRates";
import type {
  ComparisonMetric,
  ComparisonView,
} from "../StackedDecksComparisonPage.utils";
import type { ComparisonRow } from "../useStackedDecksComparisonData/useStackedDecksComparisonData.utils";
import type { ComparisonTransition } from "../useStackedDecksComparisonRouteState/useStackedDecksComparisonRouteState.utils";

export interface StackedDecksComparisonContextValue {
  leagues: DropRateLeague[];
  selectedLeagues: DropRateLeague[];
  selectedLeagueIds: string[];
  baselineLeagueId: string;
  baselineLeague: DropRateLeague | undefined;
  moverTransitions: ComparisonTransition[];
  moverTransition: ComparisonTransition | undefined;
  view: ComparisonView;
  metric: ComparisonMetric;
  verified: boolean;
  searchTerm: string;
  minimumObservations: number;
  rows: ComparisonRow[];
  observationCountByLeagueId: ReadonlyMap<string, number>;
  isLoading: boolean;
  hasComparableData: boolean;
  loadingLeagueCount: number;
  failedLeagueNames: string[];
  retryFailedLeagues: () => void;
  historyCardName: string;
  sortBy: string | undefined;
  sortAscending: boolean | undefined;
  page: number;
  setView: (view: ComparisonView) => void;
  setMetric: (metric: ComparisonMetric) => void;
  setVerified: (verified: boolean) => void;
  setSearchTerm: (searchTerm: string) => void;
  setMinimumObservations: (minimumObservations: number) => void;
  setBaselineLeagueId: (leagueId: string) => void;
  setMoverTransitionId: (transitionId: string) => void;
  setHistoryCardName: (cardName: string, replace?: boolean) => void;
  setTableSort: (column: string | undefined, ascending?: boolean) => void;
  setPage: (page: number, replace?: boolean) => void;
  toggleLeague: (leagueId: string) => void;
  selectAllLeagues: () => void;
}

export const StackedDecksComparisonContext =
  createContext<StackedDecksComparisonContextValue | null>(null);

export function useStackedDecksComparison() {
  const context = useContext(StackedDecksComparisonContext);
  if (!context) {
    throw new Error(
      "useStackedDecksComparison must be used within StackedDecksComparisonProvider",
    );
  }

  return context;
}
