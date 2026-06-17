import { Text } from "../../../../components/text";

export function Methodology() {
  return (
    <section className="rounded-lg border border-(--wc-gold-dim)/36 bg-(--color-base-content)/70 px-4 py-3.5">
      <Text size="sm" className="leading-6 text-(--wc-text-30)">
        <Text as="span" weight="semibold">
          Methodology:
        </Text>{" "}
        Drop rates are observed from real stacked deck openings captured by
        Soothsayer. Weight data sourced from the{" "}
        <a
          href="https://docs.google.com/spreadsheets/d/1PmGES_e1on6K7O5ghHuoorEjruAVb7dQ5m7PGrW7t80/edit?gid=272334906#gid=272334906"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-(--color-primary) hover:underline"
        >
          Prohibited Library
        </a>{" "}
        spreadsheet by{" "}
        <Text as="span" weight="semibold" className="text-(--color-primary)">
          @nerdyjoe
        </Text>
        . Rates may vary across leagues.
      </Text>
    </section>
  );
}
