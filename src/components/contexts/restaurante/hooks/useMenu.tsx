import { apiClient } from "@/api";
import { useQuery } from "@tanstack/react-query";

export default function useMenu(restauranteId: string) {
  return useQuery({
    queryKey: ["menu", restauranteId],
    queryFn: async () => {
      return await apiClient.request("/menu/{restaurante_id}", "get", {
        path: { restaurante_id: restauranteId },
      });
    },
  });
}
