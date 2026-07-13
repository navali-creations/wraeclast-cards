import { Text } from "../../../../components/text";

export function Methodology() {
  return (
    <section className="rounded-lg border border-(--wc-border-dimmed) bg-(--wc-bg-dimmed) px-4 py-3.5">
      <Text size="sm" className="leading-6 text-(--wc-text-30)">
        <Text as="span" weight="semibold">
          Methodology:
        </Text>{" "}
        Observed rates come from Soothsayer uploads. Community estimates use
        Rain of Chaos as their anchor. The{" "}
        <a
          href="https://docs.google.com/spreadsheets/d/1PmGES_e1on6K7O5ghHuoorEjruAVb7dQ5m7PGrW7t80/edit?gid=272334906#gid=272334906"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-(--color-primary) hover:underline"
        >
          Prohibited Library
        </a>{" "}
        average-weight formula documented by{" "}
        <Text as="span" weight="semibold" className="text-(--color-primary)">
          @nerdyjoe
        </Text>{" "}
        provides the reference model; its published weight values are not
        imported. Rates may vary by league.
      </Text>
    </section>
  );
}
