import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { apiClient } from "@/api/client";
import type { components } from "@/api/types";
import { useEffect, useState } from "react";
import RestauranteList from "@/components/contexts/restaurante/components/restaurante-list";

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
