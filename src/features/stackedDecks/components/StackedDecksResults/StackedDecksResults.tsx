import { H2 } from "../../../../components/headings";
import { Text } from "../../../../components/text";

export function StackedDecksResults() {
  return (
    <section>
      <H2 className="text-(--wc-hero-accent) mb-3">Results Table</H2>
      <div className="border border-(--wc-border-dimmed) rounded-lg p-4 bg-(--wc-bg-dimmed) text-(--wc-text-dimmed)">
        <Text size="sm">Table data will be populated here</Text>
      </div>
    </section>
  );
}
