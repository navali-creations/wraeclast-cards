import { useEffect, useState } from "react";

const THRESHOLDS = Array.from({ length: 21 }, (_, i) => i / 20);

export function useFooterOffset() {
  const [bottomOffset, setBottomOffset] = useState(60);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const overlap = window.innerHeight - entry.boundingClientRect.top;
        setBottomOffset(overlap > 0 ? Math.max(60, overlap + 56 + 16) : 60);
      },
      { threshold: THRESHOLDS },
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return bottomOffset;
}
