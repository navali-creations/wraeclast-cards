import { Fragment, type ReactNode, useMemo, useRef } from "react";
import { getColorForClass } from "../../../../styles/tc-colors";
import { useCardMouseEffects } from "../../hooks";
import type { Card } from "../../types";
import { CardFrame } from "./CardFrame";
import { CardEffects } from "./effects/CardEffects";

const CDN =
  "https://cdn.jsdelivr.net/npm/@navali/poe1-divination-cards@3.28.2/data";
const SEPARATOR_URL = `${CDN}/Divination_card_separator.png`;

function sanitizeRewardClassName(className: string): string | undefined {
  const tokens = className
    .split(/\s+/)
    .filter((token) => token === "tc" || /^-[a-z]+$/.test(token));
  return tokens.length ? tokens.join(" ") : undefined;
}

function renderRewardHtml(rewardHtml: string): ReactNode {
  if (!rewardHtml) return null;

  if (typeof DOMParser === "undefined") {
    return rewardHtml.replace(/<[^>]*>/g, "");
  }

  const doc = new DOMParser().parseFromString(
    `<div>${rewardHtml}</div>`,
    "text/html",
  );
  const root = doc.body.firstElementChild;
  if (!root) return rewardHtml;

  let key = 0;
  const nextKey = () => `reward-${key++}`;

  const toNode = (node: ChildNode): ReactNode => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent;
    if (node.nodeType !== Node.ELEMENT_NODE) return null;

    const element = node as HTMLElement;
    const children = Array.from(element.childNodes).map((child) => (
      <Fragment key={nextKey()}>{toNode(child)}</Fragment>
    ));

    if (element.tagName === "BR") return <br key={nextKey()} />;

    if (element.tagName === "SPAN") {
      const sanitized = sanitizeRewardClassName(element.className);
      const colorToken = sanitized?.split(/\s+/).find((t) => t.startsWith("-"));
      return (
        <span
          key={nextKey()}
          className={sanitized}
          style={
            colorToken ? { color: getColorForClass(colorToken) } : undefined
          }
        >
          {children}
        </span>
      );
    }

    return <Fragment key={nextKey()}>{children}</Fragment>;
  };

  return Array.from(root.childNodes).map((child) => (
    <Fragment key={nextKey()}>{toNode(child)}</Fragment>
  ));
}

export function CardsGridItem({ card }: { card: Card }) {
  const cardRef = useRef<HTMLElement>(null);
  const rewardContent = useMemo(
    () => renderRewardHtml(card.rewardHtml),
    [card.rewardHtml],
  );
  const { mousePos, isHovered, rotateX, rotateY } =
    useCardMouseEffects(cardRef);

  return (
    <article
      ref={cardRef}
      className="relative w-80 h-119"
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
            loading="lazy"
            className="h-full w-full object-cover object-top"
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
            <div className="flex justify-center w-full">
              <img src={SEPARATOR_URL} alt="" className="h-0.5" />
            </div>
          )}

          {card.flavourText && (
            <div className="font-fontin text-center text-[#af6025] italic text-[17px] leading-tight">
              {card.flavourText}
            </div>
          )}
        </div>
      </div>

      <CardEffects
        stackSize={card.stackSize}
        mousePos={mousePos}
        isHovered={isHovered}
        posX={mousePos.x}
        posY={mousePos.y}
      />
    </article>
  );
}
