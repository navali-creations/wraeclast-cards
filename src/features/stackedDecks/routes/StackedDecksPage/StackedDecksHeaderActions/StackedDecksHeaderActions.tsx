import { HiArrowsRightLeft } from "react-icons/hi2";
import { ButtonInternalLink } from "../../../../../components/buttons";
import {
  StackedDecksFilters,
  VerifiedToggle,
  ViewToggle,
} from "../../../components";

export function StackedDecksHeaderActions() {
  return (
    <>
      <StackedDecksFilters />
      <div className="flex items-center gap-1 sm:gap-2 sm:justify-end">
        <ButtonInternalLink
          gameScoped
          to="/stacked-decks/compare/$comparisonView"
          params={{ comparisonView: "movers" }}
          variant="control"
          className="flex-1 justify-center px-1.5! text-xs! xs:px-2! xs:text-sm! sm:flex-none sm:px-5!"
        >
          <HiArrowsRightLeft aria-hidden="true" className="size-4 shrink-0" />
          Compare
        </ButtonInternalLink>
        <ViewToggle className="flex-1 justify-center px-1.5! text-xs! xs:px-2! xs:text-sm! sm:flex-none sm:px-5!" />
        <VerifiedToggle className="flex-1 justify-center px-1.5! text-xs! xs:px-2! xs:text-sm! sm:flex-none sm:px-5!" />
      </div>
    </>
  );
}
