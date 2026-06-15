import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { HiChevronUp } from "react-icons/hi2";
import { Button } from "../buttons";
import {
  getBottomOffset,
  getVisible,
  scrollToTop,
  subscribe,
} from "./ScrollToTop.utils";

export function ScrollToTop() {
  const visible = useSyncExternalStore(subscribe, getVisible, () => false);
  const bottomOffset = useSyncExternalStore(
    subscribe,
    getBottomOffset,
    () => 60,
  );

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
      className={`fixed z-50 flex h-14 w-14 items-center justify-center rounded-full border border-(--wc-gold-dim) bg-[color-mix(in_oklch,var(--wc-glow)_72%,var(--color-base-100))] text-(--wc-gold-bright) shadow-[0_10px_28px_color-mix(in_oklch,var(--wc-gold-dim)_34%,transparent),0_0_0_1px_color-mix(in_oklch,var(--wc-gold-dim)_18%,transparent)] transition-[opacity,transform,border-color,background-color,box-shadow] duration-300 ease-out hover:border-(--wc-gold) hover:bg-[color-mix(in_oklch,var(--wc-glow)_84%,var(--color-base-100))] hover:shadow-[0_14px_34px_color-mix(in_oklch,var(--wc-gold-dim)_46%,transparent),0_0_0_1px_color-mix(in_oklch,var(--wc-gold-dim)_28%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--wc-gold) focus-visible:ring-offset-2 focus-visible:ring-offset-(--wc-bg) ${visible ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-4 scale-90 opacity-0"}`}
    >
      <HiChevronUp className="size-7" />
    </Button>,
    document.body,
  );
}
