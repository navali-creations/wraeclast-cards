import clsx from "clsx";
import { FiDownload } from "react-icons/fi";
import { ButtonInternalLink } from "../../../../components/buttons/ButtonLink";
import { Heading } from "../../../../components/headings";
import { Text } from "../../../../components/text";
import { soothsayerStats } from "../../api/homepageStats";
import { StatItem } from "./StatItem";

export function SoothsayerPanel() {
  const statItems = soothsayerStats.map((stat) => (
    <StatItem key={stat.label} stat={stat} />
  ));

  const downloadButtonClassName =
    "flex items-center gap-2 rounded-lg border border-(--wc-accent-border) bg-(--wc-glow) px-4 py-2 text-sm font-medium text-(--wc-text-90) transition-colors hover:brightness-110";

  return (
    <div className="rounded-xl border border-(--wc-border) bg-base-300 px-5 py-8">
      <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-6">
        {/* Left: label + title + description + CTA */}
        <div className="flex flex-col gap-3 xs:flex-1">
          <div className="flex flex-col gap-1">
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
            <Text size="sm" className="max-w-xs text-(--wc-text-60)">
              Track sessions, measure profit, and export CSV. Supports PoE 1 &
              2.
            </Text>
          </div>
          <div className="flex gap-5 xs:hidden">{statItems}</div>
          <div className="mt-2 flex justify-between">
            <ButtonInternalLink
              to="/soothsayer"
              className="rounded-lg px-4 py-1.5 text-sm font-medium bg-primary text-primary-content hover:bg-(--wc-primary-hover)"
            >
              Try the demo →
            </ButtonInternalLink>
            <ButtonInternalLink
              to="/downloads"
              className={clsx("xs:hidden", downloadButtonClassName)}
            >
              <FiDownload aria-hidden="true" />
              Download App
            </ButtonInternalLink>
          </div>
        </div>

        {/* Right: stats top + download bottom */}
        <div className="hidden xs:flex shrink-0 flex-col items-end justify-between self-stretch">
          <div className="flex gap-5">{statItems}</div>

          <ButtonInternalLink
            to="/downloads"
            className={downloadButtonClassName}
          >
            <FiDownload aria-hidden="true" />
            Download App
          </ButtonInternalLink>
        </div>
      </div>
    </div>
  );
}
