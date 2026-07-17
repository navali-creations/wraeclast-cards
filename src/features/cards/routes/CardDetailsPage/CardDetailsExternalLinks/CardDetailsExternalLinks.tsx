import { FiBarChart2, FiBookOpen, FiDatabase } from "react-icons/fi";
import { ButtonExternalLink } from "../../../../../components/buttons";
import type { Card } from "../../../types";
import {
  getPoeDbUrl,
  getPoeNinjaUrl,
  getPoeWikiUrl,
} from "./CardDetailsExternalLinks.utils";
import "./CardDetailsExternalLinks.css";

const EXTERNAL_LINKS = [
  {
    label: "PoE Wiki",
    getUrl: getPoeWikiUrl,
    icon: FiBookOpen,
  },
  {
    label: "poe.ninja",
    getUrl: getPoeNinjaUrl,
    icon: FiBarChart2,
  },
  {
    label: "PoEDB",
    getUrl: getPoeDbUrl,
    icon: FiDatabase,
  },
] as const;

export function CardDetailsExternalLinks({ card }: { card: Card }) {
  return (
    <nav
      aria-label="External card references"
      className="wc-divider-glow w-full pt-5"
    >
      <div className="grid w-full grid-cols-3 gap-2">
        {EXTERNAL_LINKS.map(({ label, getUrl, icon: Icon }) => (
          <ButtonExternalLink
            key={label}
            className="wc-card-details-external-link"
            href={getUrl(card.name)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon
              aria-hidden="true"
              className="wc-card-details-external-link-icon"
            />
            <span className="min-w-0 truncate">{label}</span>
          </ButtonExternalLink>
        ))}
      </div>
    </nav>
  );
}
