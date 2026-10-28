import clsx from "clsx";
import type { HTMLAttributes, ReactNode } from "react";
import { FiInfo } from "react-icons/fi";

interface AlertProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  compact?: boolean;
  inverted?: boolean;
  title?: string;
}

export function Alert({
  children,
  className,
  compact = false,
  inverted = false,
  title,
  ...props
}: AlertProps) {
  return (
    <aside
      role="note"
      className={clsx(
        "flex items-start border",
        inverted
          ? "border-info/35 bg-info/10 text-(--wc-text-70)"
          : "border-info/30 bg-info/10 text-(--wc-text-dimmed)",
        compact
          ? "gap-2 rounded-md px-2.5 py-2"
          : "gap-3 rounded-lg px-3 py-3 sm:px-4",
        className,
      )}
      {...props}
    >
      <FiInfo
        aria-hidden="true"
        className={clsx(
          "shrink-0",
          inverted ? "text-info" : "text-info-content",
          compact ? "mt-0.5 size-3.5" : "mt-0.5 size-4",
        )}
      />
      <div className="min-w-0">
        {title && (
          <p
            className={clsx(
              "font-semibold",
              inverted ? "text-(--wc-text-90)" : "text-(--wc-card-name)",
              compact ? "text-xs" : "text-sm",
            )}
          >
            {title}
          </p>
        )}
        <div
          className={clsx(
            "leading-relaxed",
            compact ? "text-xs" : "text-sm",
            title && "mt-1",
          )}
        >
          {children}
        </div>
      </div>
    </aside>
  );
}
