"use client";

import { useTransition } from "react";
import Link from "next/link";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";

import { deleteProduct } from "@/modules/products/actions";
import { Button } from "@/components/atoms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";
import { toast } from "sonner";

interface ProductRowActionsProps {
  productId: string;
}

export function ProductRowActions({ productId }: ProductRowActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    const confirmDelete = confirm("Apakah anda yakin ingin menghapus produk ini?");
    if (!confirmDelete) return;

    startTransition(async () => {
      try {
        await deleteProduct(productId);
        toast.success("Produk berhasil dihapus"); // Notifikasi sukses
      } catch (error) {
        toast.error("Gagal menghapus produk" + error); // Notifikasi error
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
