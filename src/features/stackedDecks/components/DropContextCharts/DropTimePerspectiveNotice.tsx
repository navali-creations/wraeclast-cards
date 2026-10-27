import { Alert } from "../../../../components/Alert/Alert";

export function DropTimePerspectiveNotice() {
  return (
    <Alert compact inverted className="mb-2.5">
      The paired bars compare when this card was reported with when every
      reported card that includes time data was reported.
      <span className="mt-2 block">
        They show reporting patterns, not that time changes drop chance.
      </span>
    </Alert>
  );
}
