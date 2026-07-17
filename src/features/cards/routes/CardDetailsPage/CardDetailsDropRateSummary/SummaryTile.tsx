import { Text } from "../../../../../components/text";

export function SummaryTile({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-(--wc-border-dimmed) bg-(--wc-table-even) p-3">
      <Text uppercase muted className="text-[11px] tracking-widest">
        {label}
      </Text>
      <Text size="sm" weight="semibold" className="mt-1.5 text-(--wc-text-20)">
        {value}
      </Text>
    </div>
  );
}
