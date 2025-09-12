'use client';

import { useState, useEffect } from 'react';
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
import { Player } from '@/lib/types';
import Image from 'next/image';

interface Club {
  id: string;
  name: string;
}

interface PlayerFormProps {
  initialData: Player | null;
  onSuccess: () => void;
  onClose: () => void;
}

  const PlayerForm: React.FC<PlayerFormProps> = ({ initialData, onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    position: initialData?.position || '',
    club_id: initialData?.club_id || null,
    image_url: initialData?.image_url || null,
    birth_date: initialData?.birth_date || '',
    height_cm: initialData?.height_cm || '',
    weight_kg: initialData?.weight_kg || '',
    country: initialData?.country || '',
    achievements: initialData?.achievements || '',
  });
  const [clubs, setClubs] = useState<Club[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image_url || null
  );

  const { toast } = useToast();

  useEffect(() => {
    async function fetchClubs() {
      try {
        const response = await fetch('/api/admin/clubs');
        if (!response.ok) throw new Error('Gagal memuat klub');
        const data = await response.json();
        setClubs(data.filter((club: Club) => club.id));
      } catch (error) {
        toast({ variant: 'destructive', description: error.message });
      }
    }
    fetchClubs();
  }, [toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleClubChange = (value: string) => {
    setFormData((prev) => ({ ...prev, club_id: value === 'null' ? null : value }));
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
        ? `/api/admin/players/${initialData.id}`
        : '/api/admin/players';
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

      toast({ description: `Pemain berhasil ${initialData ? 'diperbarui' : 'dibuat'}.` });
      onSuccess();
    } catch (error) {
      toast({ variant: 'destructive', description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
       <div className="space-y-2">
        <Label htmlFor="image">Foto Pemain</Label>
        {imagePreview && (
          <div className="mt-2">
            <Image
              src={imagePreview}
              alt="Preview Foto Pemain"
              width={128}
              height={128}
              className="rounded-md object-cover"
            />
          </div>
        )}
        <Input id="image" type="file" onChange={handleImageChange} accept="image/*" />
        <p className="text-sm text-muted-foreground">
          Pilih gambar baru untuk mengganti foto saat ini.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Nama Pemain</Label>
        <Input id="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="position">Posisi</Label>
        <Input id="position" value={formData.position} onChange={handleChange} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="birth_date">Tanggal Lahir</Label>
        <Input id="birth_date" type="date" value={formData.birth_date} onChange={handleChange} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="height_cm">Tinggi (cm)</Label>
        <Input id="height_cm" type="number" value={formData.height_cm} onChange={handleChange} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="weight_kg">Berat (kg)</Label>
        <Input id="weight_kg" type="number" value={formData.weight_kg} onChange={handleChange} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="country">Negara</Label>
        <Input id="country" value={formData.country} onChange={handleChange} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="achievements">Prestasi</Label>
        <Textarea id="achievements" value={formData.achievements} onChange={handleChange} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="club_id">Klub</Label>
        <Select onValueChange={handleClubChange} value={formData.club_id ?? 'null'}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih Klub" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="null">Tanpa Klub</SelectItem>
            {clubs.map((club) => (
              <SelectItem key={club.id} value={club.id}>
                {club.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
};

export default PlayerForm;

