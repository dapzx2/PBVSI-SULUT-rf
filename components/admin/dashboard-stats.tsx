"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Users,
    Trophy,
    FileText,
    Shield,
    Loader2,
    Plus,
    UserPlus,
    FileTextIcon,
    Eye,
    ArrowUpRight,
} from "lucide-react"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

interface DashboardStatsProps {
    stats: {
        totalPlayers: number
        totalClubs: number
        totalMatches: number
        totalArticles: number
    }
    loading: boolean
}

export function DashboardStats({ stats, loading }: DashboardStatsProps) {
    const router = useRouter()

    const statItems = [
        {
            title: "Total Pemain",
            value: stats.totalPlayers,
            icon: Users,
            description: "Pemain terdaftar",
            color: "text-blue-600",
            bgColor: "bg-blue-100",
            gradient: "from-blue-500 to-cyan-500",
            link: "/admin/pemain",
            action: "Tambah",
            actionIcon: UserPlus,
        },
        {
            title: "Total Klub",
            value: stats.totalClubs,
            icon: Shield,
            description: "Klub aktif",
            color: "text-green-600",
            bgColor: "bg-green-100",
            gradient: "from-green-500 to-emerald-500",
            link: "/admin/klub",
            action: "Tambah",
            actionIcon: Plus,
        },
        {
            title: "Pertandingan",
            value: stats.totalMatches,
            icon: Trophy,
            description: "Pertandingan tercatat",
            color: "text-orange-600",
            bgColor: "bg-orange-100",
            gradient: "from-orange-500 to-red-500",
            link: "/admin/pertandingan",
            action: "Tambah",
            actionIcon: Plus,
        },
        {
            title: "Berita",
            value: stats.totalArticles,
            icon: FileText,
            description: "Artikel dipublikasi",
            color: "text-purple-600",
            bgColor: "bg-purple-100",
            gradient: "from-purple-500 to-pink-500",
            link: "/admin/berita",
            action: "Tulis",
            actionIcon: FileTextIcon,
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statItems.map((item, index) => (
                <Card
                    key={index}
                    className="bg-white relative overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 group"
                >
                    <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 bg-gradient-to-br ${item.gradient} blur-2xl group-hover:opacity-20 transition-opacity`} />

                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">{item.title}</CardTitle>
                        <div className={`p-2 rounded-full ${item.bgColor}`}>
                            <item.icon className={`h-4 w-4 ${item.color}`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <Loader2 className={`h-6 w-6 animate-spin ${item.color}`} />
                        ) : (
                            <div className="flex items-baseline space-x-2">
                                <div className="text-3xl font-bold text-gray-900">{item.value}</div>
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">{item.description}</p>

                        <div className="mt-4 flex items-center justify-between">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs h-8 px-2 hover:bg-gray-100"
                                onClick={() => router.push(item.link)}
                            >
                                <Eye className="h-3 w-3 mr-1" />
                                Lihat
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className={`text-xs h-8 px-2 border-${item.color.split('-')[1]}-200 hover:bg-${item.color.split('-')[1]}-50 text-${item.color.split('-')[1]}-700`}
                                onClick={() => router.push(item.link)} // For now redirect to list page, ideally open dialog
                            >
                                <item.actionIcon className="h-3 w-3 mr-1" />
                                {item.action}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
