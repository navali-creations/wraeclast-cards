import { createFileRoute } from "@tanstack/react-router";
import { Heading } from "../../../../components/headings";

export const Route = createFileRoute("/$game/$league/cards/$cardId")({
  component: CardDetailsPage,
});

function CardDetailsPage() {
  const { cardId } = Route.useParams();

  return (
    <div className="space-y-4">
      <Heading as="h1">Card Details</Heading>
      <p>Card ID: {cardId}</p>
    </div>
  );
}
