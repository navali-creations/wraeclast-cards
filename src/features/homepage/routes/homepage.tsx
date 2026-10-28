import type { Variants } from "motion/react";
import * as m from "motion/react-m";
import {
  FeaturedCardsCarousel,
  HeroSection,
  SoothsayerPanel,
} from "../components";

const panelGroupVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.08,
      staggerChildren: 0.14,
    },
  },
};

const panelVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function HomepagePage() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      {/* Left — hero */}
      <div className="lg:sticky lg:top-24 lg:w-[38%]">
        <HeroSection />
      </div>

      {/* Right — feature panels */}
      <m.div
        className="flex flex-1 flex-col gap-4"
        variants={panelGroupVariants}
      >
        <m.div variants={panelVariants}>
          <SoothsayerPanel />
        </m.div>

        <m.div variants={panelVariants}>
          <FeaturedCardsCarousel />
        </m.div>
      </m.div>
    </div>
  );
}
