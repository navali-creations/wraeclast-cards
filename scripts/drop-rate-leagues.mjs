const EXCLUDED_LEAGUE_NAMES = new Set(["Standard"]);

export function filterPublishedDropRateLeagues(leagues) {
  return leagues.filter((league) => !EXCLUDED_LEAGUE_NAMES.has(league.name));
}
