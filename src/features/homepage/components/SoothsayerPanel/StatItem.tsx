import type { SoothsayerStat } from "../../types";

export function StatItem({ stat }: { stat: SoothsayerStat }) {
  const valueClass =
    stat.highlight === "negative"
      ? "stat-value text-error"
      : stat.highlight === "positive"
        ? "stat-value text-info"
        : "stat-value";

  return (
    <div className="stat place-items-center">
      <div className={valueClass}>{stat.value}</div>
      <div className="stat-desc">{stat.label}</div>
    </div>
  );
}
