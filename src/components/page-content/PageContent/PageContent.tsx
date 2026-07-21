import type { Variants } from "motion/react";
import * as m from "motion/react-m";
import type { ReactNode } from "react";

interface PageContentProps {
  children: ReactNode;
}

const contentVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export function PageContent({ children }: PageContentProps) {
  return (
    <div className="mt-3 flex min-h-0 flex-1 flex-col bg-primary-content">
      <m.div
        className="flex min-h-0 flex-1 flex-col"
        variants={contentVariants}
      >
        {children}
      </m.div>
    </div>
  );
}
