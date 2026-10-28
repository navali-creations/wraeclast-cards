import type { ReactNode } from "react";

export function StatusMessage({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-(--wc-border-dimmed) bg-(--wc-bg-dimmed) p-4 text-sm text-(--wc-text-60)">
      {children}
    </div>
  );
}
