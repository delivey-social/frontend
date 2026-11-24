import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { apiClient } from "@/api/client";
import type { components } from "@/api/types";
import { useEffect, useState } from "react";

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

function RestauranteList() {
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

function useListRestaurantes() {
  return useQuery({
    queryKey: ["restaurantes"],
    queryFn: async () => {
      return await apiClient.request("/restaurante/", "get");
    },
  });
}

function useRestauranteImage(restauranteId: string) {
  const logoQuery = useQuery({
    queryKey: ["restaurant-logo", restauranteId],
    queryFn: () =>
      apiClient.request("/restaurante/{restaurante_id}/logo", "get", {
        path: { restaurante_id: restauranteId },
      }),
  });
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!logoQuery.data) return;

    if (logoQuery.data instanceof Blob) {
      const url = URL.createObjectURL(logoQuery.data);
      setLogoUrl(url);
      return () => URL.revokeObjectURL(url);
    }

    if (typeof logoQuery.data === "string") setLogoUrl(logoQuery.data);
  }, [logoQuery.data]);

  return logoUrl;
}
