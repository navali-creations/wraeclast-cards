import clsx from "clsx";
import { useMemo, useRef } from "react";
import type { Card } from "../../features/cards/types";
import { CardFrame } from "./components/CardFrame";
import { RarityEffects } from "./effects/RarityEffects";
import { useCardMouseEffects } from "./hooks/useCardMouseEffects";
import { renderRewardHtml } from "./utils/renderRewardHtml";

interface DivinationCardProps {
  card: Card;
  className?: string;
  scaleClassName?: string;
}

export function DivinationCard({
  card,
  className,
  scaleClassName,
}: DivinationCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rewardContent = useMemo(
    () => renderRewardHtml(card.rewardHtml),
    [card.rewardHtml],
  );
  const { mousePos, isHovered, rotateX, rotateY } =
    useCardMouseEffects(cardRef);

  const cardElement = (
    <div
      ref={cardRef}
      className={clsx("relative w-80 h-119", !scaleClassName && className)}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: isHovered
          ? "transform 0.05s ease-out"
          : "transform 0.4s ease-out",
        willChange: "transform",
      }}
    >
      {/* Art — behind frame */}
      <div className="absolute z-10 top-10.5 left-6 right-4.75 h-47.5 overflow-hidden bg-black">
        {card.imageUrl ? (
          <img
            src={card.imageUrl}
            alt={card.name}
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-(--wc-text-40)">
            ?
          </div>
        )}
      </div>

      {/* Frame overlay */}
      <CardFrame frameUrl={card.frameUrl} />

      {/* Card name */}
      <div className="absolute z-30 top-2.5 flex justify-center w-full">
        <span className="font-fontin text-[20px] max-w-53.75 text-center leading-tight text-(--wc-card-name)">
          {card.name}
        </span>
      </div>

      {/* Stack counter */}
      <div className="absolute z-30 top-54.5 left-7.75 w-13 h-7.5 flex items-center justify-center">
        <span className="font-fontin text-[19px] text-white">
          0/{card.stackSize}
        </span>
      </div>

      {/* Reward + flavour */}
      <div className="absolute z-30 bottom-6.25 top-66.25 left-7.5 right-7.5 flex flex-col justify-center text-lg">
        <div className="flex flex-col items-center gap-3 h-full justify-evenly">
          <div className="text-center text-white leading-tight">
            <div className="font-fontin">{rewardContent}</div>
          </div>

          {card.flavourText && (
            <div className="flex justify-center w-full">
              <img
                src={card.separatorUrl}
                alt={`${card.name} separator`}
                className="h-0.5"
              />
            </div>
          )}

          {card.flavourText && (
            <div className="font-fontin text-center text-[#af6025] italic text-[17px] leading-tight">
              {card.flavourText}
            </div>
          )}
        </div>
      </div>

      <RarityEffects
        rarity={card.rarity}
        mousePos={mousePos}
        isHovered={isHovered}
        posX={mousePos.x}
        posY={mousePos.y}
      />
    </div>
  );

  if (!scaleClassName) return cardElement;

  return (
    <div
      className={clsx(
        "relative h-[calc(29.75rem*var(--wc-card-scale))] w-[calc(20rem*var(--wc-card-scale))]",
        "[--wc-card-scale:1]",
        scaleClassName,
        className,
      )}
    >
      <div className="absolute top-0 left-0 origin-top-left [transform:scale(var(--wc-card-scale))]">
        {cardElement}
      </div>
    </div>
  );
}
