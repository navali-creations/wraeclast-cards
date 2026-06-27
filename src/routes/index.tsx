import { createFileRoute } from "@tanstack/react-router";
import { HomepagePage } from "../features/homepage/routes/homepage";

export const Route = createFileRoute("/")({
  component: HomepagePage,
});
