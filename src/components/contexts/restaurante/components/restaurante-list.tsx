import type { components } from "@/api/types";

import { Link } from "@tanstack/react-router";
import { ArrowRight, UtensilsCrossed } from "lucide-react";

import useListRestaurantes from "../hooks/useListRestaurantes";
import useRestauranteImage from "../hooks/useRestauranteImage";

import placeholderImage from "@/assets/restaurant-placeholder.jpg";

export default function RestauranteList() {
  const { data } = useListRestaurantes();
  const restaurantes = data?.restaurantes ?? [];

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Descubra
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-950">
            Restaurantes
          </h2>
        </div>

        {restaurantes.length > 0 && (
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-600">
            {restaurantes.length}{" "}
            {restaurantes.length === 1 ? "opção" : "opções"}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {restaurantes.map((restaurante) => (
          <RestauranteList.Item
            restaurante={restaurante}
            key={restaurante.id}
          />
        ))}
      </div>

      {data && restaurantes.length === 0 && (
        <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 text-center">
          <UtensilsCrossed className="mb-3 size-8 text-zinc-400" />
          <p className="font-semibold text-zinc-800">
            Nenhum restaurante disponível
          </p>
        </div>
      )}
    </section>
  );
}

RestauranteList.Item = function RestauranteListItem({
  restaurante,
}: {
  restaurante: components["schemas"]["Restaurante"];
}) {
  const logoUrl = useRestauranteImage(restaurante.id);

  return (
    <Link
      key={restaurante.id}
      to={"/"}
      className="group relative flex min-h-44 flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_16px_40px_-20px_rgba(216,13,21,0.35)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/20"
    >
      <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />

      <div className="flex items-center gap-4">
        <div className="shrink-0 rounded-2xl bg-zinc-100 ring-1 ring-zinc-200/70">
          <img
            src={logoUrl ?? placeholderImage}
            alt=""
            className="size-18 object-cover rounded-xl"
          />
        </div>

        <h3 className="line-clamp-2 text-xl font-bold leading-tight tracking-tight text-zinc-950">
          {restaurante.nome}
        </h3>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-4">
        <span className="text-sm font-semibold text-zinc-600">
          Ver cardápio
        </span>
        <span className="flex size-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 transition-all duration-300 group-hover:bg-primary group-hover:text-white">
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
};
