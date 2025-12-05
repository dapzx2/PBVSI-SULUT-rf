"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Download, Shield, Eye } from "lucide-react"
import { PublicInformation } from "@/lib/types"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { formatDateShort } from "@/lib/date-utils"

interface PublicInformationListProps {
    documents: PublicInformation[]
}

export function PublicInformationList({ documents }: PublicInformationListProps) {
    const [selectedDoc, setSelectedDoc] = useState<PublicInformation | null>(null)

    const getFileExtension = (url: string) => {
        return url.split(/[#?]/)[0].split('.').pop()?.trim().toLowerCase() || '';
    }

    // Mendapatkan nama file dari URL
    const getFilename = (url: string) => {
        return url.split('/').pop() || '';
    }

    // Mengubah URL file untuk menggunakan API route yang menyajikan dengan Content-Disposition: inline
    const getPreviewUrl = (fileUrl: string) => {
        const filename = getFilename(fileUrl);
        return `/api/files/${filename}`;
    }

    const renderPreviewContent = (doc: PublicInformation) => {
        const extension = getFileExtension(doc.file_url);
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        const pdfExtensions = ['pdf'];
        const officeExtensions = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
        const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

        // Gambar bisa ditampilkan langsung
        if (imageExtensions.includes(extension)) {
            return (
                <div className="relative w-full h-[60vh] flex items-center justify-center bg-gray-100 rounded-md overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={doc.file_url}
                        alt={doc.title}
                        className="max-w-full max-h-full object-contain"
                    />
                </div>
            );
        }

        // PDF - menggunakan API route untuk menyajikan dengan Content-Disposition: inline
        if (pdfExtensions.includes(extension)) {
            // URL untuk pratinjau (dengan inline disposition)
            const previewUrl = getPreviewUrl(doc.file_url);
            const fullPreviewUrl = typeof window !== 'undefined'
                ? new URL(previewUrl, window.location.origin).toString()
                : previewUrl;

            return (
                <div className="flex flex-col h-full">
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <Shield className="h-5 w-5 text-blue-400" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-blue-700">
                                    <strong>Tips:</strong> Jika dokumen tidak muncul atau layar putih, silakan klik tombol <strong>Buka di Tab Baru</strong> atau <strong>Unduh PDF</strong>.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mb-2 px-1">
                        <a
                            href={fullPreviewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            <Eye className="w-4 h-4 mr-2" />
                            Buka di Tab Baru
                        </a>
                        <a
                            href={doc.file_url}
                            download
                            className="inline-flex items-center px-3 py-1.5 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Unduh PDF
                        </a>
                    </div>
                    <iframe
                        src={fullPreviewUrl}
                        className="w-full h-[70vh] rounded-md border border-gray-200 bg-white"
                        title={doc.title}
                    />
                </div>
            );
        }

        // File Office (Word, Excel, PowerPoint) dan lainnya
        // Di localhost, Google Docs Viewer tidak bisa mengakses file lokal
        if (isLocalhost) {
            return (
                <div className="flex flex-col items-center justify-center h-[40vh] text-center p-6 bg-amber-50 rounded-md border border-amber-200">
                    <FileText className="w-16 h-16 text-amber-500 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Pratinjau Tidak Tersedia di Mode Pengembangan
                    </h3>
                    <p className="text-gray-600 mb-2 max-w-md">
                        Pratinjau untuk file <strong>.{extension}</strong> menggunakan Google Docs Viewer yang membutuhkan URL publik.
                    </p>
                    <p className="text-sm text-amber-700 mb-6 max-w-md">
                        Karena Anda mengakses dari <strong>localhost</strong>, Google tidak dapat mengakses file ini.
                        Fitur ini akan berfungsi normal setelah di-deploy ke server publik.
                    </p>
                    <div className="flex gap-3">
                        <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            <Eye className="w-4 h-4 mr-2" />
                            Buka File
                        </a>
                        <a
                            href={doc.file_url}
                            download
                            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Unduh File
                        </a>
                    </div>
                </div>
            );
        }

        // Di production, gunakan Google Docs Viewer untuk file Office
        const fullUrl = new URL(doc.file_url, window.location.origin).toString();
        const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fullUrl)}&embedded=true`;

        return (
            <div className="flex flex-col h-full">
                <div className="flex justify-end gap-2 mb-2 px-1">
                    <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Buka di Tab Baru
                    </a>
                    <a
                        href={doc.file_url}
                        download
                        className="inline-flex items-center px-3 py-1.5 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Unduh File
                    </a>
                </div>
                <iframe
                    src={viewerUrl}
                    className="w-full h-[70vh] rounded-md border border-gray-200"
                    title={doc.title}
                />
            </div>
        );
    };

    return (
        <>
            {documents.length === 0 ? (
                // Empty State
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Card className="bg-white">
                        <CardContent className="p-12 text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FileText className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Belum Ada Dokumen</h3>
                            <p className="text-gray-600 text-lg max-w-md mx-auto">
                                Dokumen publik belum tersedia saat ini. Kami akan mengunggah dokumen segera.
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            ) : (
                // Documents List
                <div className="space-y-4">
                    {documents.map((doc, index) => (
                        <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <Card className="hover:shadow-lg transition-shadow duration-300">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <FileText className="w-8 h-8 text-orange-500 mr-4" />
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">{doc.title}</h3>
                                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                                <span>{doc.category}</span>
                                                <span className="mx-2">•</span>
                                                <span>{formatDateShort(doc.created_at)}</span>
                                            </div>
                                            {doc.description && (
                                                <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setSelectedDoc(doc);
                                            }}
                                            className="flex items-center text-gray-600 hover:text-orange-600 transition-colors"
                                            title="Pratinjau Dokumen"
                                        >
                                            <Eye className="w-5 h-5 mr-2" />
                                            <span className="hidden md:inline">Pratinjau</span>
                                        </button>
                                        <a
                                            href={doc.file_url}
                                            download
                                            onClick={(e) => e.stopPropagation()}
                                            className="flex items-center text-orange-600 hover:text-orange-700 font-medium transition-colors"
                                            title="Unduh Dokumen"
                                        >
                                            <Download className="w-5 h-5 mr-2" />
                                            <span>Unduh</span>
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Preview Modal */}
            <Dialog open={!!selectedDoc} onOpenChange={(open) => !open && setSelectedDoc(null)}>
                <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>{selectedDoc?.title}</DialogTitle>
                        <DialogDescription>
                            Pratinjau dokumen publik: {selectedDoc?.title}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 overflow-auto p-1">
                        {selectedDoc && renderPreviewContent(selectedDoc)}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
