import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { OrderProvider } from "@/components/contexts/order/order-context";
import OrderDrawer from "@/components/contexts/order/components/order-drawer";

export interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <OrderProvider>
      <Layout />
      <Outlet />
    </OrderProvider>
  ),
});

function Layout() {
  return (
    <>
      <Header />
      <OrderDrawer />
    </>
  );
}
