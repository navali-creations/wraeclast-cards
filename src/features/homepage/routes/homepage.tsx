import {
  FeaturedCardsCarousel,
  HeroSection,
  SoothsayerPanel,
} from "../components";

export function HomepagePage() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      {/* Left — hero */}
      <div className="lg:sticky lg:top-24 lg:w-[38%]">
        <HeroSection />
      </div>

      {/* Right — feature panels */}
      <div className="flex flex-1 flex-col gap-4">
        <div>
          <SoothsayerPanel />
        </div>

        <div>
          <FeaturedCardsCarousel />
        </div>
      </div>
    </div>
  );
}
