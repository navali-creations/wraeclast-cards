let headerVisible = true;

export function subscribeToHeader(callback: () => void) {
  const header = document.querySelector("header");
  if (!header) return () => {};
  const observer = new IntersectionObserver(
    ([entry]) => {
      headerVisible = entry.isIntersecting;
      callback();
    },
    { threshold: 0 },
  );
  observer.observe(header);
  return () => observer.disconnect();
}

export function getVisible() {
  return !headerVisible;
}
