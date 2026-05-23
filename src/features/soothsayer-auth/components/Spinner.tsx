import { MdAutorenew, MdClose } from "react-icons/md";
import type { SpinnerTone } from "../types";

interface SpinnerProps {
  tone?: SpinnerTone;
}

export function Spinner({ tone = "default" }: SpinnerProps) {
  if (tone === "error") {
    return (
      <div className="w-12 h-12 rounded-full border-2 border-error/40 text-error flex items-center justify-center">
        <MdClose className="w-5 h-5 text-current" />
      </div>
    );
  }
  return <MdAutorenew className="w-12 h-12 text-primary animate-spin" />;
}
