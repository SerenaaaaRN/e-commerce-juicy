import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Label } from "@/components/atoms/label";
import { Switch } from "@/components/atoms/switch";
import { ImageUpload } from "@/components/admin/image-upload";

interface ProductSidebarProps {
  initialData?: {
    is_active: boolean;
    image_url: string | null;
  };
}

/**
 * Komponen sidebar form (Status Aktif & Upload Gambar).
 * Menggunakan state internal untuk URL gambar agar bisa dikirim via hidden input.
 */
export function ProductFormSidebar({ initialData }: ProductSidebarProps) {
  const [imageUrl, setImageUrl] = useState(initialData?.image_url ?? "");

  return (
    <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Switch id="is_active" name="is_active" value="true" defaultChecked={initialData?.is_active} />
            <Label htmlFor="is_active">Active Status</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product Image</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload onOnChange={setImageUrl} />
          {/* Hidden Input untuk mengirim URL ke server action */}
          <input type="hidden" name="image_url" value={imageUrl} />
        </CardContent>
      </Card>
    </div>
  );
}
