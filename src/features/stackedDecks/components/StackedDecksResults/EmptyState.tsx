import type { ReactNode } from "react";
import { Text } from "../../../../components/text";

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed border-(--wc-border)">
      <Text size="sm" muted>
        {children}
      </Text>
    </div>
  );
}
