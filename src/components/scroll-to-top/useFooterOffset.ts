import { useEffect, useRef, useState } from "react";

const THRESHOLDS = [0, 0.25, 0.5, 0.75, 1];

export function useFooterOffset() {
  const [bottomOffset, setBottomOffset] = useState(60);
  const rafIdRef = useRef<number | null>(null);
  const latestOffsetRef = useRef(60);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const overlap = window.innerHeight - entry.boundingClientRect.top;
        latestOffsetRef.current =
          overlap > 0 ? Math.max(60, overlap + 56 + 16) : 60;

        // Coalesce rapid callbacks (e.g. during resize) into one state update per frame
        if (rafIdRef.current !== null) return;
        rafIdRef.current = requestAnimationFrame(() => {
          rafIdRef.current = null;
          setBottomOffset(latestOffsetRef.current);
        });
      },
      { threshold: THRESHOLDS },
    );

    observer.observe(footer);
    return () => {
      observer.disconnect();
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return bottomOffset;
}
