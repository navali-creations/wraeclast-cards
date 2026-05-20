import clsx from "clsx";

const baseClass = "rounded-2xl p-8 text-center shadow-2xl";

const toneClasses = {
  normal: "border border-base-content/10 bg-base-200",
  error: "border border-error/30 bg-error/15",
  warning: "border border-warning/30 bg-warning/15",
} as const;

type CardTone = keyof typeof toneClasses;

interface CardProps {
  tone?: CardTone;
  children: React.ReactNode;
}

export function Card({ tone = "normal", children }: CardProps) {
  return <div className={clsx(baseClass, toneClasses[tone])}>{children}</div>;
}
