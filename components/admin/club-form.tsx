"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import type { Club } from "@/lib/types"
import { Loader2 } from "lucide-react"

const clubFormSchema = z.object({
  name: z.string().min(2, { message: "Nama klub harus minimal 2 karakter." }),
  city: z.string().min(2, { message: "Kota harus minimal 2 karakter." }),
  established_year: z.coerce.number().min(1900, { message: "Tahun berdiri tidak valid." }).max(new Date().getFullYear(), { message: "Tahun berdiri tidak boleh di masa depan." }),
  coach_name: z.string().min(2, { message: "Nama pelatih harus minimal 2 karakter." }),
  logo_url: z.string().url({ message: "URL logo tidak valid." }).nullable().optional().or(z.literal("")),
  description: z.string().nullable().optional(),
  achievements: z.string().optional(),
})

interface ClubFormProps {
  initialData?: Club | null
  onSuccess: (uploadedLogoUrl?: string) => void
  onClose: () => void
}

export function ClubForm({ initialData, onSuccess, onClose }: ClubFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)

  const form = useForm<z.infer<typeof clubFormSchema>>({
    resolver: zodResolver(clubFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      city: initialData?.city || "",
      established_year: initialData?.established_year || 0,
      coach_name: initialData?.coach_name || "",
      logo_url: initialData?.logo_url || "",
      description: initialData?.description || "",
      achievements: initialData?.achievements || "",
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name || "",
        city: initialData.city || "",
        established_year: initialData.established_year || 0,
        coach_name: initialData.coach_name || "",
        logo_url: initialData.logo_url || "",
        description: initialData.description || "",
        achievements: initialData.achievements || "",
      })
      setLogoFile(null) // Clear file input on edit
    }
  }, [initialData, form])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0])
    } else {
      setLogoFile(null)
    }
  }

  async function onSubmit(values: z.infer<typeof clubFormSchema>) {
    setIsSubmitting(true)
    let uploadedLogoUrl: string | null = values.logo_url || null

    try {
      if (logoFile) {
        const formData = new FormData()
        formData.append("file", logoFile)

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json()
          throw new Error(errorData.error || "Gagal mengunggah logo.")
        }
        const uploadData = await uploadResponse.json()
        uploadedLogoUrl = uploadData.url
      }

      const payload = {
        ...values,
        logo_url: uploadedLogoUrl,
        achievements: values.achievements || null,
        description: values.description === "" ? null : values.description,
      }

      let response: Response
      if (initialData) {
        response = await fetch(`/api/admin/clubs?id=${initialData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      } else {
        response = await fetch("/api/admin/clubs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Gagal menyimpan data klub.")
      }

      toast({
        title: "Sukses",
        description: `Klub berhasil ${initialData ? "diperbarui" : "ditambahkan"}.`,
      })
      onSuccess(uploadedLogoUrl || undefined)
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Klub</FormLabel>
              <FormControl>
                <Input placeholder="Nama lengkap klub" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kota</FormLabel>
              <FormControl>
                <Input placeholder="Kota asal klub" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="established_year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tahun Berdiri</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Contoh: 2005" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coach_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pelatih</FormLabel>
              <FormControl>
                <Input placeholder="Nama pelatih utama" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <FormLabel>Unggah Logo Baru</FormLabel>
          <Input id="logoUpload" type="file" accept="image/*" onChange={handleFileChange} />
          {logoFile && <p className="text-sm text-gray-500 mt-1">File dipilih: {logoFile.name}</p>}
          {initialData?.logo_url && !logoFile && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">Logo saat ini:</p>
              <img src={initialData.logo_url} alt="Current Club Logo" className="max-h-40 object-contain" />
            </div>
          )}
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea placeholder="Deskripsi singkat tentang klub" {...field} />
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
              <FormLabel>Prestasi</FormLabel>
              <FormControl>
                <Input placeholder='Daftar prestasi klub (pisahkan dengan koma)' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Simpan Perubahan" : "Tambah Klub"}
        </Button>
      </form>
    </Form>
  )
}
