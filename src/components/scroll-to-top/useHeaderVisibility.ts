import { useEffect, useState } from "react";

export function useHeaderVisibility() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(!entry.isIntersecting),
      { threshold: 0.1 },
    );

    observer.observe(header);
    return () => observer.unobserve(header);
  }, []);

  return { isVisible };
}
