import { Heading } from "../../../../components/headings";
import { Text } from "../../../../components/text";

export function StackedDecksResults() {
  return (
    <section>
      <Heading className="text-(--wc-hero-accent) mb-3">Results Table</Heading>
      <div className="border border-(--wc-gold-dim)/36 rounded-lg p-4 bg-(--color-base-content)/70 text-(--wc-text-30)">
        <Text size="sm">Table data will be populated here</Text>
      </div>
    </section>
  );
}
