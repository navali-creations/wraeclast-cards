import { Link, Outlet } from "@tanstack/react-router";
import clsx from "clsx";
import { Header } from "../../components/header/Header";
import { footerNavigation } from "../../config/navigation";

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      <Header />

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
                      item.active && "text-(--wc-text-80)!",
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
