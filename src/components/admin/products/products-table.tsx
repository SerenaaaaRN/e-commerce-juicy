import { Badge } from "@/components/atoms/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/atoms/table";
import { ProductRowActions } from "@/components/admin/product-row-actions"; 
import { Tables } from "@/types/supabase"; 
import { formatCurrency, formatDate } from "@/lib/formatters";

type ProductWithCategory = Tables<"products"> & {
  categories: { name: string } | null;
};

export function ProductsTable({ products }: { products: ProductWithCategory[] }) {
  if (!products || products.length === 0) {
    return (
      <div className="h-24 flex items-center justify-center text-muted-foreground border rounded-md">
        Tidak ada produk ditemukan.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden w-25 sm:table-cell">Image</TableHead>
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
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="hidden sm:table-cell">
              
              <div className="aspect-square rounded-md bg-gray-100 relative overflow-hidden h-16 w-16 flex items-center justify-center text-xs text-gray-400">
                {product.image_url ? (
                  <img alt={product.name} className="object-cover w-full h-full" src={product.image_url} />
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
        ))}
      </TableBody>
    </Table>
  );
}
