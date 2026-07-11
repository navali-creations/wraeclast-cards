import { Link } from "@tanstack/react-router";
import type { MouseEvent } from "react";
import type { NavigationItem } from "../../config/navigation";
import { InternalLink } from "./InternalLink";

interface NavItemLinkProps {
  item: NavigationItem;
  className: string;
  activeProps?: { className?: string };
  onClick?: (event: MouseEvent) => void;
}

export function NavItemLink({
  item,
  className,
  activeProps,
  onClick,
}: NavItemLinkProps) {
  if (item.gameScoped) {
    return (
      <InternalLink
        to={item.path}
        className={className}
        activeProps={activeProps}
        onClick={onClick}
      >
        {item.label}
      </InternalLink>
    );
  }

  return (
    <Link
      to={item.path}
      className={className}
      activeProps={activeProps}
      onClick={onClick}
    >
      {item.label}
    </Link>
  );
}
