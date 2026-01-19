"use client";

import { useActionState } from "react";
import Link from "next/link";
import { updateProduct } from "./actions"; 
import { Tables } from "@/types/supabase";
import { Button } from "@/components/atoms/button";
import { ProductGeneralInfo } from "@/components/admin/products/form-sections/product-general-info";
import { ProductInventory } from "@/components/admin/products/form-sections/product-inventory";
import { ProductFormSidebar } from "@/components/admin/products/form-sections/product-sidebar";

interface EditProductFormProps {
  product: Tables<"products">; // Data produk existing
  categories: Tables<"categories">[];
}

/**
 * Form untuk mengedit produk yang sudah ada.
 * Menggunakan kembali komponen dari Create Form untuk konsistensi UI.
 */
export default function EditProductForm({ product, categories }: EditProductFormProps) {
  // Binding ID produk ke server action agar server tahu produk mana yang diupdate
  const updateProductWithId = updateProduct.bind(null, product.id);
  const [state, formAction, isPending] = useActionState(updateProductWithId, null);

  return (
    <form action={formAction}>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        {/* KOLOM KIRI */}
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <ProductGeneralInfo errors={state?.fieldErrors} initialData={product} />
          <ProductInventory categories={categories} errors={state?.fieldErrors} initialData={product} />
        </div>

        {/* KOLOM KANAN */}
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <ProductFormSidebar initialData={product} />

          <div className="flex flex-col gap-2">
            <Button  type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/products">Cancel</Link>
            </Button>
          </div>

          {state?.error && (
            <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm font-medium">{state.error}</div>
          )}
        </div>
      </div>
    </form>
  );
}
