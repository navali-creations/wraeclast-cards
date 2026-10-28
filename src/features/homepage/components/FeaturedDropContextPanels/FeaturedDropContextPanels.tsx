import { FeaturedCardsCarouselView } from "./FeaturedCardsCarouselView/FeaturedCardsCarouselView";
import { useFeaturedCardEntries } from "./useFeaturedCardEntries";

export function FeaturedCardsCarousel() {
  const carousel = useFeaturedCardEntries();

  return <FeaturedCardsCarouselView {...carousel} />;
}
