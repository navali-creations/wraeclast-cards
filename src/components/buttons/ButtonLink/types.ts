import type { LinkProps } from "@tanstack/react-router";
import type { GameLinkSuffix, InternalLinkProps } from "../../links";
import type { ButtonVariant } from "../styles";

export interface GameScopedButtonLinkProps
  extends InternalLinkProps<GameLinkSuffix> {
  gameScoped: true;
  variant?: ButtonVariant;
}

export interface StaticButtonLinkProps extends LinkProps {
  gameScoped?: false;
  variant?: ButtonVariant;
  className?: string;
}

export type ButtonLinkProps = GameScopedButtonLinkProps | StaticButtonLinkProps;
