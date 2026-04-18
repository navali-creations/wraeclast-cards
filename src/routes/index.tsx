import { Button } from "@navali/fated-connections";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <main className="min-h-screen bg-base-200 text-base-content flex items-center justify-center p-8">
      <section className="card w-full max-w-3xl border border-base-100 bg-base-100 shadow-2xl">
        <div className="card-body gap-8">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-secondary">
              Wraeclast Cards
            </p>
            <h1 className="text-4xl font-bold text-primary">
              index.tsx is now using the coffee theme colors.
            </h1>
            <p className="max-w-2xl text-base text-base-content/75">
              The page below pulls from the primary, secondary, accent, neutral,
              and base tokens defined in index.css.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <article
              className="rounded-box border border-base-300 p-4"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-primary-content)",
              }}
            >
              <p className="text-xs uppercase tracking-[0.2em] opacity-70">
                Primary
              </p>
              <p className="mt-3 text-lg font-semibold">#8f3d9e</p>
            </article>

            <article
              className="rounded-box border border-base-300 p-4"
              style={{
                backgroundColor: "var(--color-secondary)",
                color: "var(--color-secondary-content)",
              }}
            >
              <p className="text-xs uppercase tracking-[0.2em] opacity-70">
                Secondary
              </p>
              <p className="mt-3 text-lg font-semibold">#d06cff</p>
            </article>

            <article
              className="rounded-box border border-base-300 p-4"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-accent-content)",
              }}
            >
              <p className="text-xs uppercase tracking-[0.2em] opacity-70">
                Accent
              </p>
              <p className="mt-3 text-lg font-semibold">#d43b87</p>
            </article>
          </div>

          <div className="rounded-box border border-base-300 bg-neutral text-neutral-content p-5">
            <p className="text-sm uppercase tracking-[0.2em] opacity-70">
              Neutral Surface
            </p>
            <p className="mt-2 text-base leading-7">
              This panel uses the neutral palette, while the page shell uses the
              base background tokens from index.css.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              className="btn"
              style={{ color: "var(--color-primary-content)" }}
            >
              Primary Token
            </Button>
            <Button
              variant="secondary"
              className="btn"
              style={{ color: "var(--color-secondary-content)" }}
            >
              Secondary Token
            </Button>
            <Button
              variant="accent"
              className="btn"
              style={{ color: "var(--color-accent-content)" }}
            >
              Accent Token
            </Button>
            <Button className="btn bg-base-100">Base Token</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
