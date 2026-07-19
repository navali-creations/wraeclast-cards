import { useLeagueContext } from "../../../app/league-context";
import { resolveDropRatesUrl } from "../../../lib/dropRates";

export function useSelectedCardsDataSource() {
  const { selectedLeague } = useLeagueContext();
  const leagueDataUrl = selectedLeague.url
    ? resolveDropRatesUrl(selectedLeague.url)
    : undefined;

  return {
    cardDataUrl: selectedLeague.reference_source_url,
    leagueDataUrl,
  };
}
