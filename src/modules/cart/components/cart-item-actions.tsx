"use client";

import { useTransition } from "react";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/button";
import { removeCartItem, updateCartItemQuantity } from "@/modules/cart/actions";

interface CartItemActionsProps {
  itemId: string;
  quantity: number;
  className?: string;
  maxStock?: number;
}

/**
 * UI Component (client) untuk mengubah jumlah item di keranjang.
 * Hanya memanggil Server Actions dari `modules/cart/actions`.
 */
export const CartItemActions = ({ itemId, quantity, className }: CartItemActionsProps) => {
  const [isPending, startTransition] = useTransition();

  const handleUpdate = (newQty: number) => {
    startTransition(async () => {
      try {
        await updateCartItemQuantity(itemId, newQty);
      } catch (error) {
        toast.error("Gagal mengubah jumlah.");
        console.error(error);
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await removeCartItem(itemId);
        toast.success("Item dihapus dari keranjang.");
      } catch (error) {
        toast.error("Gagal menghapus item.");
        console.error(error);
      }
    });
  };

  return (
    <div className={cn("flex items-center justify-between w-full md:w-auto gap-4", className)}>
      <div className="flex items-center gap-2 border rounded-md p-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          disabled={quantity <= 1 || isPending}
          onClick={() => handleUpdate(quantity - 1)}
        >
          <Minus className="h-3 w-3" />
        </Button>

        <span className="w-8 text-center text-sm font-medium tabular-nums">
          {isPending ? <Loader2 className="h-3 w-3 animate-spin mx-auto" /> : quantity}
        </span>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          disabled={isPending}
          onClick={() => handleUpdate(quantity + 1)}
        >
          <Plus className="h-3 w-3" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
          disabled={isPending}
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
