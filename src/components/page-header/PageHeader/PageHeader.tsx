import type { ReactNode } from "react";
import { Heading } from "../../headings";
import { Text } from "../../text";

interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="border-b border-[color-mix(in_oklch,var(--wc-border)_65%,black)] bg-(--wc-header-bg) pt-5 pb-4 shadow-[inset_0_-16px_36px_-28px_black]">
      <div className="mx-auto grid w-full max-w-300 gap-3 px-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div className="min-w-0">
          <Heading
            as="h1"
            className="leading-none tracking-tight text-[color-mix(in_oklch,var(--wc-gold)_88%,white)] sm:text-5xl"
          >
            {title}
          </Heading>

          {subtitle && (
            <Text size="sm" className="mt-1 min-h-5 text-(--wc-text-70)">
              {subtitle}
            </Text>
          )}
        </div>

        {actions && (
          <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center lg:w-auto lg:shrink-0 lg:justify-end">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
