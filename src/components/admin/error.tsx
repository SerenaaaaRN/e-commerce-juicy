"use client";

import { useEffect } from "react";
import { Button } from "@/components/atoms/button";

/**
 * Error Boundary untuk menangani error runtime di halaman produk.
 * Memungkinkan user untuk mencoba memuat ulang halaman tanpa refresh browser.
 */
export default function ProductsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log error ke layanan monitoring seperti Sentry jika ada
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <h2 className="text-xl font-bold">Waduh, ada masalah!</h2>
      <p className="text-muted-foreground text-sm">Gagal memuat data produk.</p>
      <Button onClick={() => reset()}>Coba Lagi</Button>
    </div>
  );
}
