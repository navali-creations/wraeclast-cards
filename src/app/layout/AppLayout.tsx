import { Link, Outlet } from "@tanstack/react-router";
import clsx from "clsx";
import { useContext } from "react";
import { FiChevronDown, FiDownload } from "react-icons/fi";
import { footerNavigation, mainNavigation } from "../../config/navigation";
import { EGame } from "../../enums";
import { GameContext } from "../game-context";

export function AppLayout() {
  const { game, handleGameToggle } = useContext(GameContext);

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      {/* Header */}
      <header className="bg-(--wc-nav-bg) border-b border-(--wc-border)">
        <div className="navbar mx-auto max-w-300 px-4">
          {/* Mobile: hamburger + Logo */}
          <div className="navbar-start">
            <div className="dropdown">
              <button
                type="button"
                tabIndex={0}
                className="btn btn-ghost lg:hidden"
              >
                <FiChevronDown />
              </button>
              <ul
                tabIndex={-1}
                className="menu menu-sm dropdown-content bg-(--wc-nav-bg) border border-(--wc-border) rounded-box z-10 mt-3 w-52 p-2 shadow"
              >
                {mainNavigation.map((item) => (
                  <li key={item?.path}>
                    <Link to={item?.path}>{item?.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Logo */}
            <Link
              to="/"
              className={clsx(
                "btn btn-ghost font-cinzel text-lg font-bold tracking-widest uppercase text-(--wc-gold) px-2",
              )}
            >
              Wraeclast<span className="text-(--color-primary)">.</span>Cards
            </Link>
          </div>

          {/* Desktop: nav links */}
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
              {mainNavigation.map((item) => (
                <li key={item?.path}>
                  <Link
                    to={item.path}
                    className="text-sm text-(--wc-text-60)"
                    activeProps={{ className: "text-(--wc-text-90)!" }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Game version toggle + Download */}
          <div className="navbar-end gap-3">
            {/* Game version toggle */}
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
                {Object.values(EGame).map((v) => (
                  <label
                    key={v}
                    className={clsx(
                      "h-8 min-w-16 px-3.5 flex items-center justify-center rounded-md text-sm font-semibold tracking-wide transition-colors duration-200 cursor-pointer",
                      game === v
                        ? "text-[oklch(95%_0.02_85)]"
                        : "text-[color-mix(in_oklch,(--wc-text-60)_92%,transparent)]",
                    )}
                  >
                    <input
                      type="radio"
                      name="game-version"
                      className="sr-only theme-controller"
                      value={v}
                      checked={game === v}
                      onChange={handleGameToggle}
                    />
                    {v === EGame.Poe1 ? "PoE 1" : "PoE 2"}
                  </label>
                ))}
              </div>
            </div>

            {/* Download button */}
            <Link
              to="/downloads"
              className={clsx(
                "btn btn-primary h-9 shrink-0 gap-2 px-5 rounded-lg min-w-30 font-semibold tracking-wide shadow-md border-0",
              )}
            >
              <FiDownload />
              <span>Download</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 bg-base-200">
        <div className="mx-auto max-w-300 px-4 py-6">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-(--wc-nav-bg) border-t border-(--wc-border)">
        <div className="mx-auto max-w-300 px-4 py-4 text-center text-sm">
          <p className="text-(--wc-text-50)">
            © {new Date().getFullYear()} Wraeclast Cards
          </p>
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap justify-center gap-3 mt-1">
              {footerNavigation.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={clsx(
                      "link link-hover text-(--wc-text-50)",
                      item.active ? "text-(--wc-text-80)!" : "",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
}
