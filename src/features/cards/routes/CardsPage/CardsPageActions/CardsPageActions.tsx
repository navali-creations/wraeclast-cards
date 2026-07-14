import { useState } from "react";
import { FiSliders } from "react-icons/fi";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { Button } from "../../../../../components/buttons";
import { Drawer } from "../../../../../components/Drawer/Drawer";
import { SearchInput } from "../../../../../components/input";
import { SegmentedControl } from "../../../../../components/SegmentedControl/SegmentedControl";
import { FilterBar } from "../../../components/CardsFilters/FilterBar/FilterBar";
import { useCardsPageControlsContext } from "../CardsPageControlsContext";
import { SortChips } from "../SortChips";

export function CardsPageActions() {
  const {
    activeDesc,
    activeSortLabel,
    filterFacets,
    filterValue,
    onClearControls,
    onFilterValueChange,
    onSearchChange,
    searchTerm,
    sortLabels,
    suggestions,
  } = useCardsPageControlsContext();
  const [open, setOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState("filters");
  const selectedFilterCount = Object.values(filterValue).reduce(
    (total, selected) => total + (selected.length > 0 ? 1 : 0),
    0,
  );
  const hasSortOverride = activeSortLabel !== sortLabels[0] || activeDesc;
  const activeControlCount = selectedFilterCount + (hasSortOverride ? 1 : 0);
  const handleOpenDrawer = () => setOpen(true);
  const handleClearControls = () => onClearControls();

  return (
    <>
      <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center lg:w-auto">
        <SearchInput
          value={searchTerm}
          onChange={onSearchChange}
          suggestions={suggestions}
          placeholder="Search cards or rewards..."
          leftIcon={<HiMagnifyingGlass className="size-4" />}
          containerClassName="w-full sm:min-w-72 sm:max-w-sm"
        />

        <Button
          variant={activeControlCount > 0 ? "controlActive" : "control"}
          onClick={handleOpenDrawer}
          className="h-10 justify-center whitespace-nowrap"
        >
          <FiSliders className="size-4 shrink-0" />
          Filters
          {activeControlCount > 0 && (
            <span className="ml-1 rounded bg-black/20 px-1.5 py-0.5 text-xs">
              {activeControlCount}
            </span>
          )}
        </Button>
      </div>

      <Drawer
        open={open}
        onOpenChange={setOpen}
        title="Card Controls"
        headerActions={
          activeControlCount > 0 ? (
            <button
              type="button"
              onClick={handleClearControls}
              className="btn btn-primary btn-sm whitespace-nowrap normal-case"
            >
              Clear all
            </button>
          ) : undefined
        }
      >
        <div className="flex flex-col gap-4">
          <SegmentedControl
            value={drawerTab}
            size="sm"
            className="[--segmented-active-bg:var(--color-primary)] [--segmented-active-text:var(--color-primary-content)] [--segmented-bg:#dfd1b5] [--segmented-border:#c9b992] [--segmented-inactive-text:#6b5434]"
            onChange={setDrawerTab}
            options={[
              { label: "Filters", value: "filters" },
              { label: "Sort", value: "sort" },
            ]}
          />

          {drawerTab === "filters" ? (
            <FilterBar
              facets={filterFacets}
              value={filterValue}
              onChange={onFilterValueChange}
              className="w-full"
            />
          ) : (
            <SortChips />
          )}
        </div>
      </Drawer>
    </>
  );
}
