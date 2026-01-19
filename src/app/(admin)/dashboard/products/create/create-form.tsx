"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createProduct } from "./actions";
import { Tables } from "@/types/supabase";
import { Button } from "@/components/atoms/button";
import { ProductGeneralInfo } from "@/components/admin/products/form-sections/product-general-info";
import { ProductInventory } from "@/components/admin/products/form-sections/product-inventory";
import { ProductFormSidebar } from "@/components/admin/products/form-sections/product-sidebar";

/**
 * Props untuk halaman CreateProductForm.
 * Menerima list kategori dari server component.
 */
interface CreateProductFormProps {
  categories: Tables<"categories">[];
}

/**
 * Form utama pembuatan produk baru.
 * Menggunakan Server Actions untuk submit data.
 * * Struktur layout:
 * - Kiri (2 kolom): Detail Produk & Inventaris
 * - Kanan (1 kolom): Status & Gambar
 */
export function CreateProductForm({ categories }: CreateProductFormProps) {
  // Menggunakan useActionState (React 19 / Next 15 hook untuk form state)
  const [state, formAction, isPending] = useActionState(createProduct, null);

  return (
    <form action={formAction}>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        {/* KOLOM KIRI (Main Content) */}
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <ProductGeneralInfo errors={state?.fieldErrors} />
          <ProductInventory categories={categories} errors={state?.fieldErrors} />
        </div>

        {/* KOLOM KANAN (Sidebar) */}
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <ProductFormSidebar />

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Product"}
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/products">Cancel</Link>
            </Button>
          </div>

          {/* Global Error Message */}
          {state?.error && (
            <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm font-medium">{state.error}</div>
          )}
        </div>
      </div>
    </form>
  );
}
