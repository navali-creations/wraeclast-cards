import { useEffect, useState } from "react";

export function useHeaderVisibility() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const sentinel = document.createElement("div");
    sentinel.style.cssText =
      "position:absolute;top:300px;height:1px;width:1px;pointer-events:none;";
    document.body.appendChild(sentinel);

    const observer = new IntersectionObserver(([entry]) =>
      setIsVisible(!entry.isIntersecting),
    );

    observer.observe(sentinel);
    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, []);

  return { isVisible };
}
