import { createFileRoute, Link } from "@tanstack/react-router";
import useListRestaurantes from "@/components/contexts/restaurante/hooks/useListRestaurantes";

export const Route = createFileRoute("/restaurante/$id")({
  component: RestauranteRoute,
});

// eslint-disable-next-line react-refresh/only-export-components
function RestauranteRoute() {
  const { id } = Route.useParams();
  const { data, error, isPending } = useListRestaurantes();
  const restaurante = data?.restaurantes.find(
    (item) => item.id === id,
  );

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12">
      <Link
        to="/"
        className="text-sm font-semibold text-primary hover:underline"
      >
        Voltar para restaurantes
      </Link>

      {isPending && (
        <p className="mt-8 text-zinc-600">Carregando restaurante...</p>
      )}

      {error && (
        <p className="mt-8 text-red-700" role="alert">
          Não foi possível carregar o restaurante.
        </p>
      )}

      {!isPending && !error && !restaurante && (
        <p className="mt-8 text-zinc-600">Restaurante não encontrado.</p>
      )}

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
