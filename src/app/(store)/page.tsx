import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardFooter } from "@/components/atoms/card";
import { formatCurrency } from "@/lib/formatters";

export default async function StorePage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(8);

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* HERO SECTION */}
      <section className="bg-gray-100 py-12 md:py-24 lg:py-32">
        <div className="container flex flex-col items-center text-center gap-4 mx-auto px-4">
          <Badge className="px-3 py-1 text-sm" variant="secondary">
            New Collection 2026
          </Badge>
          <h1 className="text-3xl font-bold sm:text-5xl md:text-6xl tracking-tighter">
            Rillah kece abis <br className="hidden sm:inline" />
            Everyday To be Happy.
          </h1>
          <div className="flex gap-4 mt-4">
            <Button size="lg" asChild>
              <Link href="/products">Shop Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* PRODUCT GRID SECTION */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Featured Products</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products?.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden border-none shadow-none hover:shadow-lg transition-all duration-200 group"
            >
              {/* Image Wrapper */}
              <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden mb-3">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 bg-gray-200">
                    <span className="text-xs">No Image</span>
                  </div>
                )}
              </div>

              <CardContent className="p-0">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                  {product.categories?.name || "Item"}
                </p>
                <h3 className="font-semibold truncate text-base">{product.name}</h3>
                <p className="font-bold mt-1 text-blue-600 text-sm">{formatCurrency(product.price)}</p>
              </CardContent>

              <CardFooter className="p-0 mt-3">
                <Button className="w-full h-8 text-xs" size="sm">
                  <Link href={`/products/${product.slug}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
