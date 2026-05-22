import { MdCheckCircle } from "react-icons/md";
import { ButtonExternalLink } from "../buttons";
import { AuthCard } from "./AuthCard";

interface SuccessCardProps {
  deepLink: string;
}

export function SuccessCard({ deepLink }: SuccessCardProps) {
  return (
    <AuthCard
      tone="default"
      icon={<MdCheckCircle className="h-12 w-12 text-success" />}
      title="Authorization successful!"
      description="Opening Soothsayer..."
      actions={
        <ButtonExternalLink variant="subtle" className="mb-4" href={deepLink}>
          Open Soothsayer manually
        </ButtonExternalLink>
      }
      showFootnote
    />
  );
}
