import { useQueryClient } from "@tanstack/react-query";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useGameContext } from "../../../../../app/game-context";
import { useLeagueContext } from "../../../../../app/league-context";
import { DivinationCard } from "../../../../../components/DivinationCard";
import { CardLink } from "../../../../../components/DivinationCard/CardLink/CardLink";
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
  const triggerRef = useRef<HTMLAnchorElement>(null);
  // Invalidates stale async preview loads after hover changes or preview hides.
  const requestIdRef = useRef(0);
  const queryClient = useQueryClient();
  const { game } = useGameContext();
  const { selectedLeague } = useLeagueContext();
  const [previewStyle, setPreviewStyle] = useState<CSSProperties | null>(null);
  const [previewCard, setPreviewCard] = useState<Card | null>(null);

  const showPreview = useCallback(async () => {
    const trigger = triggerRef.current;
    if (!trigger || typeof window === "undefined") return false;

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
      const cards = await queryClient.ensureQueryData(
        cardsQueryOptions({ game, leagueName: selectedLeague.name }),
      );
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
  }, [game, name, queryClient, selectedLeague.name]);

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
      <CardLink
        cardId={name}
        ref={triggerRef}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onFocus={handlePointerEnter}
        onBlur={handlePointerLeave}
        className="inline-flex text-inherit group-hover:underline"
      >
        {name}
      </CardLink>
      {preview}
    </>
  );
}
