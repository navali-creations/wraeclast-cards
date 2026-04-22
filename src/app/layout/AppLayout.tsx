import { Link, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { footerNavigation, mainNavigation } from "../../config/navigation";

export function AppLayout() {
  const [game, setGame] = useState<"poe1" | "poe2">("poe1");

  useEffect(() => {
    if (game === "poe2") {
      document.documentElement.classList.add("poe2");
    } else {
      document.documentElement.classList.remove("poe2");
    }
  }, [game]);

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      {/* Header */}
      <header
        style={{
          backgroundColor: "var(--wc-nav-bg)",
          borderBottom: "1px solid var(--wc-border)",
        }}
      >
        <div className="mx-auto max-w-12xl px-6 h-16 grid grid-flow-col auto-cols-max items-center justify-center gap-10">
          {/* Logo */}
          <Link
            to="/"
            className="font-cinzel text-lg font-bold tracking-widest uppercase shrink-0"
            style={{ color: "var(--wc-gold)" }}
          >
            Wraeclast
            <span style={{ color: "var(--color-primary)" }}>.</span>
            Cards
          </Link>

          {/* Game version toggle */}
          <div
            className="relative shrink-0 rounded-lg p-1"
            style={{
              backgroundColor:
                "color-mix(in oklch, var(--wc-card-darker) 88%, black)",
              boxShadow:
                "inset 0 0 0 1px color-mix(in oklch, var(--wc-border) 90%, transparent)",
            }}
          >
            <span
              aria-hidden="true"
              className={`absolute inset-y-1 w-[calc(50%-0.125rem)] rounded-md transition-transform duration-250 ease-out ${game === "poe2" ? "translate-x-full" : "translate-x-0"}`}
              style={{
                left: "0.25rem",
                backgroundColor:
                  game === "poe1"
                    ? "oklch(45% 0.19 14)"
                    : "oklch(48% 0.12 224)",
                boxShadow:
                  game === "poe1"
                    ? "0 6px 18px -10px oklch(45% 0.19 14 / 0.9)"
                    : "0 6px 18px -10px oklch(48% 0.12 224 / 0.95)",
              }}
            />
            <div className="relative z-10 flex items-center">
              <button
                type="button"
                onClick={() => setGame("poe1")}
                className="h-8 min-w-16 px-3.5 rounded-md text-sm font-semibold tracking-wide transition-colors duration-200 cursor-pointer"
                style={{
                  color:
                    game === "poe1"
                      ? "oklch(95% 0.02 85)"
                      : "color-mix(in oklch, var(--wc-text-60) 92%, transparent)",
                }}
              >
                PoE 1
              </button>
              <button
                type="button"
                onClick={() => setGame("poe2")}
                className="h-8 min-w-16 px-3.5 rounded-lg text-sm font-semibold tracking-wide transition-colors duration-200 cursor-pointer"
                style={{
                  color:
                    game === "poe2"
                      ? "oklch(95% 0.02 85)"
                      : "color-mix(in oklch, var(--wc-text-60) 92%, transparent)",
                }}
              >
                PoE 2
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav aria-label="Main navigation" className="shrink-0">
            <ul className="flex items-center gap-6">
              {mainNavigation.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm transition-colors"
                    style={{ color: "var(--wc-text-60)" }}
                    activeProps={{
                      style: { color: "var(--wc-text-90)" },
                    }}
                  >
                    {item.label}
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
              transition-all duration-500 ease-in-out
              hover:scale-[1.05]
              before:content-['']
              before:absolute
              before:top-[-50%]
              before:left-[-50%]
              before:w-[200%]
              before:h-[200%]
              before:bg-[linear-gradient(0deg,transparent,transparent_30%,rgba(252,250,250,0.3))]
              before:-rotate-45
              before:opacity-0
              before:transition-all
              before:duration-500
              before:ease-in-out
              before:pointer-events-none
              before:z-0
              hover:before:opacity-100
              hover:before:translate-y-full
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <title>Download icon</title>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
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
      <footer
        style={{
          backgroundColor: "var(--wc-nav-bg)",
          borderTop: "1px solid var(--wc-border)",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 py-4 text-center text-sm">
          <p style={{ color: "var(--wc-text-50)" }}>
            © {new Date().getFullYear()} Wraeclast Cards
          </p>
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap justify-center gap-3 mt-1">
              {footerNavigation.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="link link-hover"
                    style={{ color: "var(--wc-text-50)" }}
                    activeProps={{
                      style: { color: "var(--wc-text-80)" },
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
