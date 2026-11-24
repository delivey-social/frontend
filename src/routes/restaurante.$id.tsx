import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import useRestauranteDetails from "@/components/contexts/restaurante/hooks/useRestauranteDetails";

export const Route = createFileRoute("/restaurante/$id")({
  component: RestauranteRoute,
});

// eslint-disable-next-line react-refresh/only-export-components
function RestauranteRoute() {
  const { id } = Route.useParams();
  const { data: restaurante, error, isPending } = useRestauranteDetails(id);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12">
      <Link
        to="/"
        className="text-sm font-semibold text-primary hover:underline flex items-center gap-2"
      >
        <Button size={"icon"} variant={"ghost"}>
          <ArrowLeft />
        </Button>
        Voltar para restaurantes
      </Link>

      {isPending && <RestauranteRoute.Loading />}

      {error && <RestauranteRoute.Error error={error} />}

      {!isPending && !error && !restaurante && <RestauranteRoute.NotFound />}

      {restaurante && (
        <section className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Cardápio
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950">
            {restaurante.nome}
          </h1>
        </section>
      )}
    </main>
  );
}

RestauranteRoute.Loading = () => {
  return <p className="mt-8 text-zinc-600">Carregando restaurante...</p>;
};

RestauranteRoute.Error = ({ error }: { error: unknown }) => {
  return (
    <p className="mt-8 text-red-700" role="alert">
      Não foi possível carregar o restaurante.{" "}
      {error instanceof Error && error.message}
    </p>
  );
};

RestauranteRoute.NotFound = () => {
  return <p className="mt-8 text-zinc-600">Restaurante não encontrado.</p>;
};
