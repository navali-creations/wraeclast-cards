import { HiArrowLeft } from "react-icons/hi2";
import { ButtonInternalLink } from "../../../../../components/buttons";

export function CardDetailsPageActions() {
  return (
    <ButtonInternalLink
      gameScoped
      to="/cards"
      variant="control"
      className="mt-1 whitespace-nowrap lg:mt-2"
    >
      <HiArrowLeft aria-hidden="true" />
      Back to cards
    </ButtonInternalLink>
  );
}
