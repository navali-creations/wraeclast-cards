import type { ButtonVariant } from "../styles";

// Strips the styling-only fields so the remaining props can be forwarded
// straight to InternalLink/Link without leaking `variant`/`gameScoped` as DOM attributes.
export function omitStylingProps<
  T extends {
    variant?: ButtonVariant;
    className?: string;
    gameScoped?: boolean;
  },
>(props: T): Omit<T, "variant" | "className" | "gameScoped"> {
  const { variant, className, gameScoped, ...rest } = props;
  return rest;
}
