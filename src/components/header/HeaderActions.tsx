import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { FiDownload } from "react-icons/fi";
import { useGame } from "../../app/game-context";
import { EGame } from "../../enums";

export function HeaderActions() {
  const { game, setGame } = useGame();
  return (
    <div className="navbar-end gap-3">
      <div className="relative shrink-0 rounded-lg p-1 bg-[color-mix(in_oklch,var(--wc-card-darker)_88%,black)] shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--wc-border)_90%,transparent)]">
        <span
          aria-hidden="true"
          className={clsx(
            "absolute inset-y-1 left-1 w-[calc(50%-0.125rem)] rounded-md transition-transform duration-250 ease-out",
            game === EGame.Poe2 ? "translate-x-full" : "translate-x-0",
            game === EGame.Poe1
              ? "bg-[oklch(45%_0.19_14)] shadow-[0_6px_18px_-10px_oklch(45%_0.19_14/0.9)]"
              : "bg-[oklch(48%_0.12_224)] shadow-[0_6px_18px_-10px_oklch(48%_0.12_224/0.95)]",
          )}
        />
        <div className="relative z-10 flex items-center">
          {Object.values(EGame).map((gameVersion) => {
            const isChecked = game === gameVersion;
            return (
              <button
                type="button"
                key={gameVersion}
                aria-pressed={isChecked}
                onClick={() => setGame(gameVersion)}
                className={clsx(
                  "h-8 min-w-16 px-3.5 flex items-center justify-center rounded-md text-sm font-semibold tracking-wide transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--wc-gold)",
                  isChecked
                    ? "text-[oklch(95%_0.02_85)]"
                    : "text-[color-mix(in_oklch,(--wc-text-60)_92%,transparent)]",
                )}
              >
                {gameVersion === EGame.Poe1 ? "PoE 1" : "PoE 2"}
              </button>
            );
          })}
        </div>
      </div>

      <Link
        to="/downloads"
        className="btn btn-primary h-9 shrink-0 gap-2 px-5 rounded-lg min-w-30 font-semibold tracking-wide shadow-md border-0"
      >
        <FiDownload />
        <span>Download</span>
      </Link>
    </div>
  );
}
