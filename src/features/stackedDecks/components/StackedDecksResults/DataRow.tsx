import { useNavigate } from "@tanstack/react-router";
import { flexRender, type Row } from "@tanstack/react-table";
import { clsx } from "clsx";
import type { CSSProperties, MouseEvent } from "react";
import { useGameContext } from "../../../../app/game-context";
import { useLeagueContext } from "../../../../app/league-context";
import { gameToSlug } from "../../../../lib/gameSlug";
import { leagueToSlug } from "../../../../lib/leagueSlug";
import type { StackedDecksRow } from "../../hooks";

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
  const cardId = row.original.card_id ?? row.original.name;

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
    <tr
      onClick={handleRowClick}
      className={clsx(
        "group cursor-pointer border-t border-(--wc-border-dimmed) transition-colors odd:bg-(--wc-table-even) even:bg-(--wc-table-odd) hover:bg-(--wc-bg-dimmed)",
        shouldAnimate && "wc-stacked-decks-row-enter",
      )}
      style={{ "--row-stagger": animationIndex } as CSSProperties}
    >
      {row.getVisibleCells().map((cell) => {
        const meta = cell.column.columnDef.meta;
        const isSorted = cell.column.getIsSorted();
        return (
          <td
            key={cell.id}
            className={clsx(
              "px-3 py-3",
              meta?.align === "right" && "text-right",
              meta?.tdClassName,
              isSorted && "xs:bg-(--wc-skeleton-highlight)",
            )}
          >
            <div className="wc-stacked-decks-cell-content">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          </td>
        );
      })}
    </tr>
  );
}
