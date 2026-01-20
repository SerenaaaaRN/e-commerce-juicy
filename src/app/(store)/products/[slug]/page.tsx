import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Check } from "lucide-react";

import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { Separator } from "@/components/atoms/separator";
import { formatCurrency } from "@/lib/formatters";
import { AddToCart } from "@/modules/store/components/add-to-cart";
import { productService } from "@/modules/products/services/product-service";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  const product = await productService.getBySlug(slug);

  if (!product) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-10">

      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="pl-0 hover:bg-transparent hover:text-blue-600">
          <Link href="/" className="flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            Back to Store
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* KIRI: FOTO PRODUK */}
        <div className="space-y-4">
          <div className="aspect-square relative bg-gray-100 rounded-xl overflow-hidden border">
            {product.image_url ? (
              <Image src={product.image_url} alt={product.name} fill className="object-cover" priority />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">No Image</div>
            )}
          </div>
        </div>

        {/* KANAN: DETAIL INFO */}
        <div className="flex flex-col gap-6">
          <div>
            <Badge variant="secondary" className="mb-3">
              {product.categories?.name || "Product"}
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{product.name}</h1>
            <p className="mt-4 text-2xl font-bold text-blue-600">{formatCurrency(product.price)}</p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Description</h3>
            <div className="prose prose-sm text-gray-500 leading-relaxed">
              {product.description || "Belum ada deskripsi."}
            </div>
          </div>

          <div className="space-y-4 pt-6">
            <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
              <Check className="h-4 w-4" />
              Stock Available: {product.stock}
            </div>

            <div className="flex gap-4">
              <AddToCart productId={product.id} stock={product.stock ?? 0} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
