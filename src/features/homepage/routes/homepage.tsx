import {
  CardDatabasePanel,
  // DownloadsPanel,
  HeroSection,
  SoothsayerPanel,
  StackedDecksPanel,
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
        <div className="order-2 lg:order-1">
          <SoothsayerPanel />
        </div>

        <div className="order-1 grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,58%)_minmax(0,1fr)] lg:order-2">
          {/* Card database (wider) */}
          <div>
            <CardDatabasePanel />
          </div>

          {/* Stacked Decks + Downloads (narrower, stacked) */}
          <div className="flex flex-col gap-4">
            <StackedDecksPanel />
            {/*<DownloadsPanel />*/}
          </div>
        </div>
      </div>
    </div>
  );
}
