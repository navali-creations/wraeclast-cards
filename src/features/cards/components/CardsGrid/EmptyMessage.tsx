import type { ReactNode } from "react";

export function EmptyMessage({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed border-(--wc-border)">
      <p className="text-sm text-(--wc-text-50)">{children}</p>
    </div>
  );
}
