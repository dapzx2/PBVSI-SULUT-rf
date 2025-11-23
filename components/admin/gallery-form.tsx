'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/image';
import { GalleryItem } from '@/lib/types';
import { Loader2, Upload, X, FileText, Tag, AlignLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GalleryFormProps {
  initialData: GalleryItem | null;
  onSuccess: () => void;
  onClose: () => void;
}

export function GalleryForm({ initialData, onSuccess, onClose }: GalleryFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    image_url: initialData?.image_url || null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image_url || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let finalImageUrl = formData.image_url;

    try {
      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', imageFile);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || 'Gagal mengunggah gambar');
        }

        const uploadResult = await uploadResponse.json();
        finalImageUrl = uploadResult.url;
      }

      const apiEndpoint = initialData
        ? `/api/admin/gallery/${initialData.id}`
        : '/api/admin/gallery';
      const method = initialData ? 'PUT' : 'POST';

      const body = {
        ...formData,
        image_url: finalImageUrl,
      };

      const response = await fetch(apiEndpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Operasi gagal');
      }

      toast({ description: `Item galeri berhasil ${initialData ? 'diperbarui' : 'dibuat'}.` });
      onSuccess();
    } catch (error: any) {
      toast({ variant: 'destructive', description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="image" className="flex items-center gap-2 text-primary">
            <Upload className="h-4 w-4" /> Gambar Galeri
          </Label>
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors hover:bg-muted/50 relative min-h-[300px] flex flex-col items-center justify-center",
              imagePreview ? "border-primary/50" : "border-muted-foreground/25"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <Input
              ref={fileInputRef}
              id="image"
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />

            {imagePreview ? (
              <div className="relative w-full h-full min-h-[300px]">
                <Image
                  src={imagePreview}
                  alt="Preview Gambar Galeri"
                  fill
                  className="object-contain rounded-md"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage();
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground py-12">
                <div className="p-3 bg-muted rounded-full">
                  <Upload className="h-8 w-8" />
                </div>
                <p className="text-sm font-medium">Klik atau tarik gambar ke sini</p>
                <p className="text-xs">PNG, JPG, GIF (Max 10MB)</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title" className="flex items-center gap-2 text-primary">
            <FileText className="h-4 w-4" /> Judul
          </Label>
          <Input id="title" value={formData.title} onChange={handleChange} required placeholder="Judul untuk gambar" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="flex items-center gap-2 text-primary">
            <Tag className="h-4 w-4" /> Kategori
          </Label>
          <Select onValueChange={handleCategoryChange} value={formData.category}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="putra">Putra</SelectItem>
              <SelectItem value="putri">Putri</SelectItem>
              <SelectItem value="official">Official</SelectItem>
              <SelectItem value="news">News</SelectItem>
              <SelectItem value="club_logo">Logo Klub</SelectItem>
              <SelectItem value="other">Lainnya</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="flex items-center gap-2 text-primary">
            <AlignLeft className="h-4 w-4" /> Deskripsi (Opsional)
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Deskripsi singkat tentang gambar"
            rows={3}
            className="resize-none"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
          Batal
        </Button>
        <Button type="submit" className="min-w-[140px]" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Simpan Perubahan' : 'Tambah Gambar'}
        </Button>
      </div>
    </form>
  );
}
