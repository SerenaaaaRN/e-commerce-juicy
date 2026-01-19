"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { createProduct } from "./actions"; // Import action yg baru dibuat
import { ImageUpload } from "@/components/admin/image-upload"; // Import upload component
import { Tables } from "@/types/supabase";

import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/card";
import { Input } from "@/components/atoms/input";
import { Textarea } from "@/components/atoms/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/select";
import { Switch } from "@/components/atoms/switch";
import { Label } from "@/components/atoms/label";

interface CreateProductFormProps {
  categories: Tables<"categories">[];
}

export function CreateProductForm({ categories }: CreateProductFormProps) {
  const [state, formAction, isPending] = useActionState(createProduct, null);
  const [imageUrl, setImageUrl] = useState("");

  return (
    <form action={formAction}>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        {/* KOLOM KIRI (Detail Produk) */}
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>Isi detail produk baru.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" type="text" placeholder="Contoh: Sepatu Nike" required />
                  {state?.fieldErrors?.name && <p className="text-red-500 text-sm">{state.fieldErrors.name}</p>}
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="slug">Slug</Label>
                  <Input id="slug" name="slug" type="text" placeholder="sepatu-nike" required />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" className="min-h-32" />
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
                  <Input id="price" name="price" type="number" placeholder="150000" required />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="stock">Stock</Label>
                  <Input id="stock" name="stock" type="number" defaultValue={10} required />
                </div>
                <div className="grid gap-3 col-span-2">
                  <Label>Category</Label>
                  <Select name="category_id">
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
                  {state?.fieldErrors?.category_id && (
                    <p className="text-red-500 text-sm">{state.fieldErrors.category_id}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KOLOM KANAN (Status & Gambar) */}
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Switch id="is_active" name="is_active" value="true" defaultChecked />
                <Label htmlFor="is_active">Active Status</Label>
              </div>
            </CardContent>
          </Card>

          {/* UPLOAD GAMBAR */}
          <Card>
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload onOnChange={setImageUrl} />
              {/* Hidden Input untuk mengirim URL ke server */}
              <input type="hidden" name="image_url" value={imageUrl} />
            </CardContent>
          </Card>

          {/* TOMBOL ACTION */}
          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Product"}
            </Button>
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
