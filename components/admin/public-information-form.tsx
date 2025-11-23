"use client"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader2, Upload, X, FileText, Tag, AlignLeft } from "lucide-react"
import { PublicInformation } from "@/lib/types"
import { cn } from "@/lib/utils"

const formSchema = z.object({
    title: z.string().min(2, "Judul harus minimal 2 karakter"),
    description: z.string().optional(),
    category: z.string().min(1, "Kategori harus dipilih"),
    file: z.any().optional(),
})

interface PublicInformationFormProps {
    initialData?: PublicInformation | null
    onSubmit: (data: any) => void
    onCancel: () => void
    isLoading: boolean
}

export function PublicInformationForm({
    initialData,
    onSubmit,
    onCancel,
    isLoading,
}: PublicInformationFormProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
            category: initialData?.category || "",
        },
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0])
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setSelectedFile(e.dataTransfer.files[0])
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    const removeFile = () => {
        setSelectedFile(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit({
            ...values,
            file: selectedFile,
        })
    }

    const getFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2 text-primary">
                                <FileText className="h-4 w-4" /> Judul Dokumen
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Masukkan judul dokumen" {...field} />
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
                            <FormLabel className="flex items-center gap-2 text-primary">
                                <Tag className="h-4 w-4" /> Kategori
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih kategori" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Laporan Keuangan">Laporan Keuangan</SelectItem>
                                    <SelectItem value="Program Kerja">Program Kerja</SelectItem>
                                    <SelectItem value="Surat Keputusan">Surat Keputusan</SelectItem>
                                    <SelectItem value="Peraturan">Peraturan</SelectItem>
                                    <SelectItem value="Lainnya">Lainnya</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2 text-primary">
                                <AlignLeft className="h-4 w-4" /> Deskripsi (Opsional)
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Masukkan deskripsi singkat tentang dokumen"
                                    className="resize-none"
                                    rows={3}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormItem>
                    <FormLabel className="flex items-center gap-2 text-primary">
                        <Upload className="h-4 w-4" /> File Dokumen
                    </FormLabel>
                    <div
                        className={cn(
                            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors hover:bg-muted/50 relative",
                            selectedFile ? "border-primary/50" : "border-muted-foreground/25"
                        )}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx,.xls,.xlsx"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {selectedFile ? (
                            <div className="flex flex-col items-center gap-3">
                                <div className="p-3 bg-primary/10 rounded-full">
                                    <FileText className="h-8 w-8 text-primary" />
                                </div>
                                <div className="flex-1 text-left w-full">
                                    <p className="font-medium text-sm truncate">{selectedFile.name}</p>
                                    <p className="text-xs text-muted-foreground">{getFileSize(selectedFile.size)}</p>
                                </div>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        removeFile()
                                    }}
                                >
                                    <X className="h-4 w-4 mr-1" /> Hapus
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-muted-foreground py-4">
                                <div className="p-3 bg-muted rounded-full">
                                    <Upload className="h-6 w-6" />
                                </div>
                                <p className="text-sm font-medium">Klik atau tarik file ke sini</p>
                                <p className="text-xs">PDF, DOC, DOCX, XLS, XLSX (Max 10MB)</p>
                            </div>
                        )}
                    </div>

                    {initialData?.file_url && !selectedFile && (
                        <p className="text-sm text-muted-foreground mt-2">
                            File saat ini:{" "}
                            <a
                                href={initialData.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                Lihat File
                            </a>
                        </p>
                    )}
                    <FormMessage />
                </FormItem>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                        Batal
                    </Button>
                    <Button type="submit" disabled={isLoading} className="min-w-[140px]">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? "Simpan Perubahan" : "Tambah Dokumen"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
