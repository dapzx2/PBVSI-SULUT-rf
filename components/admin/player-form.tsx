'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Loader2, Upload, X, User, MapPin, Calendar as CalendarIcon, Ruler, Weight, Flag, Trophy, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

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
    photo_url: initialData?.photo_url || null,
    birth_date: initialData?.birth_date || '',
    height: initialData?.height || '',
    weight: initialData?.weight || '',
    achievements: initialData?.achievements || '',
  });
  const [clubs, setClubs] = useState<Club[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.photo_url || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  useEffect(() => {
    async function fetchClubs() {
      try {
        const response = await fetch('/api/admin/clubs');
        if (!response.ok) throw new Error('Gagal memuat klub');
        const data = await response.json();
        setClubs(data.filter((club: Club) => club.id));
      } catch (error: any) {
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

  const handlePositionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, position: value }));
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

  const removePhoto = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let finalImageUrl = formData.photo_url;

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
        photo_url: finalImageUrl,
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
    } catch (error: any) {
      toast({ variant: 'destructive', description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Photo & Main Info */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="photo" className="flex items-center gap-2 text-primary">
              <Upload className="h-4 w-4" /> Foto Pemain
            </Label>
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors hover:bg-muted/50 relative min-h-[240px] flex flex-col items-center justify-center",
                imagePreview ? "border-primary/50" : "border-muted-foreground/25"
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <Input
                ref={fileInputRef}
                id="photo"
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />

              {imagePreview ? (
                <div className="relative w-full h-full min-h-[240px]">
                  <Image
                    src={imagePreview}
                    alt="Preview Foto Pemain"
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
                      removePhoto();
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground py-8">
                  <div className="p-3 bg-muted rounded-full">
                    <Upload className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium">Klik atau tarik foto ke sini</p>
                  <p className="text-xs">PNG, JPG (Max 5MB)</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-primary">
              <User className="h-4 w-4" /> Nama Pemain
            </Label>
            <Input id="name" value={formData.name} onChange={handleChange} required placeholder="Nama lengkap pemain" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position" className="flex items-center gap-2 text-primary">
              <MapPin className="h-4 w-4" /> Posisi
            </Label>
            <Select onValueChange={handlePositionChange} value={formData.position}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Posisi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Spiker">Spiker</SelectItem>
                <SelectItem value="Libero">Libero</SelectItem>
                <SelectItem value="Tosser">Tosser</SelectItem>
                <SelectItem value="Blocker">Blocker</SelectItem>
                <SelectItem value="Server">Server</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 flex flex-col">
            <Label htmlFor="birth_date" className="flex items-center gap-2 text-primary">
              <CalendarIcon className="h-4 w-4" /> Tanggal Lahir
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !formData.birth_date && "text-muted-foreground"
                  )}
                >
                  {formData.birth_date ? (
                    format(new Date(formData.birth_date), "dd MMMM yyyy", { locale: idLocale })
                  ) : (
                    <span>Pilih tanggal lahir</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.birth_date ? new Date(formData.birth_date) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      // Adjust for timezone offset to prevent off-by-one error when converting to string
                      const offsetDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
                      setFormData(prev => ({ ...prev, birth_date: offsetDate.toISOString().split('T')[0] }));
                    }
                  }}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                  captionLayout="dropdown"
                  fromYear={1940}
                  toYear={new Date().getFullYear() + 5}
                  classNames={{
                    caption_label: "hidden",
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="club_id" className="flex items-center gap-2 text-primary">
              <Shield className="h-4 w-4" /> Klub
            </Label>
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
        </div>

        {/* Right Column: Stats & Achievements */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height" className="flex items-center gap-2 text-primary">
                <Ruler className="h-4 w-4" /> Tinggi (cm)
              </Label>
              <Input id="height" type="number" value={formData.height} onChange={handleChange} placeholder="Contoh: 180" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight" className="flex items-center gap-2 text-primary">
                <Weight className="h-4 w-4" /> Berat (kg)
              </Label>
              <Input id="weight" type="number" value={formData.weight} onChange={handleChange} placeholder="Contoh: 75" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="achievements" className="flex items-center gap-2 text-primary">
              <Trophy className="h-4 w-4" /> Prestasi
            </Label>
            <Textarea
              id="achievements"
              value={formData.achievements}
              onChange={handleChange}
              placeholder="Daftar prestasi pemain (pisahkan dengan enter)"
              rows={10}
              className="resize-none"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
          Batal
        </Button>
        <Button type="submit" className="min-w-[140px]" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Simpan Perubahan' : 'Tambah Pemain'}
        </Button>
      </div>
    </form>
  );
};

export default PlayerForm;
