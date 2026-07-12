import { useQueryClient } from "@tanstack/react-query";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useGameContext } from "../../../../../app/game-context";
import { DivinationCard } from "../../../../../components/DivinationCard";
import { CardLink } from "../../../../../components/DivinationCard/CardLink/CardLink";
import { EGame } from "../../../../../enums";
import { cardsQueryOptions } from "../../../../cards/hooks";
import type { Card } from "../../../../cards/types";
import {
  findCardByName,
  getCardNamePreviewStyle,
} from "./CardNamePreview.utils";

interface CardNamePreviewProps {
  name: string;
}

export function CardNamePreview({ name }: CardNamePreviewProps) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  // Invalidates stale async preview loads after hover changes or preview hides.
  const requestIdRef = useRef(0);
  const queryClient = useQueryClient();
  const { game } = useGameContext();
  // Card previews use the current PoE1 card catalog; skip them for other games.
  const canShowPreview = game === EGame.Poe1;
  const [previewStyle, setPreviewStyle] = useState<CSSProperties | null>(null);
  const [previewCard, setPreviewCard] = useState<Card | null>(null);

  const showPreview = useCallback(async () => {
    const trigger = triggerRef.current;
    if (!trigger || typeof window === "undefined" || !canShowPreview)
      return false;

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    const nextPreviewStyle = getCardNamePreviewStyle(
      trigger.getBoundingClientRect(),
      {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    );

    try {
      const cards = await queryClient.ensureQueryData(cardsQueryOptions());
      if (requestIdRef.current !== requestId) return false;

      const card = findCardByName(cards, name);
      setPreviewCard(card ?? null);
      setPreviewStyle(card ? nextPreviewStyle : null);
      return Boolean(card);
    } catch {
      if (requestIdRef.current !== requestId) return false;

      setPreviewCard(null);
      setPreviewStyle(null);
      return false;
    }
  }, [canShowPreview, name, queryClient]);

  const hidePreview = useCallback(() => {
    requestIdRef.current += 1;
    setPreviewCard(null);
    setPreviewStyle(null);
  }, []);

  const handlePointerEnter = () => {
    void showPreview();
  };

  const handlePointerLeave = () => {
    hidePreview();
  };

  useEffect(() => {
    if (!previewStyle || typeof window === "undefined") return;

    const handleViewportChange = () => {
      hidePreview();
    };

    const handleDocumentPointerDown = (event: PointerEvent) => {
      const trigger = triggerRef.current;
      if (trigger?.contains(event.target as Node)) return;

      hidePreview();
    };

    window.addEventListener("scroll", handleViewportChange, true);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("pointerdown", handleDocumentPointerDown, true);

    return () => {
      window.removeEventListener("scroll", handleViewportChange, true);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener(
        "pointerdown",
        handleDocumentPointerDown,
        true,
      );
    };
  }, [hidePreview, previewStyle]);

  const preview =
    previewCard && previewStyle && typeof document !== "undefined"
      ? createPortal(
          <div
            className="pointer-events-none fixed z-[100]"
            style={previewStyle}
          >
            <DivinationCard card={previewCard} />
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <span
        ref={triggerRef}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        className="inline-flex"
      >
        <CardLink
          cardId={name}
          className="inline-flex text-inherit group-hover:underline"
        >
          {name}
        </CardLink>
      </span>
      {preview}
    </>
  );
}
