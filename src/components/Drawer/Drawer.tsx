import clsx from "clsx";
import type { ReactNode } from "react";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  headerActions?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Drawer({
  open,
  onOpenChange,
  title,
  headerActions,
  className,
  children,
}: DrawerProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const handleClose = () => onOpenChange(false);

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    previousActiveElementRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => {
      const focusTarget =
        dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ??
        dialogRef.current;
      focusTarget?.focus();
    });

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange(false);
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusableElements = [
        ...dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ];
      if (focusableElements.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      if (previousActiveElementRef.current?.isConnected) {
        previousActiveElementRef.current.focus();
      }
    };
  }, [onOpenChange, open]);

  if (!open || typeof document === "undefined") return null;

  const portalTarget = document.getElementById("root") ?? document.body;

  return createPortal(
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        aria-label="Close drawer"
        className="absolute inset-0 cursor-default bg-black/60"
        onClick={handleClose}
      />

      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={clsx(
          "absolute right-0 top-0 flex h-full w-full max-w-sm flex-col border-l border-[#c9b992] bg-[#f2ead8] text-[#2f261a] shadow-2xl shadow-black/50",
          className,
        )}
      >
        <div className="flex shrink-0 items-center gap-3 border-b border-[#d8c8a4] px-4 py-3">
          <h2
            id={titleId}
            className="min-w-0 flex-1 truncate font-fontin text-xl text-[#3d2c1b]"
          >
            {title}
          </h2>
          {headerActions}
          <button
            type="button"
            aria-label="Close drawer"
            onClick={handleClose}
            className="btn btn-square btn-ghost btn-sm shrink-0 text-[#5a472d] hover:bg-[#e2d3b5] hover:text-[#2f261a]"
          >
            <FiX className="size-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {children}
        </div>
      </section>
    </div>,
    portalTarget,
  );
}
