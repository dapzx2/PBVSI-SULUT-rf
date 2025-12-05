"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Clock,
    UserPlus,
    Trophy,
    FileText,
    ImageIcon,
    Shield,
    ArrowRight,
} from "lucide-react"
import { AdminActivityLog } from "@/lib/admin"
import { useRouter } from "next/navigation"

// Kamus terjemahan aksi ke Bahasa Indonesia yang ramah pengguna
const actionTranslations: Record<string, string> = {
    "create": "Tambah",
    "update": "Ubah",
    "delete": "Hapus",
    "edit": "Edit",
    "add": "Tambah",
    "remove": "Hapus",
    "player": "Pemain",
    "pemain": "Pemain",
    "match": "Pertandingan",
    "pertandingan": "Pertandingan",
    "article": "Berita",
    "berita": "Berita",
    "news": "Berita",
    "gallery": "Galeri",
    "galeri": "Galeri",
    "club": "Klub",
    "klub": "Klub",
    "team": "Tim",
    "tim": "Tim",
    "user": "Pengguna",
    "admin": "Admin",
    "public": "Publik",
    "information": "Informasi",
    "informasi": "Informasi",
    "image": "Gambar",
    "login": "Masuk",
    "logout": "Keluar",
    "success": "Berhasil",
    "failed": "Gagal",
}

// Fungsi untuk menerjemahkan aksi ke Bahasa Indonesia yang ramah pengguna
const translateAction = (action: string): string => {
    const words = action
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .toLowerCase()
        .split('_')
        .filter(word => word.length > 0)

    const translatedWords = words.map(word => {
        const translation = actionTranslations[word]
        if (translation) return translation
        return word.charAt(0).toUpperCase() + word.slice(1)
    })

    return translatedWords.join(' ')
}

// Fungsi untuk memformat waktu ke format "5 Des 10:01:03 WITA"
const formatTimestamp = (timestamp: string | Date): string => {
    const date = new Date(timestamp)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

    const day = date.getDate()
    const month = months[date.getMonth()]
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')

    return `${day} ${month} ${hours}:${minutes}:${seconds} WITA`
}

interface DashboardRecentActivityProps {
    activities: AdminActivityLog[]
}

export function DashboardRecentActivity({ activities }: DashboardRecentActivityProps) {
    const router = useRouter()

    const getActivityIcon = (action: string) => {
        if (action.includes("player") || action.includes("pemain")) return <UserPlus className="h-4 w-4 text-blue-600" />
        if (action.includes("match") || action.includes("pertandingan")) return <Trophy className="h-4 w-4 text-orange-600" />
        if (action.includes("article") || action.includes("berita")) return <FileText className="h-4 w-4 text-purple-600" />
        if (action.includes("gallery") || action.includes("galeri")) return <ImageIcon className="h-4 w-4 text-pink-600" />
        if (action.includes("club") || action.includes("klub")) return <Shield className="h-4 w-4 text-green-600" />
        return <Clock className="h-4 w-4 text-gray-600" />
    }

    return (
        <Card className="bg-white col-span-3">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    Aktivitas Terbaru
                </CardTitle>
                <CardDescription>Aktivitas sistem dalam 24 jam terakhir</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {activities.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">Belum ada aktivitas tercatat.</p>
                    ) : (
                        activities.map((activity) => (
                            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="flex-shrink-0 mt-1">
                                    {getActivityIcon(activity.action)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">{translateAction(activity.action)}</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <p className="text-xs text-gray-500 font-medium">{activity.username || "Unknown User"}</p>
                                        <span className="text-xs text-gray-300">•</span>
                                        <p className="text-xs text-gray-400">{formatTimestamp(activity.timestamp)}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="mt-6">
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full group"
                        onClick={() => router.push("/admin/activity")}
                    >
                        Lihat Semua Aktivitas
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
