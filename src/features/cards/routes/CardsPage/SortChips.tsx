import clsx from "clsx";
import type { MouseEvent } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useCardsPageControlsContext } from "./CardsPageControlsContext";

export function SortChips() {
  const { activeDesc, activeSortLabel, onSortClick, sortLabels } =
    useCardsPageControlsContext();

  const handleSelect = (event: MouseEvent<HTMLButtonElement>) => {
    const { label } = event.currentTarget.dataset;
    if (label) onSortClick(label);
  };

  return (
    <div className="flex items-center gap-2">
      {sortLabels.map((label) => {
        const isActive = activeSortLabel === label;

        return (
          <button
            key={label}
            type="button"
            data-label={label}
            onClick={handleSelect}
            style={{ fontWeight: 400 }}
            className={clsx(
              "btn btn-md gap-1.5 whitespace-nowrap font-normal! normal-case",
              {
                "btn-primary": isActive,
                "btn-outline btn-primary": !isActive,
              },
            )}
          >
            {label}
            {isActive && (
              <span className="inline-flex">
                {activeDesc ? <FiChevronDown /> : <FiChevronUp />}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
