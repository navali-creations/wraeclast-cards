import { DIVINATION_CARDS_DATA } from "../../../features/cards/hooks";

export function CardFrame() {
  const { frameUrl } = DIVINATION_CARDS_DATA;

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
