import type { Table } from "@tanstack/react-table";
import { ToggleButton } from "./ToggleButton";

export interface SecondaryColumn {
  id: string;
  label: string;
}

interface ColumnVisibilityTogglesProps<TData> {
  table: Table<TData>;
  columns: readonly SecondaryColumn[];
}

export function ColumnVisibilityToggles<TData>({
  table,
  columns,
}: ColumnVisibilityTogglesProps<TData>) {
  function handleMobileColumnClick(id: string) {
    table.setColumnVisibility(
      Object.fromEntries(columns.map((c) => [c.id, c.id === id])),
    );
  }

  function handleTabletColumnClick(id: string) {
    table.getColumn(id)?.toggleVisibility();
  }

  return (
    <>
      {/* Mobile (≤424px): radio — one secondary column alongside Card Name */}
      <div className="flex xs:hidden border-b border-(--wc-border-dimmed) bg-(--wc-glow)">
        {columns.map(({ id, label }) => (
          <ToggleButton
            key={id}
            label={label}
            isActive={table.getColumn(id)?.getIsVisible() ?? false}
            onClick={() => handleMobileColumnClick(id)}
          />
        ))}
      </div>

      {/* Tablet (425px–767px): independent toggles */}
      <div className="hidden xs:flex md:hidden border-b border-(--wc-border-dimmed) bg-(--wc-glow)">
        {columns.map(({ id, label }) => (
          <ToggleButton
            key={id}
            label={label}
            isActive={table.getColumn(id)?.getIsVisible() ?? false}
            onClick={() => handleTabletColumnClick(id)}
          />
        ))}
      </div>
    </>
  );
}
