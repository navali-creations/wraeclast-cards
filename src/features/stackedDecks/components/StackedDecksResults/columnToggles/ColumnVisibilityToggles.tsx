import type { Table } from "@tanstack/react-table";
import { clsx } from "clsx";
import { Button } from "../../../../../components/buttons";
import type { StackedDecksRow } from "../../../hooks";

const MOBILE_COLUMNS = [
  { id: "ratio", label: "Drop Rate" },
  { id: "count", label: "Observations" },
  { id: "weight", label: "Weight" },
] as const;

const TABLET_COLUMNS = [
  { id: "count", label: "Observations" },
  { id: "ratio", label: "Drop Rate" },
  { id: "weight", label: "Weight" },
] as const;

const BASE =
  "flex flex-1 items-center justify-center py-2.5 !text-xs border-r border-(--wc-border-dimmed) last:border-r-0";
const ACTIVE = "bg-(--wc-hero-accent)/20 text-(--wc-gold) font-semibold";
const INACTIVE =
  "text-(--wc-text-50) hover:bg-white/5 hover:text-(--wc-text-70)";

function ToggleButton({
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

interface ColumnVisibilityTogglesProps {
  table: Table<StackedDecksRow>;
}

export function ColumnVisibilityToggles({
  table,
}: ColumnVisibilityTogglesProps) {
  return (
    <>
      {/* Mobile (≤424px): radio — one secondary column alongside Card Name */}
      <div className="flex xs:hidden border-b border-(--wc-border-dimmed) bg-(--wc-glow)">
        {MOBILE_COLUMNS.map(({ id, label }) => (
          <ToggleButton
            key={id}
            label={label}
            isActive={table.getColumn(id)?.getIsVisible() ?? false}
            onClick={() =>
              table.setColumnVisibility({
                count: id === "count",
                ratio: id === "ratio",
                weight: id === "weight",
              })
            }
          />
        ))}
      </div>

      {/* Tablet (425px–767px): independent toggles */}
      <div className="hidden xs:flex md:hidden border-b border-(--wc-border-dimmed) bg-(--wc-glow)">
        {TABLET_COLUMNS.map(({ id, label }) => {
          const column = table.getColumn(id);
          if (!column) return null;
          return (
            <ToggleButton
              key={id}
              label={label}
              isActive={column.getIsVisible()}
              onClick={() => column.toggleVisibility()}
            />
          );
        })}
      </div>
    </>
  );
}
