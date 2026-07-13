import { FiArrowRight } from "react-icons/fi";
import { ButtonInternalLink } from "../../../../components/buttons/ButtonLink";
import { Heading } from "../../../../components/headings";
import { Text } from "../../../../components/text";

export function SoothsayerPanel() {
  return (
    <div className="overflow-hidden rounded-xl border border-(--wc-border) bg-base-300 p-5">
      <div className="grid gap-5 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-center">
        <div className="flex flex-col gap-1 md:col-start-1 md:row-start-1">
          <Text
            size="xs"
            weight="semibold"
            uppercase
            className="tracking-wider text-info"
          >
            Soothsayer Desktop App
          </Text>
          <Heading as="h2" size="xl" className="text-(--wc-text-90)">
            Real-time stacked deck tracker
          </Heading>
          <Text size="sm" className="max-w-sm text-(--wc-text-60)">
            Track sessions, measure profit, and see all your stats.
          </Text>
        </div>

        <img
          src="/images/soothsayer/stats.webp"
          alt="Soothsayer statistics screen with stacked deck session charts and summary metrics."
          className="w-full rounded-lg border border-(--wc-border) object-cover md:col-start-2 md:row-span-2 md:row-start-1"
        />

        <ButtonInternalLink
          to="/soothsayer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-(--wc-accent-border) bg-(--wc-glow) px-4 py-2 text-center text-sm font-medium text-(--wc-text-90) transition-colors hover:brightness-110 md:col-start-1 md:row-start-2 md:self-end"
        >
          Learn more
          <FiArrowRight aria-hidden="true" />
        </ButtonInternalLink>
      </div>
    </div>
  );
}
