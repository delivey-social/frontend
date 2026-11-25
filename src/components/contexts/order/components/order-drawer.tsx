import { useState } from "react";
import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useOrder } from "@/components/contexts/order/order-context";
import useMenuItemImage from "@/components/contexts/restaurante/hooks/useMenuItemImage";
import type { OrderItem } from "@/components/contexts/order/order-context";

type ActiveOrder = NonNullable<ReturnType<typeof useOrder>["order"]>;

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function OrderDrawer() {
  const { order } = useOrder();

  if (!order) return null;

  return <OrderDrawerPanel key={order.restauranteId} order={order} />;
}

function OrderDrawerPanel({ order }: { order: ActiveOrder }) {
  const [open, setOpen] = useState(false);
  const { addItem, removeItem, removeItemCompletely } = useOrder();
  const itemCount = order.items.reduce(
    (count, orderItem) => count + orderItem.quantity,
    0,
  );
  const total = order.items.reduce(
    (sum, orderItem) => sum + orderItem.item.preco * orderItem.quantity,
    0,
  );

  return (
    <Drawer open={open} onOpenChange={setOpen} swipeDirection="right">
      {!open && (
        <DrawerTrigger
          render={
            <Button
              className="fixed right-4 bottom-4 rounded-full shadow-lg px-6"
              size={"lg"}
            />
          }
        >
          <ShoppingBag />
          Ver pedido ({itemCount})
        </DrawerTrigger>
      )}
      <DrawerContent className="data-[swipe-direction=right]:[--drawer-inset:1rem] data-[swipe-direction=right]:h-[calc(100dvh-2rem)] data-[swipe-direction=right]:max-h-[calc(100dvh-2rem)] data-[swipe-direction=right]:w-[calc(100vw-2rem)] data-[swipe-direction=right]:max-w-md rounded-2xl shadow-xl">
        <DrawerHeader className="flex-row items-center justify-between px-5 pt-6 text-left">
          <div className="flex flex-col gap-1">
            <DrawerTitle className="text-xl">Seu pedido</DrawerTitle>
            <DrawerDescription>
              {itemCount} {itemCount === 1 ? "item" : "itens"} no carrinho
            </DrawerDescription>
          </div>
          <DrawerClose
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Fechar pedido"
              />
            }
          >
            <X aria-hidden="true" />
          </DrawerClose>
        </DrawerHeader>

        <ul className="flex-1 overflow-y-auto px-5 py-4">
          {order.items.map((orderItem) => (
            <OrderDrawerItem
              key={orderItem.item.id}
              orderItem={orderItem}
              restauranteId={order.restauranteId}
              onDecrease={() => removeItem(orderItem.item, order.restauranteId)}
              onIncrease={() => addItem(orderItem.item, order.restauranteId)}
              onRemove={() => removeItemCompletely(orderItem.item)}
            />
          ))}
        </ul>

        <DrawerFooter className="border-t px-5 pt-8 pb-6 gap-6">
          <div className="flex items-center justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <div className="flex gap-2">
            <DrawerClose
              render={
                <Button type="button" variant="ghost" className="flex-1">
                  Continuar comprando
                </Button>
              }
            />
            <Button
              render={<Link to="/checkout" />}
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Finalizar pedido
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

interface OrderDrawerItemProps {
  orderItem: OrderItem;
  restauranteId: string;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
}

function OrderDrawerItem({
  orderItem,
  restauranteId,
  onDecrease,
  onIncrease,
  onRemove,
}: OrderDrawerItemProps) {
  const image = useMenuItemImage(restauranteId, orderItem.item.id);

  return (
    <li className="flex items-center gap-2 border-b py-4 last:border-b-0">
      <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-muted-foreground">
        {image ? (
          <img src={image} alt="" className="size-full object-cover" />
        ) : (
          <UtensilsCrossed aria-hidden="true" />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate text-sm font-medium">
          {orderItem.item.nome}
        </span>
        <span className="text-sm text-muted-foreground">
          {formatCurrency(orderItem.item.preco)}
        </span>
      </div>

      <div
        className="flex shrink-0 items-center gap-1"
        role="group"
        aria-label={`Quantidade de ${orderItem.item.nome}`}
      >
        <Button
          type="button"
          variant="outline"
          size="icon-xs"
          onClick={onDecrease}
          aria-label={`Remover uma unidade de ${orderItem.item.nome}`}
        >
          <Minus aria-hidden="true" />
        </Button>
        <span className="min-w-5 text-center text-sm tabular-nums">
          {orderItem.quantity}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon-xs"
          onClick={onIncrease}
          aria-label={`Adicionar uma unidade de ${orderItem.item.nome}`}
        >
          <Plus aria-hidden="true" />
        </Button>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={onRemove}
        aria-label={`Remover ${orderItem.item.nome} do pedido`}
      >
        <Trash2 aria-hidden="true" />
      </Button>
    </li>
  );
}
