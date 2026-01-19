"use client";

import { useActionState } from "react";

import Link from "next/link";
import { updateProduct } from "./actions";

import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/card";
import { Input } from "@/components/atoms/input";
import { Textarea } from "@/components/atoms/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/select";
import { Switch } from "@/components/atoms/switch";
import { Label } from "@/components/atoms/label";
import { Tables } from "@/types/supabase";

interface EditProductFormProps {
  product: Tables<"products">;
  categories: Tables<"categories">[];
}

export function EditProductForm({ product, categories }: EditProductFormProps) {
  const updateProductWithId = updateProduct.bind(null, product.id);
  const [state, formAction, isPending] = useActionState(updateProductWithId, null);

  return (
    <form action={formAction}>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>Update nama, deskripsi, dan harga.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" type="text" defaultValue={product.name} required />
                  {state?.fieldErrors?.name && <p className="text-red-500 text-sm">{state.fieldErrors.name}</p>}
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="slug">Slug</Label>
                  <Input id="slug" name="slug" type="text" defaultValue={product.slug} required />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    className="min-h-32"
                    defaultValue={product.description || ""}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Category & Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="grid gap-3">
                  <Label htmlFor="price">Price (IDR)</Label>
                  <Input id="price" name="price" type="number" defaultValue={product.price} required />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="stock">Stock</Label>
                  <Input id="stock" name="stock" type="number" defaultValue={product.stock || 0} required />
                </div>
                <div className="grid gap-3 col-span-2">
                  <Label>Category</Label>
                  <Select name="category_id" defaultValue={String(product.category_id)}>
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
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Switch id="is_active" name="is_active" value="true" defaultChecked={product.is_active || false} />
                <Label htmlFor="is_active">Active Status</Label>
              </div>
            </CardContent>
          </Card>

          {/* Tombol Action */}
          <div className="flex flex-col gap-2">
            <Button type="submit">Save Changes</Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/products">Cancel</Link>
            </Button>
          </div>

          {state?.error && <div className="bg-red-100 text-red-600 p-3 rounded-md text-sm">{state.error}</div>}
        </div>
      </div>
    </form>
  );
}
