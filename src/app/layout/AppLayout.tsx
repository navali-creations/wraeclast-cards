import { Link, Outlet } from "@tanstack/react-router";

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      {/* Header */}
      <header className="bg-base-100 border-b border-base-300">
        <div className="mx-auto max-w-5x1 px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Wraeclast Cards</h1>
          {/* Navigation */}
          <nav className="flex gap-4 text-sm">
            <Link to="/" className="[&.active]:font-bold">
              Home
            </Link>
            <Link to="/cards" className="[&.active]:font-bold">
              Cards
            </Link>
            <Link to="/stacked-decks" className="[&.active]:font-bold">
              Decks
            </Link>
            <Link to="/downloads" className="[&.active]:font-bold">
              Downloads
            </Link>
          </nav>
        </div>
      </header>
      {/* Main content */}
      <main className="flex-1 bg-base-200 text-base-100">
        <div className="mx-auto max-w-5x1 px-4 py-6">
          <Outlet />
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-base-100 border-t border-base-300">
        <div className="mx-auto max-w-5x1 px-4 py-4 text-center text-sm">
          &copy; {new Date().getFullYear()} Wraeclast Cards. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
}
