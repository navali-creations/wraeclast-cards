import {
  CARDS_GRID_CLASS_NAME,
  CARDS_GRID_SKELETON_CARD_CLASS_NAME,
  useCardsPageSize,
} from "./CardsGrid.utils";

export function CardsGridSkeleton() {
  const pageSize = useCardsPageSize();
  const skeletonIds = Array.from(
    { length: pageSize },
    (_, i) => `grid-skeleton-${i}`,
  );

  return (
    <div className={CARDS_GRID_CLASS_NAME}>
      {skeletonIds.map((id) => (
        <div key={id} className={CARDS_GRID_SKELETON_CARD_CLASS_NAME} />
      ))}
    </div>
  );
}
