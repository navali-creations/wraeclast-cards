import { useEffect, useState } from "react";
import { safeGetItem, safeSetItem } from "../../../../../lib/safeLocalStorage";
import type { TableViewMode } from "../CardDetailsDropRateTables";

const STORAGE_KEY = "wc:card-details:drop-rate-table-mode";

function isViewMode(value: string | null): value is TableViewMode {
  return value === "basic" || value === "advanced";
}

export function useDropRateViewMode() {
  const [viewMode, setViewMode] = useState<TableViewMode>("basic");

  useEffect(() => {
    const storedMode = safeGetItem(STORAGE_KEY);
    if (isViewMode(storedMode)) {
      setViewMode(storedMode);
    }
  }, []);

  const handleViewModeChange = (nextMode: TableViewMode) => {
    setViewMode(nextMode);
    safeSetItem(STORAGE_KEY, nextMode);
  };

  return [viewMode, handleViewModeChange] as const;
}
