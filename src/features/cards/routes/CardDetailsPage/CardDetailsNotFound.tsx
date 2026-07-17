import { HiArrowLeft } from "react-icons/hi2";
import { ButtonInternalLink } from "../../../../components/buttons";
import { Text } from "../../../../components/text";

export function CardDetailsNotFound() {
  return (
    <div className="flex min-h-96 flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-(--wc-border) text-center">
      <Text size="sm" className="text-(--wc-text-50)">
        We couldn't find a card with that name.
      </Text>
      <ButtonInternalLink gameScoped to="/cards" variant="control">
        <HiArrowLeft aria-hidden="true" />
        Back to cards
      </ButtonInternalLink>
    </div>
  );
}
