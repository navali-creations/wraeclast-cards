import { navigationRoutes } from "../../config/navigation";
import { NavItemLink } from "../links";

const LINK_CLASS_NAME =
  "text-sm text-(--wc-text-60) hover:bg-transparent hover:text-(--wc-text-60) focus:outline-none focus-visible:outline-none focus:bg-transparent focus-visible:bg-transparent";
const ACTIVE_PROPS = { className: "text-(--wc-text-90)!" };

export function HeaderDesktopNavigation() {
  return (
    <div className="hidden md:flex items-center">
      <ul className="menu menu-horizontal px-1">
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
