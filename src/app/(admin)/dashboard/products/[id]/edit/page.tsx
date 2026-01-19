import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { EditProductForm } from "./edit-form";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/atoms/button";

interface EditPageProps {
  params: Promise<{ id: string }>; // Params harus Promise di Next.js 15
}

export default async function EditProductPage({ params }: EditPageProps) {
  const { id } = await params; // Await params dulu
  const supabase = await createClient();

  // 1. Fetch Product by ID
  const { data: product, error } = await supabase.from("products").select("*").eq("id", id).single();

  // 2. Fetch Categories (untuk dropdown)
  const { data: categories } = await supabase.from("categories").select("id, name").eq("is_active", true);

  if (error || !product) {
    return notFound(); // Tampilkan 404 jika produk tidak ketemu
  }

  return (
    <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/dashboard/products">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Edit Product
        </h1>
      </div>

      {/* Render Client Component Form */}
      <EditProductForm product={product} categories={categories || []} />
    </div>
  );
}
