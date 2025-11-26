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
                                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <p className="text-xs text-gray-500 font-medium">{activity.username || "Unknown User"}</p>
                                        <span className="text-xs text-gray-300">•</span>
                                        <p className="text-xs text-gray-400">{new Date(activity.timestamp).toLocaleString("id-ID", {
                                            dateStyle: "medium",
                                            timeStyle: "short"
                                        })}</p>
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
