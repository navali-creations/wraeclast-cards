import type { ReactNode } from "react";
import { Text } from "../../../../../components/text";

export function DetailItem({
  icon,
  label,
  value,
  hint,
  highlight,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint?: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex min-h-28 gap-3 border-t border-(--wc-border-dimmed) p-4 sm:p-5 sm:nth-[2n]:border-l">
      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center text-(--wc-hero-accent)">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <Text
          size="xs"
          uppercase
          className="tracking-[0.14em] text-(--wc-text-50)"
        >
          {label}
        </Text>
        <Text
          size={highlight ? "xl" : "lg"}
          weight="semibold"
          className="mt-2 wrap-break-word leading-tight text-(--wc-live-color)"
        >
          {value}
        </Text>
        {hint && (
          <Text
            size="xs"
            className="mt-2 max-w-68 leading-relaxed text-(--wc-text-50)"
          >
            {hint}
          </Text>
        )}
      </div>
    </div>
  );
}
