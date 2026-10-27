import { FeaturedCardsCarouselView } from "./FeaturedCardsCarouselView";
import { useFeaturedCardEntries } from "./useFeaturedCardEntries";

export function FeaturedCardsCarousel() {
  const carousel = useFeaturedCardEntries();

  return <FeaturedCardsCarouselView {...carousel} />;
}
