import { Link, Outlet } from "@tanstack/react-router";
import { FiDownload } from "react-icons/fi";
import { footerNavigation, mainNavigation } from "../../config/navigation";
import { useGame } from "../game-context";

export function AppLayout() {
  const { game, setGame } = useGame();

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      {/* Header */}
      <header className="bg-(--wc-nav-bg) border-b border-(--wc-border)">
        <div className="mx-auto max-w-12xl px-6 h-16 grid grid-flow-col auto-cols-max items-center justify-center gap-10">
          {/* Logo */}
          <Link
            to="/"
            className="font-cinzel text-lg font-bold tracking-widest uppercase shrink-0 text-(--wc-gold)"
          >
            Wraeclast
            <span className="text-(--color-primary)">.</span>
            Cards
          </Link>

          {/* Game version toggle */}
          <div className="relative shrink-0 rounded-lg p-1 bg-[color-mix(in_oklch,var(--wc-card-darker)_88%,black)] shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--wc-border)_90%,transparent)]">
            <span
              aria-hidden="true"
              className={`absolute inset-y-1 left-1 w-[calc(50%-0.125rem)] rounded-md transition-transform duration-250 ease-out ${game === "poe2" ? "translate-x-full" : "translate-x-0"} ${game === "poe1" ? "bg-[oklch(45%_0.19_14)] shadow-[0_6px_18px_-10px_oklch(45%_0.19_14/0.9)]" : "bg-[oklch(48%_0.12_224)] shadow-[0_6px_18px_-10px_oklch(48%_0.12_224/0.95)]"}`}
            />
            <div className="relative z-10 flex items-center">
              {(["poe1", "poe2"] as const).map((v) => (
                <label
                  key={v}
                  className={`h-8 min-w-16 px-3.5 flex items-center justify-center rounded-md text-sm font-semibold tracking-wide transition-colors duration-200 cursor-pointer ${game === v ? "text-[oklch(95%_0.02_85)]" : "text-[color-mix(in_oklch,(--wc-text-60)_92%,transparent)]"}`}
                >
                  <input
                    type="radio"
                    name="game-version"
                    className="sr-only theme-controller"
                    value={v}
                    checked={game === v}
                    onChange={() => setGame(v)}
                  />
                  {v === "poe1" ? "PoE 1" : "PoE 2"}
                </label>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <nav aria-label="Main navigation" className="shrink-0">
            <ul className="flex items-center gap-6">
              {mainNavigation.filter(Boolean).map((item) => (
                <li key={item?.path}>
                  <Link
                    to={item?.path}
                    className="text-sm transition-colors text-(--wc-text-60)"
                    activeProps={{
                      className: "text-(--wc-text-90)!",
                    }}
                  >
                    {item?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Download button */}
          <div className="shrink-0 min-w-110 flex justify-end">
            <Link
              to="/downloads"
              className="
              relative isolate overflow-hidden
              btn btn-primary
              h-9 shrink-0 gap-2 px-5 rounded-lg min-w-30
              font-semibold tracking-wide
              shadow-md border-0
              transition-all duration-500 ease-in-out"
            >
              <FiDownload />
              <span className="relative z-10">Download</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 bg-base-200">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-(--wc-nav-bg) border-t border-(--wc-border)">
        <div className="mx-auto max-w-7xl px-6 py-4 text-center text-sm">
          <p className="text-(--wc-text-50)">
            © {new Date().getFullYear()} Wraeclast Cards
          </p>
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap justify-center gap-3 mt-1">
              {footerNavigation.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="link link-hover text-(--wc-text-50)"
                    activeProps={{
                      className: "text-(--wc-text-80)!",
                    }}
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
