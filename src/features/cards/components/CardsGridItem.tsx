import { Fragment, type ReactNode, useMemo, useRef } from "react";
import { useCardMouseEffects } from "../hooks";
import type { Card } from "../types";
import { CardEffects } from "./effects/CardEffects";

const CDN =
  "https://cdn.jsdelivr.net/npm/@navali/poe1-divination-cards@3.28.2/data";
const FRAME_URL = `${CDN}/Divination_card_frame.png`;
const SEPARATOR_URL = `${CDN}/Divination_card_separator.png`;

function sanitizeRewardClassName(className: string): string | undefined {
  const tokens = className
    .split(/\s+/)
    .filter((token) => token === "tc" || /^-[a-z]+$/.test(token));
  return tokens.length ? tokens.join(" ") : undefined;
}

function renderRewardHtml(rewardHtml: string): ReactNode {
  if (!rewardHtml) return null;

  // Fallback for non-browser contexts.
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
      return (
        <span
          key={nextKey()}
          className={sanitizeRewardClassName(element.className)}
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

// Frame is 440×668 px — zones measured from actual pixel alpha/RGB data:
//   art window  : x 7.5%–94%,  y 8.8%–48.7%
//   name scroll : x 11%–89%,   y 2.2%–8.2%   (parchment band)
//   stack box   : x 10%–26%,   y 46%–53%     (dark interior)
//   text area   : x 8%–92%,    y 54%–95%

export function CardsGridItem({ card }: { card: Card }) {
  const cardRef = useRef<HTMLElement>(null);
  const rewardContent = useMemo(
    () => renderRewardHtml(card.rewardHtml),
    [card.rewardHtml],
  );
  const { mousePos, isHovered, rotateX, rotateY, perspective } =
    useCardMouseEffects(cardRef);

  return (
    <article
      ref={cardRef}
      className="group relative hover:drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)]"
      style={{
        aspectRatio: "440/668",
        transform: `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: isHovered
          ? "transform 0.05s ease-out, filter 0.05s ease-out"
          : "transform 0.4s ease-out, filter 0.4s ease-out",
        willChange: "transform",
      }}
    >
      {/* Art — exact art-window bounds */}
      <div
        className="absolute overflow-hidden bg-black"
        style={{ top: "8.8%", left: "5.5%", right: "4%", height: "40%" }}
      >
        {card.imageUrl ? (
          <img
            src={card.imageUrl}
            alt={card.name}
            loading="lazy"
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-black/60 text-(--wc-text-40)">
            ?
          </div>
        )}
      </div>

      {/* Frame overlay — sits on top of art, provides all chrome */}
      <img
        src={FRAME_URL}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full select-none"
        style={{ zIndex: 10 }}
        draggable={false}
      />

      {/* Card name — centred in parchment scroll band */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          top: "2.2%",
          left: "11.4%",
          right: "11.4%",
          height: "6%",
          zIndex: 20,
        }}
      >
        <span className="font-fontin text-center text-[16px] font-normal leading-tight text-(--wc-card-name)">
          {card.name}
        </span>
      </div>

      {/* Stack counter — inside the frame's built-in dark box */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          top: "46%",
          left: "10.2%",
          width: "15.7%",
          height: "6.6%",
          zIndex: 20,
        }}
      >
        <span className="font-fontin text-[15px] text-(--wc-gold-muted)">
          0/{card.stackSize}
        </span>
      </div>

      {/* Reward text — top of dark text area */}
      <div
        className="absolute flex items-center justify-center px-[8%]"
        style={{ top: "54%", left: 0, right: 0, height: "22%", zIndex: 20 }}
      >
        <div className="poe-reward w-full font-fontin text-[15px] leading-snug line-clamp-3 text-center **:m-0 **:text-center">
          {rewardContent}
        </div>
      </div>

      {/* Separator + flavour text */}
      {card.flavourText && (
        <>
          <img
            src={SEPARATOR_URL}
            alt=""
            aria-hidden="true"
            className="absolute"
            style={{ top: "76%", left: "8%", width: "84%", zIndex: 20 }}
            draggable={false}
          />
          <div
            className="absolute flex items-center justify-center px-[8%]"
            style={{ top: "78%", left: 0, right: 0, height: "17%", zIndex: 20 }}
          >
            <p className="m-0 w-full text-center font-fontin text-[13px] italic leading-snug text-[#af6025] line-clamp-3">
              {card.flavourText}
            </p>
          </div>
        </>
      )}

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
