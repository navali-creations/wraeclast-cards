import { clsx } from "clsx";
import { Button } from "../buttons";

const BASE =
  "flex flex-1 items-center justify-center py-2.5 !text-xs border-r border-(--wc-border-dimmed) last:border-r-0";
const ACTIVE = "bg-(--wc-hero-accent)/20 text-(--wc-gold) font-semibold";
const INACTIVE =
  "text-(--wc-text-50) hover:bg-white/5 hover:text-(--wc-text-70)";

export function ToggleButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      className={clsx(BASE, isActive ? ACTIVE : INACTIVE)}
    >
      {label}
    </Button>
  );
}
