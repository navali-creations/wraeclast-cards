import { HiArrowLeft } from "react-icons/hi2";
import { ButtonInternalLink } from "../../../../../components/buttons";

export function CardDetailsPageActions() {
  return (
    <ButtonInternalLink
      gameScoped
      to="/cards"
      variant="control"
      className="whitespace-nowrap"
    >
      <HiArrowLeft aria-hidden="true" />
      Back to cards
    </ButtonInternalLink>
  );
}
