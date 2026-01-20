"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { ProductRowActions } from "./product-row-actions";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { ProductWithCategory } from "../types";

export const columns: ColumnDef<ProductWithCategory>[] = [
  {
    accessorKey: "image_url",
    header: "Image",
    cell: ({ row }) => (
      <div className="aspect-square rounded-md bg-gray-100 relative overflow-hidden h-12 w-12 flex items-center justify-center text-xs text-gray-400">
        {row.original.image_url ? (
          <img alt={row.original.name} className="object-cover w-full h-full" src={row.original.image_url} />
        ) : (
          "No Img"
        )}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.getValue("name")}</span>
        <span className="text-xs text-muted-foreground md:hidden">Stok: {row.original.stock}</span>
      </div>
    ),
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.is_active ? "default" : "secondary"}>
        {row.original.is_active ? "Active" : "Draft"}
      </Badge>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="p-0 hover:bg-transparent"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Price
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => formatCurrency(row.getValue("price")),
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => row.getValue("stock"),
  },
  {
    accessorKey: "categories.name",
    header: "Category",
    cell: ({ row }) => row.original.categories?.name || "-",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => formatDate(row.getValue("created_at")),
  },
  {
    id: "actions",
    cell: ({ row }) => <ProductRowActions productId={row.original.id} />,
  },
];
