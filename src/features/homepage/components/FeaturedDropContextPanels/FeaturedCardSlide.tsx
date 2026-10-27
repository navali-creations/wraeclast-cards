import { m, useTransform } from "motion/react";
import { useCarouselSlideMotion } from "../../../../components/arc/carousel/Carousel";
import { FeaturedCardDetails } from "./FeaturedCardDetails";
import { FeaturedCardVisual } from "./FeaturedCardVisual";
import styles from "./FeaturedDropContextPanels.module.css";
import type { FeaturedCardCarouselEntry } from "./types";

export function FeaturedCardSlide({
  entry,
}: {
  entry: FeaturedCardCarouselEntry;
}) {
  const { direction, index, progress } = useCarouselSlideMotion();
  const detailsReveal = useTransform(
    [progress, direction],
    ([positionValue, directionValue]) => {
      const position = Number(positionValue);
      const reveal = Math.max(0, 1 - Math.abs(position - index));
      const isExitingTowardLeft =
        Number(directionValue) > 0 && position > index;

      return isExitingTowardLeft ? Math.sqrt(reveal) : reveal;
    },
  );
  const visualX = useTransform(progress, (position) => {
    const distance = Math.max(-1, Math.min(1, position - index));
    const offset = distance >= 0 ? 100 * distance : 22 * distance;

    return `${offset}%`;
  });
  const cardScale = useTransform(detailsReveal, [0, 1], [1, 1.22]);
  const detailsOrigin = useTransform(direction, (movement) =>
    movement < 0 ? "0% 50%" : "100% 50%",
  );

  return (
    <article className={styles.slideContent}>
      <m.div className={styles.visualColumn} style={{ x: visualX }}>
        <m.div className={styles.cardScale} style={{ scale: cardScale }}>
          <FeaturedCardVisual card={entry.card} />
        </m.div>
      </m.div>
      <m.div
        className={styles.detailsReveal}
        style={{
          opacity: detailsReveal,
          scale: detailsReveal,
          transformOrigin: detailsOrigin,
        }}
      >
        <div className={styles.detailsContent}>
          <FeaturedCardDetails entry={entry} />
        </div>
      </m.div>
    </article>
  );
}
