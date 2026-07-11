export function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    // ignore storage errors (e.g. Safari private mode, blocked iframe)
    return null;
  }
}

export function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore storage errors (e.g. Safari private mode, blocked iframe)
  }
}
