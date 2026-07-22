import { Link } from "@tanstack/react-router";
import { FiGithub } from "react-icons/fi";
import { footerNavigation, navigationRoutes } from "../../config/navigation";
import { NavItemLink } from "../links";
import { Text } from "../text";

const LINK_CLASS_NAME =
  "inline-flex h-5 items-center text-sm leading-5 link link-hover text-(--wc-text-50)";

export function FooterNavigation() {
  return (
    <div className="grid grid-cols-[max-content_max-content] gap-x-8 sm:gap-x-12">
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
              <NavItemLink item={item} className={LINK_CLASS_NAME} />
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
              <Link to={item.path} className={LINK_CLASS_NAME}>
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href="https://github.com/navali-creations/wraeclast-cards"
              target="_blank"
              rel="noreferrer noopener"
              className={`${LINK_CLASS_NAME} gap-1.5`}
            >
              <span>GitHub</span>
              <FiGithub aria-hidden="true" className="size-3.5" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
