import { HiChevronDown } from "react-icons/hi2";
import { Text } from "../../../../components/text";
import "./Methodology.css";

function MethodologyText({ includeLabel = false }: { includeLabel?: boolean }) {
  return (
    <Text size="sm" className="leading-6 text-(--wc-text-30)">
      {includeLabel && (
        <>
          <Text as="span" weight="semibold">
            Methodology:
          </Text>{" "}
        </>
      )}
      Observed rates come from Soothsayer uploads. Community estimates use Rain
      of Chaos as their anchor.
      <br />
      The{" "}
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
  );
}

export function Methodology() {
  return (
    <>
      <details className="wc-methodology-compact rounded-lg border border-(--wc-border-dimmed) bg-(--wc-bg-dimmed)">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-sm font-semibold text-(--wc-text-30) select-none marker:content-none">
          <span>Methodology</span>
          <HiChevronDown
            aria-hidden="true"
            className="wc-methodology-chevron size-4 shrink-0 transition-transform duration-150"
          />
        </summary>
        <div className="px-4 pt-1 pb-3.5">
          <MethodologyText />
        </div>
      </details>

      <section className="wc-methodology-expanded rounded-lg border border-(--wc-border-dimmed) bg-(--wc-bg-dimmed) px-4 py-3.5">
        <MethodologyText includeLabel />
      </section>
    </>
  );
}
