import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <main className="min-h-screen bg-base-200 flex items-center justify-center p-8">
      <section className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-3xl">Wraeclast Cards</h1>
          <p className="text-base-content/80">
            TanStack Router and TanStack Query are configured.
          </p>
          <Outlet />
        </div>
      </section>
    </main>
  ),
});
