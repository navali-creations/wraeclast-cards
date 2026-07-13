import { navigationRoutes } from "../../config/navigation";
import { NavItemLink } from "../links";

const LINK_CLASS_NAME =
  "!rounded-none border-b-2 border-transparent px-3 py-2 text-sm text-(--wc-text-60) transition-[color,border-color] hover:border-(--wc-gold-dim) hover:bg-transparent hover:text-(--wc-text-90) focus:bg-transparent focus:outline-none focus-visible:border-(--wc-gold-dim) focus-visible:bg-transparent focus-visible:outline-none";
const ACTIVE_PROPS = {
  className: "!border-(--wc-gold) !text-(--wc-text-90)",
};

export function HeaderDesktopNavigation() {
  return (
    <div className="hidden items-center justify-self-center md:flex">
      <ul className="menu menu-horizontal flex-nowrap px-1">
        {navigationRoutes.map((item) => (
          <li key={item.path}>
            <NavItemLink
              item={item}
              className={LINK_CLASS_NAME}
              activeProps={ACTIVE_PROPS}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
