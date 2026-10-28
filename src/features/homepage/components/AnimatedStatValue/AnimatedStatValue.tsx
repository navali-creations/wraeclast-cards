import { animate } from "motion";
import { useEffect, useRef } from "react";
import { formatHomepageNumber } from "../../api/homepageStats";

interface AnimatedStatValueProps {
  unavailable: boolean;
  value: number | undefined;
}

export function AnimatedStatValue({
  unavailable,
  value,
}: AnimatedStatValueProps) {
  const valueRef = useRef<HTMLSpanElement>(null);
  const displayedValue = unavailable ? "N/A" : formatHomepageNumber(value);

  useEffect(() => {
    const valueElement = valueRef.current;
    if (!valueElement || unavailable || value === undefined) return;

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      valueElement.textContent = formatHomepageNumber(value);
      return;
    }

    valueElement.textContent = formatHomepageNumber(0);
    const controls = animate(0, value, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        valueElement.textContent = formatHomepageNumber(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [unavailable, value]);

  return (
    <span className="grid min-w-[5ch] font-fontin text-2xl font-bold text-(--wc-gold) tabular-nums">
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {displayedValue}
      </span>
      <span
        ref={valueRef}
        data-animated-stat-value
        className="col-start-1 row-start-1"
      >
        {displayedValue}
      </span>
    </span>
  );
}
