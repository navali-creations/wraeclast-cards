import { FiBarChart2, FiBookOpen, FiDatabase } from "react-icons/fi";
import { useLeagueContext } from "../../../../../app/league-context";
import { ButtonExternalLink } from "../../../../../components/buttons";
import type { Card } from "../../../types";
import {
  getPoeDbUrl,
  getPoeNinjaUrl,
  getPoeWikiUrl,
} from "./CardDetailsExternalLinks.utils";
import "./CardDetailsExternalLinks.css";

export function CardDetailsExternalLinks({ card }: { card: Card }) {
  const { selectedLeague } = useLeagueContext();

  const externalLinks = [
    {
      label: "PoE Wiki",
      url: getPoeWikiUrl(card.name),
      icon: FiBookOpen,
    },
    {
      label: "poe.ninja",
      url: getPoeNinjaUrl(card.name, selectedLeague.name),
      icon: FiBarChart2,
    },
    {
      label: "PoEDB",
      url: getPoeDbUrl(card.name),
      icon: FiDatabase,
    },
  ] as const;

  return (
    <nav
      aria-label="External card references"
      className="wc-divider-glow w-full pt-5"
    >
      <div className="grid w-full grid-cols-3 gap-2">
        {externalLinks.map(({ label, url, icon: Icon }) => (
          <ButtonExternalLink
            key={label}
            className="wc-card-details-external-link"
            href={url}
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
