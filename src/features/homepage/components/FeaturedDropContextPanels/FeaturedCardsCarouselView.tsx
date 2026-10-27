import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { Carousel } from "../../../../components/arc/carousel/Carousel";
import { ButtonInternalLink } from "../../../../components/buttons/ButtonLink";
import { Heading } from "../../../../components/headings";
import { Text } from "../../../../components/text";
import { FeaturedCardSlide } from "./FeaturedCardSlide";
import type { FeaturedCardCarouselEntry } from "./types";

export function FeaturedCardsCarouselView({
  entries,
  error,
  isLoading,
}: {
  entries: FeaturedCardCarouselEntry[];
  error?: unknown;
  isLoading: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(1);

  let content: React.ReactNode;
  if (isLoading) {
    content = (
      <div className="grid min-h-100 gap-5 rounded-xl border border-(--wc-border) bg-(--wc-card-darker) p-5 sm:grid-cols-[9rem_minmax(0,1fr)]">
        <div className="wc-card-shimmer mx-auto h-52 w-36 rounded-sm" />
        <div className="space-y-4">
          <div className="wc-card-shimmer h-7 w-2/3 rounded" />
          <div className="wc-card-shimmer h-5 w-full rounded" />
          <div className="wc-card-shimmer h-16 w-full rounded" />
          <div className="wc-card-shimmer h-28 w-full rounded" />
        </div>
      </div>
    );
  } else if (error) {
    content = (
      <Text size="sm" className="py-12 text-center text-(--wc-text-50)">
        Featured card insights are unavailable.
      </Text>
    );
  } else if (entries.length === 0) {
    content = (
      <Text size="sm" className="py-12 text-center text-(--wc-text-50)">
        No featured cards are available for this league.
      </Text>
    );
  } else {
    content = (
      <Carousel
        label="Featured divination card insights"
        index={activeIndex}
        onIndexChange={setActiveIndex}
        slideSize="min(66cqw, 36rem)"
        interval={8000}
        autoplay
        smallScreenFadeOnly
        slideLabel={(index) => entries[index]?.card.name ?? `Card ${index + 1}`}
      >
        {entries.map((entry) => (
          <FeaturedCardSlide key={entry.card.id} entry={entry} />
        ))}
      </Carousel>
    );
  }

  return (
    <section className="rounded-xl bg-base-300 p-5">
      <div className="mb-5 flex flex-col gap-1">
        <Text
          size="xs"
          weight="semibold"
          uppercase
          className="tracking-wider text-info"
        >
          Featured cards
        </Text>
        <Heading as="h2" size="xl" className="text-(--wc-text-90)">
          Stacked Deck insights
        </Heading>
        <Text size="sm" className="text-(--wc-text-60)">
          Compare when drops were reported and how observed rates vary by
          opening location for featured cards in this league.
        </Text>
      </div>

      {content}

      <div className="mt-5 grid gap-5 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <ButtonInternalLink
          gameScoped
          to="/stacked-decks"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-(--wc-accent-border) bg-(--wc-glow) px-4 py-2 text-center text-sm font-medium text-(--wc-text-90) transition-colors hover:brightness-110 md:col-start-1"
        >
          View all drop rates
          <FiArrowRight aria-hidden="true" />
        </ButtonInternalLink>
      </div>
    </section>
  );
}
