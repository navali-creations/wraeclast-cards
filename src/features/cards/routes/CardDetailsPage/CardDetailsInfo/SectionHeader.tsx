import type { ReactNode } from "react";
import { Text } from "../../../../../components/text";

export function SectionHeader({
  title,
  description,
  aside,
}: {
  title: string;
  description: string;
  aside?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-4 sm:px-5">
      <div>
        <Text
          as="h2"
          size="sm"
          weight="semibold"
          className="text-(--wc-card-name)"
        >
          {title}
        </Text>
        <Text size="xs" className="mt-1 text-(--wc-text-50)">
          {description}
        </Text>
      </div>
      {aside && <div className="shrink-0 pt-0.5">{aside}</div>}
    </div>
  );
}
