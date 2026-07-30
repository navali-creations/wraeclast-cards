import { useEffect, useState } from "react";

const THRESHOLDS = [0, 0.25, 0.5, 0.75, 1];

export function useFooterOffset() {
  const [bottomOffset, setBottomOffset] = useState(60);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer || typeof IntersectionObserver === "undefined") return;

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
