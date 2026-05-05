import { Link } from "@tanstack/react-router";
import { mainNavigation } from "../../config/navigation";

export function HeaderDesktopNavigation() {
  return (
    <div className="navbar-center hidden lg:flex">
      <ul className="menu menu-horizontal px-1">
        {mainNavigation.map((item) => (
          <li key={item?.path}>
            <Link
              to={item?.path}
              className="text-sm text-(--wc-text-60)"
              activeProps={{ className: "text-(--wc-text-90)!" }}
            >
              {item?.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
