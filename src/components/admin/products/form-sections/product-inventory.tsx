import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/select";
import { Tables } from "@/types/supabase";

/**
 * Props untuk komponen ProductInventory.
 */
interface ProductInventoryProps {
  categories: Tables<"categories">[];
  errors?: {
    price?: string[];
    stock?: string[];
    category_id?: string[];
  };
  initialData?: {
    price: number;
    stock: number | null;
    category_id: number | null;
  };
}
/**
 * Komponen form bagian inventaris (Harga, Stok, Kategori).
 */
export function ProductInventory({ categories, errors, initialData }: ProductInventoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category & Stock</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="grid gap-3">
            <Label htmlFor="price">Price (IDR)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              placeholder="150000"
              defaultValue={initialData?.price}
              required
            />
            {errors?.price && <p className="text-destructive text-sm">{errors.price[0]}</p>}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="stock">Stock</Label>
            <Input id="stock" name="stock" type="number" defaultValue={initialData?.stock ?? 10} required />
            {errors?.stock && <p className="text-destructive text-sm">{errors.stock[0]}</p>}
          </div>

          <div className="grid gap-3 col-span-2">
            <Label>Category</Label>
            <Select
              name="category_id"
              defaultValue={initialData?.category_id ? String(initialData.category_id) : undefined}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.category_id && <p className="text-destructive text-sm">{errors.category_id[0]}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
