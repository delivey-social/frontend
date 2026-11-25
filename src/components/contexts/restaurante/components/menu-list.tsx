import type { components } from "@/api/types";

import { Button } from "@/components/ui/button";
import { Minus, Plus, UtensilsCrossed } from "lucide-react";

import useMenuItemImage from "../hooks/useMenuItemImage";

import { useState } from "react";

interface MenuListProps {
  menu: components["schemas"]["GetMenuResponse"];
}

export default function MenuList({ menu }: MenuListProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  function increaseQuantity(itemId: string) {
    setQuantities((current) => ({
      ...current,
      [itemId]: (current[itemId] ?? 0) + 1,
    }));
  }

  function decreaseQuantity(itemId: string) {
    setQuantities((current) => ({
      ...current,
      [itemId]: Math.max(0, (current[itemId] ?? 0) - 1),
    }));
  }

  return (
    <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {menu.itens.map((item) => (
        <MenuList.Item
          key={item.id}
          item={item}
          quantity={quantities[item.id] ?? 0}
          onIncrease={() => increaseQuantity(item.id)}
          onDecrease={() => decreaseQuantity(item.id)}
          restauranteId={menu.restaurante_id}
        />
      ))}
    </ul>
  );
}

interface MenuListItemProps {
  item: components["schemas"]["MenuItem"];
  restauranteId: string;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

MenuList.Item = ({
  item,
  quantity,
  restauranteId,
  onIncrease,
  onDecrease,
}: MenuListItemProps) => {
  const image = useMenuItemImage(restauranteId, item.id);

  return (
    <li
      className={`flex min-h-24 items-center gap-3 rounded-xl border p-3 transition-colors ${
        quantity > 0
          ? "border-primary/30 bg-primary/3"
          : "border-zinc-200 bg-white"
      }`}
    >
      <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500">
        {image ? (
          <img src={image} alt="" className="size-14 rounded-lg object-cover" />
        ) : (
          <UtensilsCrossed className="size-6" aria-hidden="true" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 font-semibold leading-snug text-zinc-950">
          {item.nome}
        </p>
        <p className="mt-1 text-sm font-medium text-zinc-600">
          {item.preco.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
      </div>

      {quantity === 0 ? (
        <Button
          type="button"
          size="icon-sm"
          variant="outline"
          className="shrink-0 border-primary/20 text-primary hover:bg-primary/5 hover:text-primary"
          onClick={onIncrease}
          aria-label={`Adicionar ${item.nome}`}
        >
          <Plus aria-hidden="true" />
        </Button>
      ) : (
        <div
          className="flex shrink-0 items-center gap-1"
          role="group"
          aria-label={`Quantidade de ${item.nome}`}
        >
          <Button
            type="button"
            size="icon-sm"
            variant="outline"
            onClick={onDecrease}
            aria-label={`Remover uma unidade de ${item.nome}`}
          >
            <Minus aria-hidden="true" />
          </Button>
          <span className="min-w-6 text-center text-sm font-semibold tabular-nums">
            {quantity}
          </span>
          <Button
            type="button"
            size="icon-sm"
            variant="outline"
            className="border-primary/20 text-primary hover:bg-primary/5 hover:text-primary"
            onClick={onIncrease}
            aria-label={`Adicionar ${item.nome}`}
          >
            <Plus aria-hidden="true" />
          </Button>
        </div>
      )}
    </li>
  );
};
