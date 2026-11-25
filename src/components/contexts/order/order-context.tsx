import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { components } from "@/api/types";

interface Order {
  restauranteId: string;
  items: OrderItem[];
}

export interface OrderItem {
  item: components["schemas"]["MenuItem"];
  quantity: number;
}

interface OrderContextValue {
  order: Order | null;
  addItem: (
    item: components["schemas"]["MenuItem"],
    restauranteId: string,
  ) => void;
  removeItem: (
    item: components["schemas"]["MenuItem"],
    restauranteId: string,
  ) => void;
}

const OrderContext = createContext<OrderContextValue | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    console.log("Current order:", order);
  }, [order]);

  const addItem = useCallback(
    (item: components["schemas"]["MenuItem"], restauranteId: string) => {
      setOrder((current) => {
        if (!current) {
          return { restauranteId, items: [{ item, quantity: 1 }] };
        }

        const existing = current.items.find(
          (orderItem) => orderItem.item.id === item.id,
        );

        if (existing) {
          return {
            restauranteId: current.restauranteId,
            items: current.items.map((orderItem) => {
              if (orderItem === existing) {
                return { ...orderItem, quantity: orderItem.quantity + 1 };
              }

              return orderItem;
            }),
          };
        }

        return {
          restauranteId: current.restauranteId,
          items: [...current.items, { item, quantity: 1 }],
        };
      });
    },
    [],
  );

  const removeItem = useCallback((item: components["schemas"]["MenuItem"]) => {
    setOrder((current) => {
      if (!current) throw new Error("No order to remove item from");

      const existing = current.items.find(
        (orderItem) => orderItem.item.id === item.id,
      );

      if (!existing) throw new Error("Item not found in order");

      if (existing.quantity > 1) {
        return {
          restauranteId: current.restauranteId,
          items: current.items.map((orderItem) =>
            orderItem === existing
              ? { ...orderItem, quantity: orderItem.quantity - 1 }
              : orderItem,
          ),
        };
      }

      return {
        restauranteId: current.restauranteId,
        items: current.items.filter((orderItem) => orderItem !== existing),
      };
    });
  }, []);

  const value = useMemo(
    () => ({ order, addItem, removeItem }),
    [order, addItem, removeItem],
  );

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
}
