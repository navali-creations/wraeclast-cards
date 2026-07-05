import { Outlet, useLocation } from "@tanstack/react-router";
import { Footer } from "../../components/footer/Footer";
import { Header } from "../../components/header/Header";

export function AppLayout() {
  const pathname = useLocation({
    select: (location) => location.pathname,
  });
  const isFullWidthRoute =
    pathname === "/soothsayer" || pathname.startsWith("/soothsayer/");
  const isHomepage = pathname === "/";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main
        className={`flex-1 flex flex-col${isHomepage ? " wc-page-gradient" : isFullWidthRoute ? "" : " bg-(--wc-header-bg)"}`}
      >
        <div
          className={
            isFullWidthRoute
              ? "flex-1 flex flex-col"
              : "flex-1 flex flex-col mx-auto w-full max-w-300 max-md:px-4 md:px-6 py-6"
          }
        >
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}
