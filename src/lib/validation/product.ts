import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, { message: "Nama produk minimal 3 karakter" }),

  slug: z.string().optional(),

  description: z.string().optional(),

  price: z.coerce
    .number({ invalid_type_error: "Harga harus berupa angka" })
    .min(1000, { message: "Harga minimal Rp 1.000" }),

  stock: z.coerce
    .number({ invalid_type_error: "Stok harus berupa angka" })
    .int({ message: "Stok harus bilangan bulat" })
    .min(0, { message: "Stok tidak boleh kurang dari 0" }),

  category_id: z.coerce
    .number({ invalid_type_error: "Kategori wajib dipilih" })
    .min(1, { message: "Silakan pilih kategori" }),

  // Boolean murni
  is_active: z.boolean().default(false),

  // String URL
  image_url: z.string().optional().nullable(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
