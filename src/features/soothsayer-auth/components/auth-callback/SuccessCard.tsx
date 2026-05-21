import { MdCheckCircle } from "react-icons/md";
import { Button } from "../Button";
import { AuthCard } from "./AuthCard";

interface SuccessCardProps {
  onManualOpen: () => void;
}

export function SuccessCard({ onManualOpen }: SuccessCardProps) {
  return (
    <AuthCard
      tone="default"
      icon={<MdCheckCircle className="h-12 w-12 text-success" />}
      title="Authorization successful!"
      description="Opening Soothsayer..."
      actions={
        <Button variant="subtle" className="mb-4" onClick={onManualOpen}>
          Open Soothsayer manually
        </Button>
      }
      showFootnote
    />
  );
}
