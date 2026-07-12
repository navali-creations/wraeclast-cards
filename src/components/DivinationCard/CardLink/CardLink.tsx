import { InternalLink, type InternalLinkProps } from "../../links";

type CardLinkProps = Omit<
  InternalLinkProps<"/cards/$cardId">,
  "to" | "params"
> & {
  cardId: string;
};

export function CardLink({ cardId, children, ...props }: CardLinkProps) {
  return (
    <InternalLink to="/cards/$cardId" params={{ cardId }} {...props}>
      {children}
    </InternalLink>
  );
}
