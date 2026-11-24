import { apiClient } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function useRestauranteImage(restauranteId: string) {
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
