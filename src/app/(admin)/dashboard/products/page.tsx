import Link from "next/link";
import { Plus, Search } from "lucide-react";

import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/atoms/card";
import { ProductsTable } from "@/components/admin/products/products-table";
import { getProducts } from "@/lib/data/products";

export default async function ProductsPage(props: { searchParams: Promise<{ q?: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams.q || "";

  const products = await getProducts(query);

  return (
    <>
      <div className="flex items-center gap-4">
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">Products</h1>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          {/* Search Form bisa dipisah jadi component <ProductSearch /> juga kalau mau lebih reusable */}
          <form className="relative flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              name="q"
              type="search"
              placeholder="Search products..."
              defaultValue={query}
              className="w-full rounded-lg bg-background pl-8 md:w-50 lg:w-[320px]"
            />
          </form>

          <Button size="sm" className="h-8 gap-1" asChild>
            <Link href="/dashboard/products/create">
              <Plus className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Product</span>
            </Link>
          </Button>
        </div>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            {query ? `Hasil pencarian untuk "${query}"` : "Manage your products and view their sales performance."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Render Component Table */}
          <ProductsTable products={products} />
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-{products?.length || 0}</strong> products
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
