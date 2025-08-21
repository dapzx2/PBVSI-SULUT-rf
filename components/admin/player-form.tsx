"use client"

import { useState, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import type { Player, Club } from "@/lib/types" // Changed from supabase to types
import { Loader2 } from "lucide-react"

const playerFormSchema = z.object({
  name: z.string().min(2, { message: "Nama harus minimal 2 karakter." }),
  position: z.string().min(2, { message: "Posisi harus minimal 2 karakter." }),
  club_id: z.string().nullable().optional(),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Format tanggal lahir YYYY-MM-DD." }),
  height: z.coerce
    .number()
    .min(100, { message: "Tinggi minimal 100 cm." })
    .max(250, { message: "Tinggi maksimal 250 cm." }),
  weight: z.coerce
    .number()
    .min(30, { message: "Berat minimal 30 kg." })
    .max(150, { message: "Berat maksimal 150 kg." }),
  photo_url: z.string().url({ message: "URL foto tidak valid." }).nullable().optional().or(z.literal("")),
  achievements: z.string().optional(), // Assuming achievements are stored as a JSON string or similar
})

interface PlayerFormProps {
  initialData?: Player | null
  onSuccess: () => void
  onClose: () => void
}

export function PlayerForm({ initialData, onSuccess, onClose }: PlayerFormProps) {
  const { toast } = useToast()
  const [clubs, setClubs] = useState<Club[]>([])
  const [loadingClubs, setLoadingClubs] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof playerFormSchema>>({
    resolver: zodResolver(playerFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      position: initialData?.position || "",
      club_id: initialData?.club_id || null,
      birth_date: initialData?.birth_date || "",
      height: initialData?.height || 0,
      weight: initialData?.weight || 0,
      photo_url: initialData?.photo_url || "",
      achievements: initialData?.achievements ? JSON.stringify(initialData.achievements) : "",
    },
  })

  const fetchClubs = useCallback(async () => {
    try {
      const response = await fetch("/api/clubs") // Assuming a public API endpoint for clubs
      if (!response.ok) {
        throw new Error("Gagal memuat daftar klub.")
      }
      const data = await response.json()
      setClubs(data.clubs)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoadingClubs(false)
    }
  }, [toast])

  useEffect(() => {
    fetchClubs()
  }, [fetchClubs])

  async function onSubmit(values: z.infer<typeof playerFormSchema>) {
    setIsSubmitting(true)
    try {
      const payload = {
        ...values,
        height: Number(values.height),
        weight: Number(values.weight),
        achievements: values.achievements ? JSON.parse(values.achievements) : null,
        club_id: values.club_id === "none" ? null : values.club_id, // Handle "none" for club_id
      }

      let response
      if (initialData) {
        response = await fetch(`/api/admin/players?id=${initialData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      } else {
        response = await fetch("/api/admin/players", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Gagal menyimpan data pemain.")
      }

      toast({
        title: "Sukses",
        description: `Pemain berhasil ${initialData ? "diperbarui" : "ditambahkan"}.`,
      })
      onSuccess()
      onClose()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input placeholder="Nama Pemain" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Posisi</FormLabel>
              <FormControl>
                <Input placeholder="Posisi (e.g., Setter, Spiker)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="club_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Klub</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value || "none"}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Klub" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {loadingClubs ? (
                    <SelectItem value="loading" disabled>
                      Memuat klub...
                    </SelectItem>
                  ) : (
                    <>
                      <SelectItem value="none">Tidak Ada Klub</SelectItem>
                      {clubs.map((club) => (
                        <SelectItem key={club.id} value={club.id}>
                          {club.name}
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birth_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tanggal Lahir</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tinggi (cm)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} value={String(field.value)} /> {/* Explicitly cast to string */}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Berat (kg)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} value={String(field.value)} /> {/* Explicitly cast to string */}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="photo_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Foto</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/photo.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="achievements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prestasi (JSON Array)</FormLabel>
              <FormControl>
                <Input placeholder='["Juara Liga 2023", "MVP 2022"]' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Simpan Perubahan" : "Tambah Pemain"}
        </Button>
      </form>
    </Form>
  )
}
