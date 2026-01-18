"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { createProduct } from "./actions";
import { createClient } from "@/utils/supabase/client";

import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/atoms/form";
import { Input } from "@/components/atoms/input";
import { Textarea } from "@/components/atoms/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/select";
import { Switch } from "@/components/atoms/switch";

// Schema Validation Client-Side
const productSchema = z.object({
  name: z.string().min(3, "Nama produk minimal 3 karakter"),
  slug: z.string().min(3, "Slug wajib diisi (unik)"),
  description: z.string().optional(),
  price: z.coerce.number().min(100, "Harga minimal 100 perak"),
  stock: z.coerce.number().min(0, "Stok tidak boleh minus"),
  category_id: z.string().min(1, "Pilih salah satu kategori"),
  is_active: z.boolean().default(true),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function CreateProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // State untuk menyimpan kategori dari DB
  const [categories, setCategories] = useState<any[]>([]);

  // 1. Fetch Categories saat halaman dibuka
  useEffect(() => {
    const fetchCategories = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("categories").select("id, name");
      if (data) setCategories(data);
      if (error) console.error("Error fetching categories:", error);
    };
    fetchCategories();
  }, []);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price: 0,
      stock: 0,
      is_active: true,
      category_id: "",
    },
  });

  // 2. Handle Submit - Mengubah data jadi FormData untuk dikirim ke Server Action
  async function onSubmit(data: ProductFormValues) {
    setIsLoading(true);

    // Konversi object ke FormData (karena Server Action butuh FormData/Primitive)
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("slug", data.slug);
    formData.append("description", data.description || "");
    formData.append("price", data.price.toString());
    formData.append("stock", data.stock.toString());
    formData.append("category_id", data.category_id);
    formData.append("is_active", String(data.is_active));

    // Panggil Server Action
    const result = await createProduct(null, formData);

    if (result?.error) {
      alert(result.error); // Ganti dengan Toast kalau sudah setup
      setIsLoading(false);
    }
    // Jika sukses, 'redirect' di server action akan otomatis memindahkan halaman
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue("name", value);
    const slug = value
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
    form.setValue("slug", slug);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild className="h-7 w-7">
          <Link href="/dashboard/products">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Create Product
        </h1>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/products">Discard</Link>
          </Button>
          <Button size="sm" onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Product
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8"
        >
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>Informasi dasar produk yang akan ditampilkan.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Contoh: Kopi Susu" {...field} onChange={handleNameChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea className="min-h-32" placeholder="Deskripsi..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory & Price</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (Rp)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Product Status</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active</FormLabel>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* MAPPING DATA KATEGORI DARI DATABASE */}
                          {categories.length > 0 ? (
                            categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="loading" disabled>
                              Loading categories...
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center justify-end gap-2 md:hidden">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/products">Discard</Link>
            </Button>
            <Button size="sm" onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
              Save Product
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
