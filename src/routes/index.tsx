import { createFileRoute } from "@tanstack/react-router";
import RestauranteList from "@/components/contexts/restaurante/components/restaurante-list";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="max-w-7xl mx-auto w-full py-20">
      <RestauranteList />
    </div>
  );
}
