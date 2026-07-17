import { createFileRoute } from "@tanstack/react-router";
import { CardDetailsPage } from "../../../../features/cards/routes";

export const Route = createFileRoute("/$game/$league/cards/$cardId")({
  component: CardDetailsPage,
});
