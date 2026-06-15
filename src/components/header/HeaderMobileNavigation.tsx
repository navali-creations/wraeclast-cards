import { Link } from "@tanstack/react-router";
import { FiMenu } from "react-icons/fi";
import { navigationRoutes } from "../../config/navigation";
import { Button } from "../buttons";

export function HeaderMobileNavigation() {
  return (
    <div className="dropdown lg:hidden">
      <Button variant="ghost">
        <FiMenu />
      </Button>
      <ul className="menu menu-sm dropdown-content bg-(--wc-nav-bg) border border-(--wc-border) rounded-box z-10 mt-3 w-52 p-2 shadow">
        {navigationRoutes.map((item) => (
          <li key={item?.path}>
            <Link
              to={item?.path}
              className="hover:bg-transparent hover:text-inherit focus:outline-none focus-visible:outline-none focus:bg-transparent focus-visible:bg-transparent"
            >
              {item?.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
