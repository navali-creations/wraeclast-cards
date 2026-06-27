import { useMemo } from "react";
import { CardFrame } from "../../../cards/components/DivinationCard/components/CardFrame";
import { RarityEffects } from "../../../cards/components/DivinationCard/effects/RarityEffects";
import { renderRewardHtml } from "../../../cards/components/DivinationCard/utils/renderRewardHtml";
import { useDivinationCardsData } from "../../../cards/hooks";
import type { Card } from "../../../cards/types";

const STATIC_MOUSE = { x: 50, y: 50 };

export function StaticDivinationCard({ card }: { card: Card }) {
  const { separatorUrl } = useDivinationCardsData();
  const rewardContent = useMemo(
    () => renderRewardHtml(card.rewardHtml),
    [card.rewardHtml],
  );

  return (
    <li className="relative w-80 h-119 list-none">
      {/* Art — behind frame */}
      <div className="absolute z-10 top-10.5 left-6 right-4.75 h-47.5 overflow-hidden bg-black">
        {card.imageUrl ? (
          <img
            src={card.imageUrl}
            alt={card.name}
            className="h-full w-full object-cover object-top"
            fetchPriority="high"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-(--wc-text-40)">
            ?
          </div>
        )}
      </div>

      {/* Frame overlay */}
      <CardFrame />

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
            <>
              <div className="flex justify-center w-full">
                <img
                  src={separatorUrl}
                  alt={`${card.name} separator`}
                  className="h-0.5"
                />
              </div>
              <div className="font-fontin text-center text-[#af6025] italic text-[17px] leading-tight">
                {card.flavourText}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Effects always hidden (isHovered=false) */}
      <RarityEffects
        stackSize={card.stackSize}
        mousePos={STATIC_MOUSE}
        isHovered={false}
        posX={50}
        posY={50}
      />
    </li>
  );
}
