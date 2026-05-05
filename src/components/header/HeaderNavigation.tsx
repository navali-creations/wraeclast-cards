import { Link } from "@tanstack/react-router";
import { FiChevronDown } from "react-icons/fi";
import { mainNavigation } from "../../config/navigation";

export function HeaderNavigation() {
  return (
    <div className="dropdown lg:hidden">
      <button type="button" className="btn btn-ghost">
        <FiChevronDown />
      </button>
      <ul className="menu menu-sm dropdown-content bg-(--wc-nav-bg) border border-(--wc-border) rounded-box z-10 mt-3 w-52 p-2 shadow">
        {mainNavigation.map((item) => (
          <li key={item?.path}>
            <Link to={item?.path}>{item?.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
