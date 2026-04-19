import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/cards/")({
  component: CardsPage,
});

function CardsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Cards</h1>
      <p>This is the cards placeholder page.</p>

      <div>
        <Link to="/cards/$cardId" params={{ cardId: "example-card" }}>
          Open example card
        </Link>
      </div>
    </div>
  );
}
