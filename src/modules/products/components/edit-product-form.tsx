"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/atoms/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/atoms/alert-dialog"; 
import { Tables } from "@/types/supabase";

import { updateProduct, deleteProduct } from "../actions";
import { ProductGeneralInfo } from "./form-sections/product-general-info";
import { ProductInventory } from "./form-sections/product-inventory";
import { ProductSidebar } from "./form-sections/product-sidebar";

interface EditProductFormProps {
  product: Tables<"products">;
  categories: Tables<"categories">[];
}

export function EditProductForm({ product, categories }: EditProductFormProps) {
  // Binding ID produk ke server action update
  const updateProductWithId = updateProduct.bind(null, product.id);
  const [state, formAction, isPending] = useActionState(updateProductWithId, null);

  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteProduct(product.id);
      // Redirect ditangani di server action, tapi kadang butuh refresh client side
    } catch (error) {
      alert("Gagal menghapus produk");
      setIsDeleting(false);
    }
  }

  return (
    <form action={formAction}>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        {/* KOLOM KIRI */}
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <ProductGeneralInfo
            defaultValues={{
              name: product.name,
              description: product.description || "",
            }}
            errors={state?.fieldErrors}
          />
          <ProductInventory
            categories={categories}
            defaultValues={{
              price: product.price,
              stock: product.stock,
              category_id: product.category_id || "",
            }}
            errors={state?.fieldErrors}
          />
        </div>

        {/* KOLOM KANAN (SIDEBAR) */}
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <ProductSidebar
            defaultValues={{
              is_active: product.is_active ?? false,
              image_url: product.image_url,
            }}
          />

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/products">Cancel</Link>
            </Button>

            {/* Delete Button with Alert Dialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" type="button" disabled={isDeleting}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Product
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tindakan ini tidak bisa dibatalkan. Produk <strong>{product.name}</strong> akan dihapus permanen.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {state?.error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive">{state.error}</div>
          )}
        </div>
      </div>

      {/* Hidden input untuk handle logic gambar lama jika tidak ada upload baru */}
      <input type="hidden" name="existing_image_url" value={product.image_url || ""} />
    </form>
  );
}
