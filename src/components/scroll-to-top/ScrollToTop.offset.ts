export function subscribe(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

export function getBottomOffset() {
  const footer = document.querySelector("footer");
  if (!footer) return 60;
  const overlap = window.innerHeight - footer.getBoundingClientRect().top;
  return overlap > 0 ? Math.max(60, overlap + 56 + 16) : 60;
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
