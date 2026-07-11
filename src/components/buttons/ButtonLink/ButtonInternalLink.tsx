import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { InternalLink } from "../../links";
import { baseClass, variantClasses } from "../styles";
import { omitStylingProps } from "./omitStylingProps";
import type { ButtonLinkProps } from "./types";

export function ButtonInternalLink(props: ButtonLinkProps) {
  const buttonClassName = clsx(
    baseClass,
    props.variant && variantClasses[props.variant],
    props.className,
  );

  if (props.gameScoped) {
    return (
      <InternalLink className={buttonClassName} {...omitStylingProps(props)} />
    );
  }

  return <Link className={buttonClassName} {...omitStylingProps(props)} />;
}
