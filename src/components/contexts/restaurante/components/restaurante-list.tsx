import type { components } from "@/api/types";
import { Link } from "@tanstack/react-router";

import useListRestaurantes from "../hooks/useListRestaurantes";
import useRestauranteImage from "../hooks/useRestauranteImage";

export default function RestauranteList() {
  const { data } = useListRestaurantes();

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-3xl font-bold">Restaurantes</h2>

      <div className="grid grid-cols-3 gap-4">
        {data?.restaurantes.map((restaurante) => (
          <RestauranteList.Item
            restaurante={restaurante}
            key={restaurante.id}
          />
        ))}
      </div>
    </div>
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
      className="p-4 border rounded-md bg-zinc-100 hover:bg-zinc-200 transition-colors flex gap-4 items-center"
    >
      <img
        src={logoUrl ?? "/images/restaurant-placeholder.png"}
        alt={restaurante.nome}
        className="w-16 aspect-square object-cover rounded-full my-auto h-16"
      />
      <h3 className="text-lg font-semibold">{restaurante.nome}</h3>
    </Link>
  );
};
