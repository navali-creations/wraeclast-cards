import { Link } from "@tanstack/react-router";
import { FiGithub } from "react-icons/fi";
import {
  footerNavigation,
  footerPagesNavigation,
} from "../../config/navigation";

export function FooterNavigation() {
  return (
    <div className="flex gap-12">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-(--wc-text-40) mb-3">
          Pages
        </p>
        <ul className="space-y-2">
          {footerPagesNavigation.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="text-sm link link-hover text-(--wc-text-50)"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-(--wc-text-40) mb-3">
          Info
        </p>
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
              rel="noreferrer"
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
