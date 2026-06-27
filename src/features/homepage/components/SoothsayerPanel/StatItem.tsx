import type { SoothsayerStat } from "../../types";

export function StatItem({ stat }: { stat: SoothsayerStat }) {
  const valueClass =
    stat.highlight === "negative"
      ? "text-base font-bold text-error"
      : stat.highlight === "positive"
        ? "text-base font-bold text-info"
        : "text-base font-bold text-(--wc-text-90)";

  return (
    <div className="flex flex-col items-center">
      <span className={valueClass}>{stat.value}</span>
      <span className="text-xs text-(--wc-text-50)">{stat.label}</span>
    </div>
  );
}
