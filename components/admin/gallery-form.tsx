'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/image';
import { GalleryItem } from '@/lib/types'; // Assuming you'll define GalleryItem in types.ts

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
    image_url: initialData?.image_url || null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image_url || null
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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
    <form onSubmit={handleSubmit} className="space-y-4">
       <div className="space-y-2">
        <Label htmlFor="image">Gambar Galeri</Label>
        {imagePreview && (
          <div className="mt-2">
            <Image
              src={imagePreview}
              alt="Preview Gambar Galeri"
              width={256}
              height={144}
              className="rounded-md object-cover"
            />
          </div>
        )}
        <Input id="image" type="file" onChange={handleImageChange} accept="image/*" />
        <p className="text-sm text-muted-foreground">
          Pilih gambar baru untuk item galeri.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="title">Judul</Label>
        <Input id="title" value={formData.title} onChange={handleChange} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea id="description" value={formData.description} onChange={handleChange} />
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </div>
    </form>
  );
}
