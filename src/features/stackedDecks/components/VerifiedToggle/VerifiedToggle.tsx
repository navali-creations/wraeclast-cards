import { clsx } from "clsx";
import { FiCheckCircle } from "react-icons/fi";
import { Button } from "../../../../components/buttons";

interface VerifiedToggleProps {
  verified: boolean;
  onChange: (verified: boolean) => void;
}

export function VerifiedToggle({ verified, onChange }: VerifiedToggleProps) {
  return (
    <Button
      onClick={() => onChange(!verified)}
      className={clsx(
        "flex h-9 cursor-pointer items-center gap-1.5 rounded border px-3 font-medium duration-150 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--wc-gold)",
        verified
          ? "border-(--wc-hero-accent) bg-(--wc-glow) text-(--wc-gold)"
          : "border-(--wc-border) bg-(--wc-glow)/80 text-(--wc-text-70) hover:border-(--wc-accent-border) hover:bg-(--wc-primary-hover) hover:text-(--wc-text-90)",
      )}
    >
      <FiCheckCircle className="size-4 shrink-0 transition-colors duration-150" />
      Verified
    </Button>
  );
}
