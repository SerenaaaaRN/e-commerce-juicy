import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, { message: "Nama produk minimal 3 karakter" }),
  slug: z
    .string()
    .min(3, { message: "Slug minimal 3 karakter" })
    .regex(/^[a-z0-9-]+$/, { message: "Slug hanya boleh huruf kecil, angka, dan strip" }),
  description: z.string().optional(),

  price: z.coerce.number({ message: "Harga harus berupa angka" }).min(1000, { message: "Harga minimal Rp 1.000" }),

  stock: z.coerce
    .number({ message: "Stok harus berupa angka" })
    .int({ message: "Stok harus bilangan bulat" })
    .min(0, { message: "Stok tidak boleh kurang dari 0" }),

  category_id: z.coerce.number({ message: "Kategori wajib dipilih" }),

  is_active: z.preprocess((val) => val === "true" || val === true, z.boolean()),
  image_url: z.string().optional().nullable(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
