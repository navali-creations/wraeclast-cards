import {
  CardDatabasePanel,
  DownloadsPanel,
  HeroSection,
  SoothsayerPanel,
  StackedDecksPanel,
} from "../components";

export function HomepagePage() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      {/* Left — hero */}
      <div className="lg:w-[38%] lg:sticky lg:top-24">
        <HeroSection />
      </div>

      {/* Right — feature panels */}
      <div className="flex flex-1 flex-col gap-4">
        <SoothsayerPanel />

        <div className="flex flex-col gap-4 md:flex-row md:items-stretch">
          {/* Card database (wider) */}
          <div className="md:w-[58%]">
            <CardDatabasePanel />
          </div>

          {/* Stacked Decks + Downloads (narrower, stacked) */}
          <div className="flex flex-col gap-4 md:flex-1">
            <StackedDecksPanel />
            <DownloadsPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
