import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { FiExternalLink, FiGithub } from "react-icons/fi";
import { SiDiscord } from "react-icons/si";
import {
  footerGameNavigation,
  footerNavigation,
  navigationRoutes,
} from "../../config/navigation";
import { NavItemLink } from "../links";
import { Text } from "../text";

const LINK_CLASS_NAME =
  "inline-flex h-5 items-center text-sm leading-5 link link-hover text-(--wc-text-50)";

const FOOTER_SECTIONS = [
  {
    title: "Info",
    internalLinks: footerNavigation,
    externalLinks: [
      {
        label: "Discord",
        href: "https://discord.com/invite/5rnWW6Mfa4",
        icon: SiDiscord,
      },
      {
        label: "GitHub",
        href: "https://github.com/navali-creations/wraeclast-cards",
        icon: FiGithub,
      },
    ],
  },
  {
    title: "Maintainers",
    internalLinks: [],
    externalLinks: [
      {
        label: "Bloderyn",
        href: "https://bloderyn.com/",
        icon: FiExternalLink,
      },
      {
        label: "Ailu",
        href: "https://github.com/sbsrnt",
        icon: FiGithub,
      },
    ],
  },
] as const;

export function FooterNavigation() {
  return (
    <div className="grid grid-cols-[max-content_max-content] gap-x-8 gap-y-6 xs:grid-cols-[max-content_max-content_max-content] sm:gap-x-12">
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
          {footerGameNavigation.map((item) => (
            <li key={item.path}>
              <NavItemLink item={item} className={LINK_CLASS_NAME} />
            </li>
          ))}
        </ul>
      </div>

      {FOOTER_SECTIONS.map(({ title, internalLinks, externalLinks }) => (
        <div key={title}>
          <Text
            size="xs"
            weight="semibold"
            uppercase
            dimmed
            className="mb-3 tracking-widest"
          >
            {title}
          </Text>
          <ul className="space-y-2">
            {internalLinks.map((item) => (
              <li key={item.path}>
                <Link to={item.path} className={LINK_CLASS_NAME}>
                  {item.label}
                </Link>
              </li>
            ))}
            {externalLinks.map(({ label, href, icon: Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={clsx(LINK_CLASS_NAME, {
                    "gap-1.5": Icon !== undefined,
                  })}
                >
                  <span>{label}</span>
                  {Icon && <Icon aria-hidden="true" className="size-3.5" />}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
