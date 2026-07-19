import { createPortal } from "react-dom";
import { HiChevronUp } from "react-icons/hi2";
import { Button } from "../buttons";
import { useFooterOffset } from "./useFooterOffset";
import { useHeaderVisibility } from "./useHeaderVisibility";

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

const fabClassName = [
  "fixed z-50 flex h-14 w-14 items-center justify-center rounded-full border border-(--wc-gold-dim)",
  "bg-(--wc-fab-bg) text-(--wc-gold-bright) shadow-[var(--wc-fab-shadow)]",
  "transition-[opacity,transform,border-color,background-color,box-shadow] duration-300 ease-out",
  "hover:border-(--wc-gold) hover:bg-(--wc-fab-bg-hover) hover:shadow-[var(--wc-fab-shadow-hover)]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--wc-gold) focus-visible:ring-offset-2 focus-visible:ring-offset-(--wc-bg)",
].join(" ");

const fabVisibleClassName = "translate-y-0 scale-100 opacity-100";
const fabHiddenClassName =
  "pointer-events-none translate-y-4 scale-90 opacity-0";

export function ScrollToTop() {
  const { isVisible } = useHeaderVisibility();
  const bottomOffset = useFooterOffset();

  return createPortal(
    <Button
      variant="secondary"
      aria-label="Back to top"
      title="Back to top"
      onClick={scrollToTop}
      style={{
        bottom: `calc(${bottomOffset}px + env(safe-area-inset-bottom))`,
        right: `calc(5rem + env(safe-area-inset-right))`,
      }}
      className={`${fabClassName} ${isVisible ? fabVisibleClassName : fabHiddenClassName}`}
    >
      <HiChevronUp className="size-7" />
    </Button>,
    document.body,
  );
}
