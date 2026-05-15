import clsx from "clsx";
import { MdAutorenew, MdClose } from "react-icons/md";

interface SpinnerProps {
  failed?: boolean;
  tone?: "neutral" | "error";
}

export function Spinner({ failed = false, tone = "neutral" }: SpinnerProps) {
  const failedContainerClass = clsx(
    "w-12 h-12 rounded-full border-2 flex items-center justify-center",
    tone === "error"
      ? "border-error/40 text-error"
      : "border-base-content/30 text-(--wc-text-60)",
  );

  return (
    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-5">
      {failed ? (
        <div className={failedContainerClass}>
          <MdClose className="w-5 h-5 text-current" />
        </div>
      ) : (
        <MdAutorenew className="w-12 h-12 text-primary animate-spin" />
      )}
    </div>
  );
}
