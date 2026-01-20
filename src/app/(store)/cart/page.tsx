import { cartService } from "@/modules/cart/services/cart-service";
import { formatCurrency } from "@/lib/formatters";
import { Button } from "@/components/atoms/button";
import { Card, CardContent } from "@/components/atoms/card";
import { Separator } from "@/components/atoms/separator";
import { ShoppingBag } from "lucide-react";
import { CartItemActions } from "@/modules/cart/components/cart-item-actions";
import Image from "next/image";
import Link from "next/link";

const CartPage = async () => {
  const cart = await cartService.getCart();

  const items = cart?.cart_items.sort((a, b) => a.id.localeCompare(b.id)) || [];

  if (!cart || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="bg-muted p-6 rounded-full">
          <ShoppingBag className="w-12 h-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Keranjangmu kosong</h2>
        <p className="text-muted-foreground">Yuk isi dengan barang-barang menarik!</p>
        <Button asChild>
          <Link href="/">Mulai Belanja</Link>
        </Button>
      </div>
    );
  }

  const subtotal = items.reduce((acc, item) => {
    return acc + (item.product?.price || 0) * item.quantity;
  }, 0);

  return (
    <div className="container max-w-6xl py-10 mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* LIST ITEM */}
        <div className="lg:col-span-2 space-y-4">
          {cart.cart_items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4 flex gap-4">
                {/* Gambar Produk */}
                <div className="relative w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                  {item.product?.image_url ? (
                    <Image src={item.product.image_url} alt={item.product.name} fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-muted-foreground">No Img</div>
                  )}
                </div>

                {/* Detail Produk & Aksi */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{item.product?.name}</h3>
                    <p className="text-muted-foreground text-sm">{formatCurrency(item.product?.price || 0)}</p>
                  </div>

                  <div className="mt-4">
                    <CartItemActions itemId={item.id} quantity={item.quantity} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* SUMMARY / CHECKOUT */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Ringkasan Belanja</h2>
              <Separator className="my-4" />

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pajak (Included)</span>
                  <span>Rp 0</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              <Button size="lg" className="w-full">
                Checkout ({items.length} Items)
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
