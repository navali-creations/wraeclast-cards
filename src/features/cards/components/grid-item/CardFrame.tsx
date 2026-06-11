const CDN =
  "https://cdn.jsdelivr.net/npm/@navali/poe1-divination-cards@3.28.2/data";

const FRAME_URL = `${CDN}/Divination_card_frame.png`;

export function CardFrame() {
  return (
    <img
      src={FRAME_URL}
      alt=""
      aria-hidden="true"
      className="absolute z-20 inset-0 w-80 h-full pointer-events-none select-none"
      draggable={false}
    />
  );
}
