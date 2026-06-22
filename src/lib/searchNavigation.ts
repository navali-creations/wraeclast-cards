import type { NavigateOptions } from "@tanstack/react-router";

export function createSearchUpdater<TSearch extends Record<string, unknown>>(
  navigate: (options: NavigateOptions) => void,
) {
  return (update: Partial<TSearch>) => {
    navigate({
      search: (prev) => ({ ...(prev as TSearch), ...update }),
    });
  };
}
