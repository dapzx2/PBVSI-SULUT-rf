'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Match, Club } from '@/lib/types';
import { Loader2, Shield, Calendar, MapPin, Trophy, TrendingUp } from 'lucide-react';

interface MatchFormProps {
  initialData: Match | null;
  onSuccess: () => void;
  onClose: () => void;
  clubs: Club[];
}

export function MatchForm({ initialData, onSuccess, onClose, clubs }: MatchFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    home_team_id: initialData?.home_team_id || '',
    away_team_id: initialData?.away_team_id || '',
    match_date: initialData?.match_date ? (() => {
      const date = new Date(initialData.match_date);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    })() : '',
    score_home_sets: initialData?.score_home_sets || 0,
    score_away_sets: initialData?.score_away_sets || 0,
    score_home_points: initialData?.score_home_points || [],
    score_away_points: initialData?.score_away_points || [],
    status: initialData?.status || 'scheduled',
    league: initialData?.league || '',
    venue: initialData?.venue || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id.startsWith('score_') ? (value === '' ? null : (isNaN(parseInt(value)) ? null : parseInt(value))) : value,
    }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const apiEndpoint = initialData
        ? `/api/admin/matches/${initialData.id}`
        : '/api/admin/matches';
      const method = initialData ? 'PUT' : 'POST';

      const body = {
        ...formData,
        match_date: new Date(formData.match_date).toISOString(),
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

      toast({ description: `Pertandingan berhasil ${initialData ? 'diperbarui' : 'dibuat'}.` });
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
        {/* Left Column: Teams & Match Details */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="home_team_id" className="flex items-center gap-2 text-primary">
              <Shield className="h-4 w-4" /> Tim Kandang
            </Label>
            <Select
              onValueChange={(value) => handleSelectChange('home_team_id', value)}
              value={formData.home_team_id}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Tim Kandang" />
              </SelectTrigger>
              <SelectContent>
                {clubs.map((club) => (
                  <SelectItem key={club.id} value={club.id}>
                    {club.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="away_team_id" className="flex items-center gap-2 text-primary">
              <Shield className="h-4 w-4" /> Tim Tandang
            </Label>
            <Select
              onValueChange={(value) => handleSelectChange('away_team_id', value)}
              value={formData.away_team_id}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Tim Tandang" />
              </SelectTrigger>
              <SelectContent>
                {clubs.map((club) => (
                  <SelectItem key={club.id} value={club.id}>
                    {club.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="match_date" className="flex items-center gap-2 text-primary">
              <Calendar className="h-4 w-4" /> Tanggal & Waktu
            </Label>
            <Input
              id="match_date"
              type="datetime-local"
              value={formData.match_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="venue" className="flex items-center gap-2 text-primary">
              <MapPin className="h-4 w-4" /> Venue
            </Label>
            <Input id="venue" value={formData.venue} onChange={handleChange} placeholder="Lokasi pertandingan" />
          </div>
        </div>

        {/* Right Column: Scores & Status */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="score_home_sets" className="flex items-center gap-2 text-primary">
                <TrendingUp className="h-4 w-4" /> Skor Set Kandang
              </Label>
              <Input
                id="score_home_sets"
                type="number"
                value={formData.score_home_sets === null ? '' : String(formData.score_home_sets)}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="score_away_sets" className="flex items-center gap-2 text-primary">
                <TrendingUp className="h-4 w-4" /> Skor Set Tandang
              </Label>
              <Input
                id="score_away_sets"
                type="number"
                value={formData.score_away_sets === null ? '' : String(formData.score_away_sets)}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="flex items-center gap-2 text-primary">
              <TrendingUp className="h-4 w-4" /> Status
            </Label>
            <Select
              onValueChange={(value) => handleSelectChange('status', value)}
              value={formData.status}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Terjadwal</SelectItem>
                <SelectItem value="live">Sedang Berlangsung</SelectItem>
                <SelectItem value="finished">Selesai</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="league" className="flex items-center gap-2 text-primary">
              <Trophy className="h-4 w-4" /> Turnamen
            </Label>
            <Input id="league" value={formData.league} onChange={handleChange} placeholder="Nama turnamen" />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
          Batal
        </Button>
        <Button type="submit" className="min-w-[140px]" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Simpan Perubahan' : 'Tambah Pertandingan'}
        </Button>
      </div>
    </form>
  );
}
