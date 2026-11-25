import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useReducer,
  type ReactNode,
} from "react";
import type { components } from "@/api/types";
import { Button } from "@/components/ui/button";
import RestaurantConflictAlert from "./components/restaurant-conflict-alert";

interface Order {
  restauranteId: string;
  items: OrderItem[];
}

interface OrderState {
  order: Order | null;
  restaurantConflict: {
    item: components["schemas"]["MenuItem"];
    restauranteId: string;
  } | null;
}

type OrderAction =
  | {
      type: "add-item";
      item: components["schemas"]["MenuItem"];
      restauranteId: string;
    }
  | {
      type: "replace-order";
      item: components["schemas"]["MenuItem"];
      restauranteId: string;
    }
  | { type: "remove-item"; item: components["schemas"]["MenuItem"] }
  | {
      type: "remove-item-completely";
      item: components["schemas"]["MenuItem"];
    };

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
  removeItemCompletely: (item: components["schemas"]["MenuItem"]) => void;
}

const OrderContext = createContext<OrderContextValue | null>(null);

function orderReducer(state: OrderState, action: OrderAction): OrderState {
  if (action.type === "replace-order") {
    return {
      order: {
        restauranteId: action.restauranteId,
        items: [{ item: action.item, quantity: 1 }],
      },
      restaurantConflict: null,
    };
  }

  if (action.type === "add-item") {
    if (state.order && state.order.restauranteId !== action.restauranteId) {
      return {
        ...state,
        restaurantConflict: {
          item: action.item,
          restauranteId: action.restauranteId,
        },
      };
    }

    if (!state.order) {
      return {
        order: {
          restauranteId: action.restauranteId,
          items: [{ item: action.item, quantity: 1 }],
        },
        restaurantConflict: null,
      };
    }

    const existing = state.order.items.find(
      (orderItem) => orderItem.item.id === action.item.id,
    );

    return {
      order: existing
        ? {
            ...state.order,
            items: state.order.items.map((orderItem) =>
              orderItem === existing
                ? { ...orderItem, quantity: orderItem.quantity + 1 }
                : orderItem,
            ),
          }
        : {
            ...state.order,
            items: [...state.order.items, { item: action.item, quantity: 1 }],
          },
      restaurantConflict: null,
    };
  }

  if (action.type === "remove-item") {
    if (!state.order) throw new Error("No order to remove item from");

    const existing = state.order.items.find(
      (orderItem) => orderItem.item.id === action.item.id,
    );

    if (!existing) throw new Error("Item not found in order");

    if (existing.quantity > 1) {
      return {
        ...state,
        order: {
          ...state.order,
          items: state.order.items.map((orderItem) =>
            orderItem === existing
              ? { ...orderItem, quantity: orderItem.quantity - 1 }
              : orderItem,
          ),
        },
      };
    }

    const items = state.order.items.filter(
      (orderItem) => orderItem !== existing,
    );
    return {
      ...state,
      order: items.length > 0 ? { ...state.order, items } : null,
    };
  }

  if (!state.order) throw new Error("No order to remove item from");

  const items = state.order.items.filter(
    (orderItem) => orderItem.item.id !== action.item.id,
  );
  return {
    ...state,
    order: items.length > 0 ? { ...state.order, items } : null,
  };
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(orderReducer, {
    order: null,
    restaurantConflict: null,
  });
  const { order, restaurantConflict } = state;

  useEffect(() => {
    console.log("Current order:", order);
  }, [order]);

  const addItem = useCallback(
    (item: components["schemas"]["MenuItem"], restauranteId: string) => {
      dispatch({ type: "add-item", item, restauranteId });
    },
    [],
  );

  const removeItem = useCallback((item: components["schemas"]["MenuItem"]) => {
    dispatch({ type: "remove-item", item });
  }, []);

  const removeItemCompletely = useCallback(
    (item: components["schemas"]["MenuItem"]) => {
      dispatch({ type: "remove-item-completely", item });
    },
    [],
  );

  const value = useMemo(
    () => ({ order, addItem, removeItem, removeItemCompletely }),
    [order, addItem, removeItem, removeItemCompletely],
  );

  return (
    <OrderContext.Provider value={value}>
      {children}
      {restaurantConflict && (
        <RestaurantConflictAlert
          onActionClick={() =>
            dispatch({ type: "replace-order", ...restaurantConflict })
          }
        />
      )}
    </OrderContext.Provider>
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
