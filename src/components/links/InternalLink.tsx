import { Link } from "@tanstack/react-router";
import type {
  AnchorHTMLAttributes,
  CSSProperties,
  ReactNode,
  Ref,
} from "react";
import { useGameContext } from "../../app/game-context";
import { useLeagueContext } from "../../app/league-context";
import { gameToSlug } from "../../lib/gameSlug";
import { leagueToSlug } from "../../lib/leagueSlug";
import type { FileRouteTypes } from "../../routeTree.gen";

type GameLeagueTo = Extract<
  FileRouteTypes["to"],
  "/$game/$league" | `/$game/$league/${string}`
>;

// The part of a /$game/$league-scoped route after the /$game/$league segment,
// e.g. "/cards/$cardId".
export type GameLinkSuffix =
  GameLeagueTo extends `/$game/$league${infer Suffix}` ? Suffix : never;

// LinkProps from TanStack Router is itself a union, so Omit<LinkProps, ...>
// silently drops any prop not shared by every branch (className, onClick,
// style, ...). Listing the props this app actually passes avoids that trap.
export interface InternalLinkProps<TSuffix extends GameLinkSuffix> {
  to: TSuffix;
  params?: Record<string, string>;
  ref?: Ref<HTMLAnchorElement>;
  className?: string;
  style?: CSSProperties;
  onClick?: AnchorHTMLAttributes<HTMLAnchorElement>["onClick"];
  onPointerEnter?: AnchorHTMLAttributes<HTMLAnchorElement>["onPointerEnter"];
  onPointerLeave?: AnchorHTMLAttributes<HTMLAnchorElement>["onPointerLeave"];
  onFocus?: AnchorHTMLAttributes<HTMLAnchorElement>["onFocus"];
  onBlur?: AnchorHTMLAttributes<HTMLAnchorElement>["onBlur"];
  activeProps?: { className?: string };
  children?: ReactNode;
}

export function InternalLink<TSuffix extends GameLinkSuffix>({
  to,
  params,
  ...props
}: InternalLinkProps<TSuffix>) {
  const { game } = useGameContext();
  const { selectedLeague } = useLeagueContext();

  const linkProps = {
    ...props,
    to: `/$game/$league${to}`,
    params: {
      game: gameToSlug(game),
      league: leagueToSlug(selectedLeague),
      ...params,
    },
    // `to` is a generic suffix here, so TanStack Router can't re-derive
    // per-route params against it statically (same escape hatch as
    // useUrlPagination.ts).
  } as unknown as Parameters<typeof Link>[0];

  return <Link {...linkProps} />;
}
