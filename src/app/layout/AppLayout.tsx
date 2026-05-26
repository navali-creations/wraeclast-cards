import { Outlet, useLocation } from "@tanstack/react-router";
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

      <main className="flex-1 flex flex-col">
        <div
          className={
            isFullWidthRoute
              ? "flex-1 flex flex-col"
              : "flex-1 flex flex-col mx-auto w-full max-w-300 px-4 py-6"
          }
        >
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}
