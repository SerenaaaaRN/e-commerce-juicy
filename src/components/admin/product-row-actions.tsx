"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";

import { deleteProduct } from "@/app/(admin)/dashboard/products/actions";
import { Button } from "@/components/atoms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";
import { useRouter } from "next/navigation";

interface ProductRowActionsProps {
  productId: string;
}

export function ProductRowActions({ productId }: ProductRowActionsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    const confirmDelete = confirm("Apakah anda yakin ingin menghapus produk ini?");
    if (!confirmDelete) return;

    startTransition(async () => {
      try {
        await deleteProduct(productId);
        // alert("Produk berhasil dihapus"); // Ganti toast kalau ada
      } catch (error) {
        alert("Gagal menghapus produk");
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-haspopup="true" size="icon" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        {/* EDIT BUTTON (Navigasi ke halaman Edit) */}
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/products/${productId}/edit`} className="cursor-pointer">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </DropdownMenuItem>

        {/* DELETE BUTTON */}
        <DropdownMenuItem
          onClick={handleDelete}
          disabled={isPending}
          className="text-red-600 focus:text-red-600 cursor-pointer"
        >
          <Trash className="mr-2 h-4 w-4" />
          {isPending ? "Deleting..." : "Delete"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
