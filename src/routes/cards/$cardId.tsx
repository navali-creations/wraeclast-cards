import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cards/$cardId")({
  component: CardDetailsPage,
});

function CardDetailsPage() {
  const { cardId } = Route.useParams();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Card Details</h1>
      <p>Card ID: {cardId}</p>
    </div>
  );
}
