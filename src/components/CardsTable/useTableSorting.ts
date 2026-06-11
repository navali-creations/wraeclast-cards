import type { OnChangeFn, SortingState } from "@tanstack/react-table";
import { useState } from "react";

export function useTableSorting(
  controlled: SortingState | undefined,
  onChange: ((sorting: SortingState) => void) | undefined,
): [SortingState, OnChangeFn<SortingState>] {
  const [internal, setInternal] = useState<SortingState>([
    { id: "name", desc: false },
  ]);

  const sorting = controlled ?? internal;

  const handleChange: OnChangeFn<SortingState> = (updater) => {
    const next = typeof updater === "function" ? updater(sorting) : updater;
    if (controlled !== undefined) {
      onChange?.(next);
    } else {
      setInternal(next);
    }
  };

  return [sorting, handleChange];
}
