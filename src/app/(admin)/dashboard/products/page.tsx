import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/atoms/card";
import { Input } from "@/components/atoms/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/atoms/table";
import { ProductRowActions } from "@/components/admin/product-row-actions";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// 1. Definisikan Props untuk menangkap searchParams
export default async function ProductsPage(props: { searchParams: Promise<{ q?: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams.q || ""; // Ambil kata kunci pencarian

  const supabase = await createClient();

  // 2. Query Dasar
  let supabaseQuery = supabase.from("products").select("*, categories(name)").order("created_at", { ascending: false });

  // 3. Tambahkan Filter JIKA ada pencarian
  if (query) {
    supabaseQuery = supabaseQuery.ilike("name", `%${query}%`);
  }

  const { data: products, error } = await supabaseQuery;

  if (error) {
    return <div>Gagal memuat data produk.</div>;
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">Products</h1>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          {/* 4. Bungkus Input Search dalam Form agar submit ke URL */}
          <form className="relative flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              name="q" // PENTING: nama param di URL
              type="search"
              placeholder="Search products..."
              defaultValue={query} // Agar text tidak hilang saat refresh
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden md:table-cell">Stock</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell">Created at</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products && products.length > 0 ? (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="hidden sm:table-cell">
                      <div className="aspect-square rounded-md bg-gray-100 relative overflow-hidden h-16 w-16 flex items-center justify-center text-xs text-gray-400">
                        {product.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            alt={product.name}
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src={product.image_url}
                            width="64"
                          />
                        ) : (
                          "No Img"
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.name}
                      <div className="text-xs text-muted-foreground md:hidden">Stok: {product.stock}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.is_active ? "default" : "secondary"}>
                        {product.is_active ? "Active" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell className="hidden md:table-cell">{product.stock}</TableCell>
                    <TableCell className="hidden md:table-cell">{product.categories?.name || "-"}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatDate(product.created_at)}</TableCell>
                    <TableCell>
                      <ProductRowActions productId={product.id} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    {query ? "Tidak ada produk yang cocok." : "No products found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
