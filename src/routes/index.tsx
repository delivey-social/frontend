import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div className="max-w-7xl mx-auto w-full py-20">Hello "/"!</div>;
}
