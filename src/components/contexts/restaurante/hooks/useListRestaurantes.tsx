import { apiClient } from "@/api";
import { useQuery } from "@tanstack/react-query";

export default function useListRestaurantes() {
  return useQuery({
    queryKey: ["restaurantes"],
    queryFn: async () => {
      return await apiClient.request("/restaurante/", "get");
    },
  });
}
