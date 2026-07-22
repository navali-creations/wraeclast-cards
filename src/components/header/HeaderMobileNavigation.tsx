import clsx from "clsx";
import { FiMenu, FiX } from "react-icons/fi";
import { navigationRoutes } from "../../config/navigation";
import { useDropdown } from "../../lib/useDropdown";
import { Button } from "../buttons";
import { NavItemLink } from "../links";

const LINK_CLASS_NAME =
  "flex w-52 max-w-full items-center justify-center px-4 py-3 text-center rounded-lg text-base font-semibold text-(--wc-text-60) transition-all duration-150 hover:bg-(--wc-hover-glow) hover:text-(--wc-text) active:scale-[0.97] active:bg-(--wc-glow) focus:outline-none focus-visible:outline-none";
const ACTIVE_PROPS = { className: "text-(--wc-gold)! bg-(--wc-glow)" };

export function HeaderMobileNavigation() {
  const { open, containerRef, toggle, close } = useDropdown();

  return (
    <div ref={containerRef} className="relative md:hidden">
      <Button
        variant="ghost"
        aria-label={open ? "Fermer la navigation" : "Ouvrir la navigation"}
        aria-expanded={open}
        onClick={toggle}
        className="h-10 min-h-10 w-10 px-0 xs:h-12 xs:min-h-12 xs:w-12"
      >
        {open ? <FiX /> : <FiMenu />}
      </Button>

      <ul
        className={clsx(
          "fixed top-14 right-0 left-0 z-50 flex flex-col items-center rounded-none border border-(--wc-border) bg-(--wc-nav-bg) p-1.5 shadow-xl xs:top-16",
          "transition-all duration-200 ease-out",
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none",
        )}
      >
        {navigationRoutes.map((item) => (
          <li key={item.path} className="list-none">
            <NavItemLink
              item={item}
              onClick={close}
              className={LINK_CLASS_NAME}
              activeProps={ACTIVE_PROPS}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
