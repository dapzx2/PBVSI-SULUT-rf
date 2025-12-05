"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Loader2, PlusCircle, Edit, Trash2, FileText, Search, RefreshCw, FolderOpen, File } from "lucide-react"
import { PublicInformation } from "@/lib/types"
import { PublicInformationForm } from "@/components/admin/public-information-form"
import { toast } from "sonner"
import { formatDateShort } from "@/lib/date-utils"

export default function AdminPublicInformationPage() {
    const [documents, setDocuments] = useState<PublicInformation[]>([])
    const [filteredDocuments, setFilteredDocuments] = useState<PublicInformation[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [currentDocument, setCurrentDocument] = useState<PublicInformation | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fetchDocuments = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch("/api/public-information")
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data: PublicInformation[] = await response.json()
            setDocuments(data)
            setFilteredDocuments(data)
        } catch (e: any) {
            setError(e.message)
            toast.error("Gagal memuat dokumen: " + e.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDocuments()
    }, [])

    useEffect(() => {
        if (searchQuery) {
            const filtered = documents.filter(doc =>
                doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()))
            )
            setFilteredDocuments(filtered)
        } else {
            setFilteredDocuments(documents)
        }
    }, [searchQuery, documents])

    const handleAddDocument = () => {
        setCurrentDocument(null)
        setIsFormOpen(true)
    }

    const handleEditDocument = (doc: PublicInformation) => {
        setCurrentDocument(doc)
        setIsFormOpen(true)
    }

    const handleDeleteDocument = (doc: PublicInformation) => {
        setCurrentDocument(doc)
        setIsDeleteDialogOpen(true)
    }

    const handleFormSubmit = async (data: Omit<PublicInformation, 'id' | 'created_at' | 'updated_at'> & { file?: File | null }) => {
        setIsSubmitting(true)
        try {
            let finalFileUrl = currentDocument?.file_url || "";
            const { file, ...restOfData } = data;

            if (file) {
                const formData = new FormData();
                formData.append('file', file);

                const uploadResponse = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!uploadResponse.ok) {
                    const errorData = await uploadResponse.json();
                    throw new Error(errorData.error || `Gagal mengunggah file: ${uploadResponse.status}`);
                }
                const uploadResult = await uploadResponse.json();
                finalFileUrl = uploadResult.url;
            } else if (!currentDocument && !file) {
                throw new Error("File wajib diunggah untuk dokumen baru");
            }

            const payload = {
                ...restOfData,
                file_url: finalFileUrl,
            };

            let response: Response
            if (currentDocument) {
                response = await fetch("/api/public-information", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: currentDocument.id, ...payload }),
                })
            } else {
                response = await fetch("/api/public-information", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                })
            }

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
            }

            toast.success(`Dokumen berhasil ${currentDocument ? "diperbarui" : "ditambahkan"}`)
            setIsFormOpen(false)
            fetchDocuments()
        } catch (e: any) {
            toast.error("Gagal menyimpan dokumen: " + e.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleConfirmDelete = async () => {
        if (!currentDocument) return

        setIsSubmitting(true)
        try {
            const response = await fetch("/api/public-information", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: currentDocument.id }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
            }

            toast.success("Dokumen berhasil dihapus")
            setIsDeleteDialogOpen(false)
            fetchDocuments()
        } catch (e: any) {
            toast.error("Gagal menghapus dokumen: " + e.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            "Laporan Keuangan": "bg-green-100 text-green-800",
            "Program Kerja": "bg-blue-100 text-blue-800",
            "Surat Keputusan": "bg-purple-100 text-purple-800",
            "Peraturan": "bg-orange-100 text-orange-800",
            "Lainnya": "bg-gray-100 text-gray-800"
        }
        return colors[category] || "bg-gray-100 text-gray-800"
    }

    return (
        <div className="container mx-auto py-8">
            <Card className="border-none shadow-md">
                <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                    <div>
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            <FolderOpen className="h-6 w-6 text-primary" />
                            Manajemen Informasi Publik
                        </CardTitle>
                        <CardDescription className="mt-1">
                            Kelola dokumen publik seperti laporan keuangan, program kerja, dan peraturan.
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <Button variant="outline" size="icon" onClick={fetchDocuments} disabled={loading}>
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                        <Button onClick={handleAddDocument} className="flex-1 md:flex-none">
                            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Dokumen
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="mb-6 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari dokumen berdasarkan judul atau kategori..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {loading && documents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                            <Loader2 className="h-8 w-8 animate-spin mb-2 text-primary" />
                            <p>Memuat dokumen...</p>
                        </div>
                    ) : filteredDocuments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border-2 border-dashed rounded-lg">
                            <FolderOpen className="h-12 w-12 mb-2 opacity-20" />
                            <p className="font-medium">Tidak ada dokumen ditemukan</p>
                            {searchQuery && <p className="text-sm">Coba kata kunci pencarian lain</p>}
                            {!searchQuery && (
                                <Button variant="link" onClick={handleAddDocument} className="mt-2">
                                    Tambah Dokumen Baru
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="rounded-md border overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead>Judul</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead>File</TableHead>
                                        <TableHead>Tanggal Upload</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDocuments.map((doc) => (
                                        <TableRow key={doc.id} className="hover:bg-muted/5">
                                            <TableCell className="font-medium max-w-[300px]">
                                                <div className="truncate" title={doc.title}>
                                                    {doc.title}
                                                </div>
                                                {doc.description && (
                                                    <p className="text-xs text-muted-foreground truncate mt-1">
                                                        {doc.description}
                                                    </p>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className={`${getCategoryColor(doc.category)} border-none`}>
                                                    {doc.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <a
                                                    href={doc.file_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline"
                                                >
                                                    <File className="w-4 h-4" />
                                                    <span className="text-sm">Lihat File</span>
                                                </a>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDateShort(doc.created_at)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleEditDocument(doc)}
                                                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        <span className="sr-only">Ubah</span>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDeleteDocument(doc)}
                                                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col p-0 gap-0">
                    <DialogHeader className="px-6 py-4 border-b">
                        <DialogTitle>{currentDocument ? "Ubah Dokumen" : "Tambah Dokumen Baru"}</DialogTitle>
                        <DialogDescription>
                            {currentDocument ? "Edit detail dokumen publik." : "Isi detail untuk dokumen publik baru."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto p-6">
                        <PublicInformationForm
                            initialData={currentDocument}
                            onSubmit={handleFormSubmit}
                            onCancel={() => setIsFormOpen(false)}
                            isLoading={isSubmitting}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Hapus Dokumen</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus dokumen &quot;{currentDocument?.title}&quot;? Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            disabled={isSubmitting}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Menghapus..." : "Hapus"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
