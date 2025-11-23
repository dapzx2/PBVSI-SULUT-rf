"use client"

import { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import type { Club } from "@/lib/types"
import { Loader2, Upload, X, Shield, MapPin, Calendar, User, Trophy, AlignLeft, Home } from "lucide-react"
import { cn } from "@/lib/utils"

const clubFormSchema = z.object({
  name: z.string().min(2, { message: "Nama klub harus minimal 2 karakter." }),
  city: z.string().min(2, { message: "Kota harus minimal 2 karakter." }),
  established_year: z.number({ required_error: "Tahun berdiri wajib diisi." }).min(1900, { message: "Tahun berdiri tidak valid." }).max(new Date().getFullYear(), { message: "Tahun berdiri tidak boleh di masa depan." }),
  coach_name: z.string().min(2, { message: "Nama pelatih harus minimal 2 karakter." }),
  home_arena: z.string().min(2, { message: "Arena kandang harus minimal 2 karakter." }),
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.logo_url || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof clubFormSchema>>({
    resolver: zodResolver(clubFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      city: initialData?.city || "",
      established_year: initialData?.established_year ?? undefined,
      coach_name: initialData?.coach_name || "",
      home_arena: initialData?.home_arena || "",
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
        established_year: initialData.established_year ?? undefined,
        coach_name: initialData.coach_name || "",
        home_arena: initialData.home_arena || "",
        logo_url: initialData.logo_url || "",
        description: initialData.description || "",
        achievements: initialData.achievements || "",
      })
      setLogoFile(null)
      setPreviewUrl(initialData.logo_url || null)
    }
  }, [initialData, form])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setLogoFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      setLogoFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const removeLogo = () => {
    setLogoFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Main Info */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-primary">
                    <Shield className="h-4 w-4" /> Nama Klub
                  </FormLabel>
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
                  <FormLabel className="flex items-center gap-2 text-primary">
                    <MapPin className="h-4 w-4" /> Kota
                  </FormLabel>
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
                  <FormLabel className="flex items-center gap-2 text-primary">
                    <Calendar className="h-4 w-4" /> Tahun Berdiri
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Contoh: 2005"
                      value={field.value ?? ""}
                      onChange={(event) => {
                        const inputValue = event.target.value
                        if (inputValue === "") {
                          field.onChange(undefined)
                          return
                        }
                        const parsedValue = Number.parseInt(inputValue, 10)
                        field.onChange(Number.isNaN(parsedValue) ? undefined : parsedValue)
                      }}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
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
                  <FormLabel className="flex items-center gap-2 text-primary">
                    <User className="h-4 w-4" /> Pelatih
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nama pelatih utama" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="home_arena"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-primary">
                    <Home className="h-4 w-4" /> Arena Kandang
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nama arena/stadion kandang" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Right Column: Logo & Description */}
          <div className="space-y-4">
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-primary">
                <Upload className="h-4 w-4" /> Logo Klub
              </FormLabel>
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors hover:bg-muted/50 relative min-h-[200px] flex flex-col items-center justify-center",
                  previewUrl ? "border-primary/50" : "border-muted-foreground/25"
                )}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {previewUrl ? (
                  <div className="relative w-full h-full min-h-[200px]">
                    <Image
                      src={previewUrl}
                      alt="Logo Preview"
                      fill
                      className="object-contain rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeLogo()
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground py-4">
                    <div className="p-3 bg-muted rounded-full">
                      <Upload className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium">Klik atau tarik logo ke sini</p>
                    <p className="text-xs">PNG, JPG, SVG (Max 5MB)</p>
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-primary">
                    <AlignLeft className="h-4 w-4" /> Deskripsi
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Deskripsi singkat tentang klub"
                      rows={3}
                      className="resize-none"
                      {...field}
                    />
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
                  <FormLabel className="flex items-center gap-2 text-primary">
                    <Trophy className="h-4 w-4" /> Prestasi
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Daftar prestasi klub (pisahkan dengan koma)' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Batal
          </Button>
          <Button type="submit" className="min-w-[140px]" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Simpan Perubahan" : "Tambah Klub"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
