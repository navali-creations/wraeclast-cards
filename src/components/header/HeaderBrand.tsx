import { Link } from "@tanstack/react-router";
import clsx from "clsx";

export function HeaderBrand() {
  return (
    <Link
      to="/"
      className={clsx(
        "btn btn-ghost font-cinzel text-lg font-bold tracking-widest uppercase text-(--wc-gold) px-2",
      )}
    >
      Wraeclast<span className="text-(--color-primary)">.</span>Cards
    </Link>
  );
}
