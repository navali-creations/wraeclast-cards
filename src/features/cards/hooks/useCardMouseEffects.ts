import { type RefObject, useEffect, useState } from "react";

const MAX_ROTATION = 15;
const PERSPECTIVE = 1000;

interface MousePosition {
  x: number;
  y: number;
}

interface UseCardMouseEffectsReturn {
  mousePos: MousePosition;
  isHovered: boolean;
  rotateX: number;
  rotateY: number;
  perspective: number;
}

export function useCardMouseEffects(
  cardRef: RefObject<HTMLElement | null>,
): UseCardMouseEffectsReturn {
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  useEffect(() => {
    const cardElement = cardRef.current;
    if (!cardElement) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = cardElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePos({ x, y });

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rotX = ((e.clientY - centerY) / rect.height) * -MAX_ROTATION;
      const rotY = ((e.clientX - centerX) / rect.width) * MAX_ROTATION;
      setRotateX(rotX);
      setRotateY(rotY);
    };

    const handleMouseEnter = () => setIsHovered(true);

    const handleMouseLeave = () => {
      setMousePos({ x: 50, y: 50 });
      setIsHovered(false);
      setRotateX(0);
      setRotateY(0);
    };

    cardElement.addEventListener("mousemove", handleMouseMove);
    cardElement.addEventListener("mouseenter", handleMouseEnter);
    cardElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cardElement.removeEventListener("mousemove", handleMouseMove);
      cardElement.removeEventListener("mouseenter", handleMouseEnter);
      cardElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [cardRef]);

  return { mousePos, isHovered, rotateX, rotateY, perspective: PERSPECTIVE };
}
