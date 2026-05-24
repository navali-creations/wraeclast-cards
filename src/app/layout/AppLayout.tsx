import { Outlet, useLocation } from "@tanstack/react-router";
import clsx from "clsx";
import { Footer } from "../../components/footer/Footer";
import { Header } from "../../components/header/Header";

export function AppLayout() {
  const pathname = useLocation({
    select: (location) => location.pathname,
  });
  const isFullWidthRoute = pathname === "/soothsayer/auth";

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      <Header />

      {/* Main content */}
      <main className={clsx("flex-1 bg-base-200", isFullWidthRoute && "flex")}>
        <div
          className={
            isFullWidthRoute ? "flex-1" : "mx-auto max-w-300 px-4 py-6"
          }
        >
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}
