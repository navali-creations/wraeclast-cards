import { useDivinationCardsData } from "../../../hooks";

export function CardFrame() {
  const { frameUrl } = useDivinationCardsData();

  return (
    <img
      src={frameUrl}
      alt="{card.name} frame overlay"
      aria-hidden="true"
      className="absolute z-20 inset-0 w-80 h-full pointer-events-none select-none"
      draggable={false}
    />
  );
}
