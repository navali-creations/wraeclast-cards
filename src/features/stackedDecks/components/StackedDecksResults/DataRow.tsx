import { useNavigate } from "@tanstack/react-router";
import type { Row } from "@tanstack/react-table";
import { clsx } from "clsx";
import type { CSSProperties, MouseEvent } from "react";
import { useGameContext } from "../../../../app/game-context";
import { useLeagueContext } from "../../../../app/league-context";
import { divinationCardSlug } from "../../../../lib/divinationCards";
import { gameToSlug } from "../../../../lib/gameSlug";
import { leagueToSlug } from "../../../../lib/leagueSlug";
import type { StackedDecksRow } from "../../hooks";
import { StackedDecksTableRow } from "../StackedDecksTable";

interface DataRowProps {
  row: Row<StackedDecksRow>;
  animationIndex: number;
  shouldAnimate: boolean;
}

function shouldSkipRowNavigation(target: EventTarget | null) {
  const element =
    target instanceof Element
      ? target
      : target instanceof Node
        ? target.parentElement
        : null;

  return (
    element !== null &&
    Boolean(element.closest("a, button, input, select, textarea"))
  );
}

export function DataRow({ row, animationIndex, shouldAnimate }: DataRowProps) {
  const navigate = useNavigate();
  const { game } = useGameContext();
  const { selectedLeague } = useLeagueContext();
  const cardId = divinationCardSlug(row.original.name);

  const handleOpenCard = () => {
    navigate({
      to: "/$game/$league/cards/$cardId",
      params: {
        game: gameToSlug(game),
        league: leagueToSlug(selectedLeague),
        cardId,
      },
    });
  };

  const handleRowClick = (event: MouseEvent<HTMLTableRowElement>) => {
    if (event.defaultPrevented || shouldSkipRowNavigation(event.target)) return;

    handleOpenCard();
  };

  return (
    <StackedDecksTableRow
      row={row}
      onClick={handleRowClick}
      className={clsx(
        "cursor-pointer",
        shouldAnimate && "wc-stacked-decks-row-enter",
      )}
      style={{ "--row-stagger": animationIndex } as CSSProperties}
    />
  );
}
