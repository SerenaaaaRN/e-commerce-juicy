"use client";

import { useTransition } from "react";
import { Loader2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/atoms/button";
import { addToCart } from "@/modules/cart/actions";

interface AddToCartProps {
  productId: string;
  stock: number;
}

export const AddToCart = ({ productId, stock }: AddToCartProps) => {
  const [isPending, startTransition] = useTransition();
  const isOutOfStock = stock <= 0;

  const handleAddToCart = () => {
    startTransition(async () => {
      try {
        await addToCart(productId);
        toast.success("Berhasil masuk ke keranjang");
      } catch (error) {
        toast.error("Gagal menambahkan barang");
        console.error(error);
      }
    });
  };

  // Logic Text Button:
  // 1. Kalau Loading -> "Menambahkan..."
  // 2. Kalau Stok Habis -> "Stok Habis"
  // 3. Normal -> "Add to Cart"
  const buttonText = isPending ? "Menambahkan..." : isOutOfStock ? "Stok Habis" : "Add to Cart";

  return (
    <Button size="lg" className="w-full md:w-auto" onClick={handleAddToCart} disabled={isPending || isOutOfStock}>
      {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShoppingCart className="mr-2 h-4 w-4" />}
      {buttonText}
    </Button>
  );
};
