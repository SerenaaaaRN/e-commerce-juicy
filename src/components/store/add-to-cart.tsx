"use client";

import { useTransition } from "react";
import { Button } from "../atoms/button";
import { Loader2, ShoppingCart } from "lucide-react";
import { addToCart } from "@/modules/cart/actions";
import { toast } from "sonner";

interface AddToCartProps {
  productId: string;
  stock: number;
}

export const AddToCart = ({ productId, stock }: AddToCartProps) => {
  // menggunakan useTransition agar UI tidak freeze saat menunggu server action
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

  return (
    <Button size="lg" className="w-full md:w-auto" onClick={handleAddToCart} disabled={isPending || isOutOfStock}>
      {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShoppingCart className="mr-2 h-4 w-4" />}
      {isOutOfStock ? "Stok Habis" : isPending ? "Menambahkan..." : "Add to Cart"}
      {isOutOfStock ? "Stok Habis" : "Add to Cart"}
    </Button>
  );
};
