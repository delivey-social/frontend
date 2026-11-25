import { Button } from "@/components/ui/button";

interface RestaurantConflictAlertProps {
  onActionClick: () => void;
}

export default function RestaurantConflictAlert({
  onActionClick,
}: RestaurantConflictAlertProps) {
  return (
    <div
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-xl flex-col items-start gap-4 rounded-lg border border-destructive/30 bg-background p-4 shadow-lg animate-in slide-in-from-bottom-4 duration-300 sm:flex-row sm:items-center sm:justify-between"
      role="alert"
    >
      <p className="text-sm">
        O carrinho contém itens de outro restaurante. Limpe-o para continuar.
      </p>

      <Button type="button" className="shrink-0" onClick={onActionClick}>
        Limpar carrinho e adicionar
      </Button>
    </div>
  );
}
