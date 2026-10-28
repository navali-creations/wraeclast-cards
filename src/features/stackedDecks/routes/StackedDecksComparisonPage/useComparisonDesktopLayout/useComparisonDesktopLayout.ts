import { useSyncExternalStore } from "react";

const DESKTOP_COMPARISON_QUERY = "(min-width: 960px)";

function subscribe(handleChange: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};

  const mediaQuery = window.matchMedia(DESKTOP_COMPARISON_QUERY);
  mediaQuery.addEventListener("change", handleChange);

  return () => mediaQuery.removeEventListener("change", handleChange);
}

function getSnapshot() {
  if (typeof window === "undefined" || !window.matchMedia) return true;
  return window.matchMedia(DESKTOP_COMPARISON_QUERY).matches;
}

function getServerSnapshot() {
  return true;
}

export function useComparisonDesktopLayout() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
