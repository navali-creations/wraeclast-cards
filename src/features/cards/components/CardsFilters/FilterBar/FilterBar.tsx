import clsx from "clsx";
import {
  type ChangeEvent,
  type HTMLAttributes,
  type MouseEvent,
  useState,
} from "react";
import { FiCheck, FiPlus, FiSearch } from "react-icons/fi";
import {
  type FilterFacet,
  type FilterRangeValue,
  type FilterValue,
  getDisplayOptions,
  getOptionBackgroundStyle,
  getRangeValue,
  isFullRangeValue,
  normalizeRangeValue,
  normalizeValue,
} from "./FilterBar.utils";
import { RangeFilter } from "./RangeFilter/RangeFilter";

interface FilterBarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  facets: FilterFacet[];
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  searchable?: boolean;
  showCounts?: boolean;
}

export function FilterBar({
  facets,
  value,
  onChange,
  searchable = true,
  showCounts = true,
  className,
  ...props
}: FilterBarProps) {
  const [searchByFacet, setSearchByFacet] = useState<Record<string, string>>(
    {},
  );

  const commitValue = (nextValue: FilterValue) => {
    onChange(normalizeValue(nextValue));
  };

  const commitRangeValue = (facetId: string, nextValue: FilterRangeValue) => {
    const facet = facets.find((candidate) => candidate.id === facetId);
    if (!facet?.range) return;

    const safeValue = normalizeRangeValue(facet.range, nextValue);
    commitValue({
      ...value,
      [facet.id]: isFullRangeValue(facet.range, safeValue)
        ? []
        : [String(safeValue.min), String(safeValue.max)],
    });
  };

  const clearFacet = (facetId: string) => {
    const { [facetId]: _removed, ...nextValue } = value;
    commitValue(nextValue);
  };

  const handleClearFacet = (event: MouseEvent<HTMLButtonElement>) => {
    const { facetId } = event.currentTarget.dataset;
    if (facetId) clearFacet(facetId);
  };

  const handleToggleOption = (event: MouseEvent<HTMLButtonElement>) => {
    const { facetId, optionValue } = event.currentTarget.dataset;
    if (!facetId || !optionValue) return;

    const selected = new Set(value[facetId] ?? []);
    if (selected.has(optionValue)) {
      selected.delete(optionValue);
    } else {
      selected.add(optionValue);
    }

    commitValue({
      ...value,
      [facetId]: [...selected],
    });
  };

  const handleFacetSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { facetId } = event.currentTarget.dataset;
    if (!facetId) return;

    const nextQuery = event.currentTarget.value;
    setSearchByFacet((current) => ({
      ...current,
      [facetId]: nextQuery,
    }));
  };

  return (
    <div className={clsx("flex flex-col gap-4", className)} {...props}>
      {facets.map((facet) => {
        const selectedValues = value[facet.id] ?? [];
        const query = searchByFacet[facet.id]?.trim().toLowerCase() ?? "";
        const options = getDisplayOptions(facet, selectedValues, query);
        const hasScrollableOptions =
          facet.maxVisibleOptions !== undefined &&
          options.length > facet.maxVisibleOptions;
        const rangeValue = facet.range
          ? getRangeValue(facet.range, selectedValues)
          : undefined;

        return (
          <section key={facet.id} className="flex flex-col gap-2">
            <div className="flex min-h-8 items-center gap-2">
              <span className="text-[#7a643f]">
                {facet.icon ?? <FiPlus className="size-4" />}
              </span>
              <h3 className="min-w-0 flex-1 text-sm font-semibold text-[#4a3821]">
                {facet.label}
              </h3>
              {selectedValues.length > 0 && (
                <button
                  type="button"
                  data-facet-id={facet.id}
                  onClick={handleClearFacet}
                  className="btn btn-ghost btn-xs text-[#7a643f] hover:bg-[#e4d7bd] hover:text-[#2f261a]"
                >
                  Clear
                </button>
              )}
            </div>

            {facet.type === "range" &&
            facet.range &&
            rangeValue !== undefined ? (
              <RangeFilter
                facetId={facet.id}
                label={facet.label}
                range={facet.range}
                value={rangeValue}
                onCommit={commitRangeValue}
              />
            ) : (
              <>
                {searchable && facet.options.length > 6 && (
                  <label className="relative block">
                    <span className="sr-only">Search {facet.label}</span>
                    <FiSearch className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-(--color-primary)" />
                    <input
                      type="text"
                      data-facet-id={facet.id}
                      value={searchByFacet[facet.id] ?? ""}
                      onChange={handleFacetSearchChange}
                      placeholder={`Search ${facet.label.toLowerCase()}...`}
                      className="input input-sm input-bordered input-primary w-full bg-[#fbf4e6] pl-9 text-[#2f261a] placeholder:text-[#9b8357]"
                    />
                  </label>
                )}

                <div
                  role="listbox"
                  aria-label={facet.label}
                  className={clsx("flex flex-col gap-1", {
                    "max-h-[12.25rem] overflow-y-auto pr-1":
                      hasScrollableOptions,
                  })}
                >
                  {options.length > 0 ? (
                    options.map((option) => {
                      const isSelected = selectedValues.includes(option.value);

                      return (
                        <button
                          key={option.value}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          data-facet-id={facet.id}
                          data-option-value={option.value}
                          onClick={handleToggleOption}
                          style={getOptionBackgroundStyle(option, isSelected)}
                          className={clsx(
                            "flex min-h-9 w-full items-center gap-2 rounded border px-2.5 py-1.5 text-left text-sm transition-colors",
                            {
                              "border-(--color-primary) bg-(--color-primary) text-(--color-primary-content)":
                                isSelected,
                              "border-[#d2c097] bg-[#fbf4e6] text-[#4a3821] hover:border-[#b6965a] hover:bg-[#efe3c9] hover:text-[#2f261a]":
                                !isSelected,
                            },
                          )}
                        >
                          <span
                            className={clsx(
                              "flex size-4 shrink-0 items-center justify-center rounded border",
                              {
                                "border-(--color-primary-content) bg-(--color-primary-content) text-(--color-primary)":
                                  isSelected,
                                "border-[#b6965a]": !isSelected,
                              },
                            )}
                          >
                            {isSelected && <FiCheck className="size-3" />}
                          </span>
                          <span className="min-w-0 flex-1 truncate">
                            {option.label}
                          </span>
                          {showCounts && option.count !== undefined && (
                            <span
                              className={clsx(
                                "rounded border px-1.5 py-0.5 text-xs",
                                {
                                  "border-[color-mix(in_oklch,var(--color-primary-content)_35%,transparent)] bg-[color-mix(in_oklch,var(--color-primary-content)_18%,transparent)] text-(--color-primary-content)":
                                    isSelected,
                                  "border-transparent bg-[#eadbbe] text-[#6d5c3e]":
                                    !isSelected,
                                },
                              )}
                            >
                              {option.count}
                            </span>
                          )}
                        </button>
                      );
                    })
                  ) : (
                    <div className="rounded border border-dashed border-[#d2c097] px-3 py-4 text-center text-sm text-[#7a643f]">
                      No options available.
                    </div>
                  )}
                </div>
              </>
            )}
          </section>
        );
      })}
    </div>
  );
}
