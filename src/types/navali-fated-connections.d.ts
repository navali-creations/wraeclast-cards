declare module "@navali/fated-connections" {
  import type { ButtonHTMLAttributes, ReactNode } from "react";

  export type ButtonVariant =
    | "neutral"
    | "primary"
    | "secondary"
    | "accent"
    | "ghost"
    | "link"
    | "info"
    | "success"
    | "warning"
    | "error";

  export type ButtonSize = "xs" | "sm" | "md" | "lg";

  export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    outline?: boolean;
    wide?: boolean;
    block?: boolean;
    circle?: boolean;
    square?: boolean;
    glass?: boolean;
    loading?: boolean;
    active?: boolean;
    soft?: boolean;
  }

  export function Button(props: ButtonProps): ReactNode;
}
