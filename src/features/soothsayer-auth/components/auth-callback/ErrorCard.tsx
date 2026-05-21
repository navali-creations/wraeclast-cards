import { Button } from "../Button";
import { Spinner } from "../Spinner";
import { AuthCard } from "./AuthCard";

interface ErrorCardProps {
  description?: string;
  onManualOpen: () => void;
  onDownload: () => void;
}

export function ErrorCard({
  description,
  onManualOpen,
  onDownload,
}: ErrorCardProps) {
  return (
    <AuthCard
      tone="error"
      icon={<Spinner tone="error" />}
      title="Couldn't open Soothsayer"
      description={
        description ??
        "The app may not be installed, or the protocol handler isn't registered. Download Soothsayer and try again."
      }
      actions={
        <>
          <Button variant="error" onClick={onManualOpen}>
            Try again
          </Button>
          <Button variant="subtle" onClick={onDownload}>
            Download Soothsayer -&gt;
          </Button>
        </>
      }
      showFootnote
    />
  );
}
