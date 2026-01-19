"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client"; 
import { ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input"; 

interface ImageUploadProps {
  defaultValue?: string | null;
  onOnChange: (url: string) => void; // Callback untuk kirim URL ke parent form
}

export function ImageUpload({ defaultValue, onOnChange }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(defaultValue || null);
  const [isUploading, setIsUploading] = useState(false);

  const supabase = createClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi sederhana
    if (file.size > 2 * 1024 * 1024) {
      // 2MB limit
      alert("File terlalu besar (Max 2MB)");
      return;
    }

    try {
      setIsUploading(true);

      // 1. Buat nama file unik (timestamp-namafile)
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 2. Upload ke Supabase Storage
      const { error: uploadError } = await supabase.storage.from("products").upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // 3. Ambil Public URL
      const { data } = supabase.storage.from("products").getPublicUrl(filePath);

      // 4. Update State & Parent Form
      setPreview(data.publicUrl);
      onOnChange(data.publicUrl);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Gagal mengupload gambar");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onOnChange(""); // Kosongkan URL di parent
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Preview Container */}
      <div className="relative flex aspect-square w-full max-w-[200px] items-center justify-center rounded-lg border border-dashed bg-gray-50">
        {isUploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        ) : preview ? (
          <div className="relative h-full w-full overflow-hidden rounded-lg">
            {/* Tombol Hapus */}
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2 z-10 h-6 w-6"
              onClick={handleRemove}
            >
              <X className="h-3 w-3" />
            </Button>
            <Image src={preview} alt="Preview" fill className="object-cover" />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
            <ImagePlus className="h-8 w-8" />
            <span className="text-xs">Upload Image</span>
          </div>
        )}
      </div>

      {/* Hidden Input File */}
      <div className="flex w-full items-center justify-center">
        <Input type="file" accept="image/*" disabled={isUploading} onChange={handleUpload} className="cursor-pointer" />
      </div>
    </div>
  );
}
