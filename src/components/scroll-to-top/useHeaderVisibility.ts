import { useEffect, useState } from "react";

export function useHeaderVisibility() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const h1 = document.querySelector("h1");
    if (!h1) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(!entry.isIntersecting),
      { threshold: 0.1 },
    );

    observer.observe(h1);
    return () => observer.unobserve(h1);
  }, []);

  return { isVisible };
}
