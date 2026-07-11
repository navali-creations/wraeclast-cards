import clsx from "clsx";
import { FiMenu, FiX } from "react-icons/fi";
import { navigationRoutes } from "../../config/navigation";
import { useDropdown } from "../../lib/useDropdown";
import { Button } from "../buttons";
import { NavItemLink } from "../links";

const LINK_CLASS_NAME =
  "flex items-center px-4 py-3 rounded-lg text-base font-semibold text-(--wc-text-60) transition-all duration-150 hover:bg-(--wc-hover-glow) hover:text-(--wc-text) active:scale-[0.97] active:bg-(--wc-glow) focus:outline-none focus-visible:outline-none";
const ACTIVE_PROPS = { className: "text-(--wc-gold)! bg-(--wc-glow)" };

export function HeaderMobileNavigation() {
  const { open, containerRef, toggle, close } = useDropdown();

  return (
    <div ref={containerRef} className="relative xl:hidden">
      <Button
        variant="ghost"
        aria-label={open ? "Fermer la navigation" : "Ouvrir la navigation"}
        aria-expanded={open}
        onClick={toggle}
      >
        {open ? <FiX /> : <FiMenu />}
      </Button>

      <ul
        className={clsx(
          "absolute left-0 top-full z-50 mt-2 w-64 rounded-xl border border-(--wc-border) bg-(--wc-nav-bg) p-1.5 shadow-xl",
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
