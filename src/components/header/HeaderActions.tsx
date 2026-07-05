import clsx from "clsx";
import { useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useGame } from "../../app/game-context";
import { useLeague } from "../../app/league-context";
import { EGame } from "../../enums";
import { useGameDropRates } from "../../lib/dropRates";
import { useDropdown } from "../../lib/useDropdown";
import { Button } from "../buttons";

export function HeaderActions() {
  const { game, setGame } = useGame();
  const { leagueId, setLeagueId } = useLeague();
  const { data: gameRates } = useGameDropRates(game);
  const { open, containerRef, toggle, close } = useDropdown();

  useEffect(() => {
    if (!leagueId && gameRates?.leagues.length) {
      const first =
        gameRates.leagues.find((l) => !l.historical) ?? gameRates.leagues[0];
      if (first) setLeagueId(first.id);
    }
  }, [gameRates, leagueId, setLeagueId]);

  const leagues = gameRates?.leagues ?? [];
  const selectedLeague = leagues.find((l) => l.id === leagueId);

  return (
    <div className="navbar-end gap-3 max-xs:flex-none max-xs:w-full max-xs:justify-between max-xs:px-6 max-xs:pb-4">
      <div ref={containerRef} className="relative shrink-0">
        <Button
          onClick={toggle}
          disabled={!leagues.length}
          className="h-9 min-w-32 max-xs:min-w-40 sm:min-w-40 rounded-lg border-0 bg-primary px-3 text-left shadow-md hover:bg-(--wc-primary-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--wc-gold) cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="flex items-center justify-between font-semibold text-primary-content">
            {selectedLeague?.name ?? "—"}
            <FiChevronDown
              className={clsx(
                "ml-2 transition-transform duration-200",
                open && "rotate-180",
              )}
            />
          </span>
        </Button>

        <div
          className={clsx(
            "absolute right-0 top-full z-50 mt-1.5 min-w-full overflow-hidden rounded-lg border border-(--wc-border) bg-(--wc-card-darker) shadow-lg transition-all duration-200 ease-out",
            open
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-1 pointer-events-none",
          )}
        >
          {leagues.map((league) => (
            <Button
              key={league.id}
              onClick={() => {
                setLeagueId(league.id);
                close();
              }}
              className={clsx(
                "block w-full px-4 py-2.5 text-left font-semibold cursor-pointer",
                league.id === leagueId
                  ? "bg-primary text-primary-content"
                  : "text-(--wc-text) hover:bg-(--wc-hover-glow) hover:text-(--wc-text-90)",
              )}
            >
              {league.name}
              {league.historical && (
                <span className="ml-2 text-[10px] uppercase tracking-wider opacity-50">
                  historical
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      <div className="relative shrink-0 rounded-lg p-1 bg-(--wc-card-darker) ring-1 ring-(--wc-border)">
        <span
          aria-hidden="true"
          className={clsx(
            "absolute inset-y-1 left-1 w-[calc(50%-0.125rem)] rounded-md bg-primary transition-transform duration-250 ease-out",
            game === EGame.Poe2 && "translate-x-full",
          )}
        />
        <div className="relative z-10 flex items-center">
          {Object.values(EGame).map((gameVersion) => {
            const isChecked = game === gameVersion;
            return (
              <Button
                key={gameVersion}
                aria-pressed={isChecked}
                onClick={() => setGame(gameVersion)}
                className={clsx(
                  "h-8 min-w-16 px-3.5 flex items-center justify-center rounded-md text-sm font-semibold tracking-wide transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--wc-gold)",
                  isChecked ? "text-primary-content" : "text-(--wc-text-60)/92",
                )}
              >
                {gameVersion === EGame.Poe1 ? "PoE 1" : "PoE 2"}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
