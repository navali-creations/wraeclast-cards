import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/stacked-decks")({
  component: StackedDecksPage,
});

function StackedDecksPage() {
  return <h1 className="text-2xl font-bold">Stacked Decks</h1>;
}
