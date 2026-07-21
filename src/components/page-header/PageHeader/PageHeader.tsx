import type { Variants } from "motion/react";
import * as m from "motion/react-m";
import type { ReactNode } from "react";
import { Heading } from "../../headings";
import { Text } from "../../text";

interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
}

const headerTitleVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const headerActionsVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="border-b border-(--wc-border-strong) bg-(--wc-header-bg) pt-5 pb-4 shadow-[inset_0_-16px_36px_-28px_black]">
      <div className="mx-auto grid w-full max-w-300 gap-3 px-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <m.div className="min-w-0" variants={headerTitleVariants}>
          <Heading
            as="h1"
            className="leading-none tracking-tight text-(--wc-gold-header) sm:text-5xl"
          >
            {title}
          </Heading>

          {subtitle && (
            <Text size="sm" className="mt-1 min-h-5 text-(--wc-text-70)">
              {subtitle}
            </Text>
          )}
        </m.div>

        {actions && (
          <m.div
            className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center lg:w-auto lg:shrink-0 lg:justify-end"
            variants={headerActionsVariants}
          >
            {actions}
          </m.div>
        )}
      </div>
    </div>
  );
}
