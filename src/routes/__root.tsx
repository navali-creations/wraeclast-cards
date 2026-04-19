import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-base-200">
      <header className="border-b border-base-300 bg-base-100">
        <nav className="mx-auto flex max-w-5xl gap-4 p-4">
          <Link from="/" to="/" className="[&.active]:font-bold">
            Home
          </Link>
          <Link from="/" to="/cards" className="[&.active]:font-bold">
            Cards
          </Link>
          <Link from="/" to="/stacked-decks" className="[&.active]:font-bold">
            Stacked Decks
          </Link>
          <Link from="/" to="/soothsayer" className="[&.active]:font-bold">
            Soothsayer
          </Link>
          <Link from="/" to="/downloads" className="[&.active]:font-bold">
            Downloads
          </Link>
          <Link from="/" to="/attributions" className="[&.active]:font-bold">
            Attributions
          </Link>
          <Link from="/" to="/privacy-policy" className="[&.active]:font-bold">
            Privacy Policy
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl p-6">
        <Outlet />
      </main>
    </div>
  );
}
