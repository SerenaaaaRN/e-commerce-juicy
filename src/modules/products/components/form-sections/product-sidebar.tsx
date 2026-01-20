import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Label } from "@/components/atoms/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/select";
import { ImageUpload } from "@/modules/products/components/image-upload";

interface ProductSidebarProps {
  defaultValues?: {
    is_active?: boolean;
    image_url?: string | null;
  };
}

export function ProductSidebar({ defaultValues }: ProductSidebarProps) {
  return (
    <div className="grid gap-4">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle>Product Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="status">Status</Label>
              {/* Name "status" ini yang akan ditangkap di Action */}
              <Select name="status" defaultValue={defaultValues?.is_active ? "active" : "draft"}>
                <SelectTrigger id="status" aria-label="Select status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Upload Card */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Product Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {/* PR PENTING:
               Component ImageUpload kamu harus bisa mengirim URL balik.
               Cara paling simpel (sementara) kalau ImageUpload belum support return value:
               Tambahkan input text biasa untuk URL image manual
            */}

            {/* Opsi 1: Jika ImageUpload cuma UI upload, kita butuh input text buat nampung URL (hidden atau visible) */}
            <div className="text-xs text-muted-foreground mb-2">
              *Upload belum terintegrasi sempurna, masukkan URL manual jika perlu.
            </div>
            <input
              type="text"
              name="image_url"
              placeholder="https://..."
              className="w-full border rounded p-2 text-sm"
              defaultValue={defaultValues?.image_url || ""}
            />

            {/* Component Image Upload (Visual Only dulu sampai diperbaiki) */}
            <ImageUpload initialImage={defaultValues?.image_url} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
