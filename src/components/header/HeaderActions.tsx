import { useNavigate, useParams } from "@tanstack/react-router";
import clsx from "clsx";
import type { MouseEvent } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useGameContext } from "../../app/game-context";
import { useLeagueContext } from "../../app/league-context";
import { EGame } from "../../enums";
import type { DropRateLeague } from "../../lib/dropRates";
import { gameToLabel, gameToSlug } from "../../lib/gameSlug";
import { leagueToSlug } from "../../lib/leagueSlug";
import { useDropdown } from "../../lib/useDropdown";
import { Button } from "../buttons";

const SHOW_GAME_SELECTOR = false;

export function HeaderActions() {
  const { game, setGame } = useGameContext();
  const { leagues, selectedLeague, selectedLeagueId, setSelectedLeague } =
    useLeagueContext();
  const { open, containerRef, toggle, close } = useDropdown();
  const { game: gameParam, league: leagueParam } = useParams({
    strict: false,
  });
  const navigate = useNavigate();

  function handleSelectGame(nextGame: EGame) {
    if (game === nextGame) return;
    if (gameParam) {
      navigate({
        to: ".",
        params: (prev) => ({ ...prev, game: gameToSlug(nextGame) }),
        search: (prev) => prev,
      });
      return;
    }
    setGame(nextGame);
  }

  function handleGameClick(event: MouseEvent<HTMLButtonElement>) {
    const { game: nextGame } = event.currentTarget.dataset;
    if (nextGame !== EGame.Poe1 && nextGame !== EGame.Poe2) return;

    handleSelectGame(nextGame);
  }

  function handleSelectLeague(league: DropRateLeague) {
    if (league.id === selectedLeagueId) return;
    if (leagueParam) {
      navigate({
        to: ".",
        params: (prev) => ({ ...prev, league: leagueToSlug(league) }),
        search: (prev) => prev,
      });
      return;
    }
    setSelectedLeague(league);
  }

  function handleLeagueClick(event: MouseEvent<HTMLButtonElement>) {
    const { leagueId } = event.currentTarget.dataset;
    const league = leagues.find((candidate) => candidate.id === leagueId);
    if (!league) return;

    handleSelectLeague(league);
    close();
  }

  return (
    <div className="flex items-center justify-self-end gap-3">
      <div ref={containerRef} className="relative shrink-0">
        <Button
          onClick={toggle}
          disabled={!leagues.length}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="h-9 min-w-32 max-xs:min-w-40 sm:min-w-40 rounded-lg border-0 bg-primary px-3 text-left shadow-md hover:bg-(--wc-primary-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--wc-gold) cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="flex items-center justify-between font-semibold text-primary-content">
            {selectedLeague.name}
            <FiChevronDown
              className={clsx(
                "ml-2 transition-transform duration-200",
                open && "rotate-180",
              )}
            />
          </span>
        </Button>

        <div
          role="listbox"
          className={clsx(
            "absolute right-0 top-full z-50 mt-1.5 min-w-full overflow-hidden rounded-lg border border-(--wc-border) bg-(--wc-card-darker) shadow-lg transition-all duration-200 ease-out",
            {
              "opacity-100 translate-y-0 pointer-events-auto": open,
              "opacity-0 -translate-y-1 pointer-events-none": !open,
            },
          )}
        >
          {leagues.map((league) => (
            <Button
              key={league.id}
              role="option"
              aria-selected={league.id === selectedLeagueId}
              data-league-id={league.id}
              onClick={handleLeagueClick}
              className={clsx(
                "block w-full px-4 py-2.5 text-left font-semibold cursor-pointer",
                {
                  "bg-primary text-primary-content":
                    league.id === selectedLeagueId,
                  "text-(--wc-text) hover:bg-(--wc-hover-glow) hover:text-(--wc-text-90)":
                    league.id !== selectedLeagueId,
                },
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

      {SHOW_GAME_SELECTOR && (
        <div className="relative shrink-0 rounded-lg bg-(--wc-card-darker) p-1 ring-1 ring-(--wc-border)">
          <span
            aria-hidden="true"
            className={clsx(
              "absolute inset-y-1 left-1 w-[calc(50%-0.125rem)] rounded-md bg-primary transition-transform duration-250 ease-out",
              { "translate-x-full": game === EGame.Poe2 },
            )}
          />
          <div className="relative z-10 flex items-center">
            {Object.values(EGame).map((gameVersion) => {
              const isChecked = game === gameVersion;
              return (
                <Button
                  key={gameVersion}
                  aria-pressed={isChecked}
                  data-game={gameVersion}
                  onClick={handleGameClick}
                  className={clsx(
                    "flex h-8 min-w-16 cursor-pointer items-center justify-center rounded-md px-3.5 text-sm font-semibold tracking-wide transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--wc-gold)",
                    {
                      "text-primary-content": isChecked,
                      "text-(--wc-text-60)/92": !isChecked,
                    },
                  )}
                >
                  {gameToLabel(gameVersion)}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
