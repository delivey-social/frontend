import { apiClient } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function useMenuItemImage(
  restauranteId: string,
  itemId: string,
) {
  const logoQuery = useQuery({
    queryKey: ["restaurant-logo", itemId],
    queryFn: () =>
      apiClient.request("/menu/{restaurante_id}/{item_id}/image", "get", {
        path: { item_id: itemId, restaurante_id: restauranteId },
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
