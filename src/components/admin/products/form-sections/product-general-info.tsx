import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/card";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Textarea } from "@/components/atoms/textarea";

/**
 * Props untuk komponen ProductGeneralInfo.
 * @property errors - Objek error validasi dari server state (opsional).
 */
interface ProductGeneralInfoProps {
  errors?: {
    name?: string[];
    slug?: string[];
    description?: string[];
  };
  // Tambahan baru: Data awal untuk mode Edit
  initialData?: {
    name: string;
    slug: string;
    description: string | null;
  };
}

/**
 * Komponen form bagian informasi dasar produk (Nama, Slug, Deskripsi).
 * Digunakan di halaman Create dan Edit.
 *
 * @param props - {@link ProductGeneralInfoProps}
 * @returns React Component
 */
export function ProductGeneralInfo({ errors, initialData }: ProductGeneralInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Details</CardTitle>
        <CardDescription>Informasi utama mengenai produk.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Contoh: Sepatu Nike"
              defaultValue={initialData?.name}
              required
            />
            {/* menampilkan error jika ada */}
            {errors?.name && <p className="text-destructive text-sm">{errors.name[0]}</p>}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              type="text"
              placeholder="sepatu-nike"
              defaultValue={initialData?.slug}
              required
            />
            {errors?.slug && <p className="text-destructive text-sm">{errors.slug[0]}</p>}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              className="min-h-32"
              defaultValue={initialData?.description || ""}
            />
            {errors?.description && <p className="text-destructive text-sm">{errors.description[0]}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
