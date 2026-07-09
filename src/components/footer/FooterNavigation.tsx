import { Link } from "@tanstack/react-router";
import { FiGithub } from "react-icons/fi";
import { useGameContext } from "../../app/game-context";
import { footerNavigation, navigationRoutes } from "../../config/navigation";
import { gameToSlug } from "../../lib/gameSlug";
import { Text } from "../text";

export function FooterNavigation() {
  const { game } = useGameContext();

  return (
    <div className="flex gap-8 sm:gap-12">
      <div>
        <Text
          size="xs"
          weight="semibold"
          uppercase
          dimmed
          className="mb-3 tracking-widest"
        >
          Pages
        </Text>
        <ul className="space-y-2">
          {navigationRoutes.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                params={
                  item.gameScoped ? { game: gameToSlug(game) } : undefined
                }
                className="text-sm link link-hover text-(--wc-text-50)"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <Text
          size="xs"
          weight="semibold"
          uppercase
          dimmed
          className="mb-3 tracking-widest"
        >
          Info
        </Text>
        <ul className="space-y-2">
          {footerNavigation.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="text-sm link link-hover text-(--wc-text-50)"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href="https://github.com/navali-creations/wraeclast-cards.git"
              target="_blank"
              rel="noreferrer noopener"
              className="text-sm link link-hover text-(--wc-text-50) flex items-center gap-1.5"
            >
              <FiGithub />
              GitHub
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
