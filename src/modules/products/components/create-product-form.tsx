"use client";

import { useActionState } from "react"; 
import Link from "next/link";
import { Button } from "@/components/atoms/button";
import { createProduct } from "../actions"; 
import { Tables } from "@/types/supabase";

import { ProductGeneralInfo } from "./form-sections/product-general-info";
import { ProductInventory } from "./form-sections/product-inventory";
import { ProductSidebar } from "./form-sections/product-sidebar";

interface CreateProductFormProps {
  categories: Tables<"categories">[];
}

export function CreateProductForm({ categories }: CreateProductFormProps) {
  
  const [state, formAction, isPending] = useActionState(createProduct, null);

  return (
    <form action={formAction}>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        {/* MAIN CONTENT (KIRI) */}
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <ProductGeneralInfo errors={state?.fieldErrors} />
          <ProductInventory categories={categories} errors={state?.fieldErrors} />
        </div>

        {/* SIDEBAR (KANAN) */}
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <ProductSidebar />

          {/* ACTION BUTTONS */}
          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Create Product"}
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/products">Cancel</Link>
            </Button>
          </div>

          {/* ERROR ALERT */}
          {state?.error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive">{state.error}</div>
          )}
        </div>
      </div>
    </form>
  );
}
