"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import type { GalleryItem } from "@/lib/types"
import { Loader2 } from "lucide-react"

const galleryFormSchema = z.object({
  title: z.string().min(2, { message: "Judul harus minimal 2 karakter." }),
  description: z.string().nullable().optional(),
  image_url: z.string().url({ message: "URL gambar tidak valid." }).or(z.literal("")),
  category: z.string().min(1, { message: "Kategori harus dipilih." }),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Format tanggal acara YYYY-MM-DD." }),
  tags: z.string().optional(), // Assuming tags are stored as a comma-separated string or JSON string
})

interface GalleryFormProps {
  initialData?: GalleryItem | null
  onSuccess: () => void
  onClose: () => void
}

export function GalleryForm({ initialData, onSuccess, onClose }: GalleryFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof galleryFormSchema>>({
    resolver: zodResolver(galleryFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      image_url: initialData?.image_url || "",
      category: initialData?.category || "",
      event_date: initialData?.event_date || "",
      tags: initialData?.tags ? JSON.stringify(initialData.tags) : "",
    },
  })

  async function onSubmit(values: z.infer<typeof galleryFormSchema>) {
    setIsSubmitting(true)
    try {
      const payload = {
        ...values,
        description: values.description === "" ? null : values.description,
        image_url: values.image_url === "" ? null : values.image_url,
        tags: values.tags ? JSON.parse(values.tags) : null,
      }

      let response
      if (initialData) {
        response = await fetch(`/api/admin/gallery/${initialData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      } else {
        response = await fetch("/api/admin/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Gagal menyimpan item galeri.")
      }

      toast({
        title: "Sukses",
        description: `Item galeri berhasil ${initialData ? "diperbarui" : "ditambahkan"}.`,
      })
      onSuccess()
      onClose()
    } catch (error: any) {
      toast({
        title: "Kesalahan",
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul</FormLabel>
              <FormControl>
                <Input placeholder="Judul Foto/Acara" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea placeholder="Deskripsi singkat tentang foto/acara" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Gambar</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Berita">Berita</SelectItem>
                  <SelectItem value="Pemain Putri">Pemain Putri</SelectItem>
                  <SelectItem value="Pemain Putra">Pemain Putra</SelectItem>
                  <SelectItem value="Pengurus">Pengurus</SelectItem>
                  <SelectItem value="Umum">Umum</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="event_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tanggal Acara</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tag (Array JSON)</FormLabel>
              <FormControl>
                <Input placeholder='["voli", "turnamen", "sulut"]' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Simpan Perubahan" : "Tambah Item Galeri"}
        </Button>
      </form>
    </Form>
  )
}
