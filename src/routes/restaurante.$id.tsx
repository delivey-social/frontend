import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import useRestauranteDetails from "@/components/contexts/restaurante/hooks/useRestauranteDetails";
import type { components } from "@/api/types";
import useRestauranteImage from "@/components/contexts/restaurante/hooks/useRestauranteImage";
import useMenu from "@/components/contexts/restaurante/hooks/useMenu";
import MenuList from "@/components/contexts/restaurante/components/menu-list";

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
        <>
          <RestauranteDetails restaurante={restaurante} />
          <RestauranteMenu restaurante={restaurante} />
        </>
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

interface RestauranteDetailsProps {
  restaurante: components["schemas"]["Restaurante"];
}

function RestauranteDetails({ restaurante }: RestauranteDetailsProps) {
  const image = useRestauranteImage(restaurante.id);

  return (
    <section className="mt-8 flex gap-8 items-center">
      {image && (
        <img src={image} alt="" className="size-26 object-cover rounded-xl" />
      )}

      <div className="flex flex-col">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Cardápio
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950">
          {restaurante.nome}
        </h1>
      </div>
    </section>
  );
}

function RestauranteMenu({ restaurante }: RestauranteDetailsProps) {
  const { data: menu, error, isPending } = useMenu(restaurante.id);

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
        Cardápio
      </h2>

      {isPending && (
        <p className="mt-4 text-zinc-600">Carregando cardápio...</p>
      )}

      {error && (
        <p className="mt-4 text-red-700" role="alert">
          Não foi possível carregar o cardápio.{" "}
          {error instanceof Error && error.message}
        </p>
      )}

      {!isPending && !error && !menu && (
        <p className="mt-4 text-zinc-600">Cardápio não encontrado.</p>
      )}

      {menu && <MenuList menu={menu} />}
    </section>
  );
}
