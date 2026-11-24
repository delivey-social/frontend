import { apiClient } from "@/api";
import { useQuery } from "@tanstack/react-query";

export default function useRestauranteDetails(id: string) {
  return useQuery({
    queryKey: ["restaurante", id],
    queryFn: async () => {
      return await apiClient.request("/restaurante/{restaurante_id}", "get", {
        path: {
          restaurante_id: id,
        },
      });
    },
  });
}
