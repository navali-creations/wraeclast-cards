import { Text } from "../../../../../../components/text";

export function SummaryTile({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-(--wc-border-dimmed) bg-(--wc-table-even) p-3">
      <Text
        uppercase
        className="text-[11px] tracking-widest text-(--wc-text-dimmed)"
      >
        {label}
      </Text>
      <Text
        size="sm"
        weight="semibold"
        className="mt-1.5 text-(--wc-card-name)"
      >
        {value}
      </Text>
    </div>
  );
}
