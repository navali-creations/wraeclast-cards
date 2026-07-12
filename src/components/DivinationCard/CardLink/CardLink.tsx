import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { InternalLink } from "../../links";

interface CardLinkProps {
  cardId: string;
  className?: string;
  style?: CSSProperties;
  onClick?: (event: MouseEvent) => void;
  children?: ReactNode;
}

export function CardLink({ cardId, children, ...props }: CardLinkProps) {
  return (
    <InternalLink to="/cards/$cardId" params={{ cardId }} {...props}>
      {children}
    </InternalLink>
  );
}
