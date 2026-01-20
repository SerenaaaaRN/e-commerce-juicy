"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/card";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Textarea } from "@/components/atoms/textarea";
import { useState } from "react";

/**
 * Props untuk komponen ProductGeneralInfo.
 * @property errors - Objek error validasi dari server state (opsional).
 */
interface ProductGeneralInfoProps {
  errors?: {
    name?: string[];
    slug?: string[];
    description?: string[];
  };
  initialData?: {
    name: string;
    slug: string;
    description: string | null;
  };
}

/**
 * Komponen form bagian informasi dasar produk (Nama, Slug, Deskripsi).
 * Digunakan di halaman Create dan Edit.
 *
 * @param props - {@link ProductGeneralInfoProps}
 * @returns React Component
 */
export function ProductGeneralInfo({ errors, initialData }: ProductGeneralInfoProps) {
  const [slug, setSlug] = useState(initialData?.slug || "");

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSlug = slugify(e.target.value);
    setSlug(newSlug);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Details</CardTitle>
        <CardDescription>Informasi utama mengenai produk.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter the name of the item"
              defaultValue={initialData?.name}
              onChange={handleNameChange}
              required
            />
            {/* menampilkan error jika ada */}
            {errors?.name && <p className="text-destructive text-sm">{errors.name[0]}</p>}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" type="text" value={slug} onChange={(e) => setSlug(e.target.value)} required />
            {errors?.slug && <p className="text-destructive text-sm">{errors.slug[0]}</p>}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              className="min-h-32"
              defaultValue={initialData?.description || ""}
            />
            {errors?.description && <p className="text-destructive text-sm">{errors.description[0]}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
