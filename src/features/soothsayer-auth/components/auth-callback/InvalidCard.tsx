import { MdWarningAmber } from "react-icons/md";
import { AuthCard } from "./AuthCard";

export function InvalidCard() {
  return (
    <AuthCard
      tone="warning"
      icon={<MdWarningAmber className="h-12 w-12 text-warning" />}
      title="Invalid authorization callback"
      description="Missing required parameters. This link may be expired or malformed."
      showFootnote={false}
    />
  );
}
