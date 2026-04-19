import { Button } from "@navali/fated-connections";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return <h1 className="text-3xl font-bold">Home</h1>;
}
