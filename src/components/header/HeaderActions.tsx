import { useNavigate, useParams } from "@tanstack/react-router";
import clsx from "clsx";
import type { MouseEvent } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useLeagueContext } from "../../app/league-context";
import type { DropRateLeague } from "../../lib/dropRates";
import { leagueToSlug } from "../../lib/leagueSlug";
import { useDropdown } from "../../lib/useDropdown";
import { Button } from "../buttons";

export function HeaderActions() {
  const { leagues, selectedLeague, selectedLeagueId, setSelectedLeague } =
    useLeagueContext();
  const { open, containerRef, toggle, close } = useDropdown();
  const { league: leagueParam } = useParams({
    strict: false,
  });
  const navigate = useNavigate();

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
    </div>
  );
}
