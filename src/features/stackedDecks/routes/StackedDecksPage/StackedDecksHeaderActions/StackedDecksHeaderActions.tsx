import {
  StackedDecksFilters,
  VerifiedToggle,
  ViewToggle,
} from "../../../components";

export function StackedDecksHeaderActions() {
  return (
    <>
      <StackedDecksFilters />
      <div className="flex items-center gap-2 sm:justify-end">
        <ViewToggle className="flex-1 justify-center sm:flex-none" />
        <VerifiedToggle className="flex-1 justify-center sm:flex-none" />
      </div>
    </>
  );
}
