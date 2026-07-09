import { Link } from "@tanstack/react-router";
import { useGameContext } from "../../app/game-context";
import { navigationRoutes } from "../../config/navigation";
import { gameToSlug } from "../../lib/gameSlug";

export function HeaderDesktopNavigation() {
  const { game } = useGameContext();

  return (
    <div className="hidden xl:flex items-center">
      <ul className="menu menu-horizontal px-1">
        {navigationRoutes.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              params={item.gameScoped ? { game: gameToSlug(game) } : undefined}
              className="text-sm text-(--wc-text-60) hover:bg-transparent hover:text-(--wc-text-60) focus:outline-none focus-visible:outline-none focus:bg-transparent focus-visible:bg-transparent"
              activeProps={{ className: "text-(--wc-text-90)!" }}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
