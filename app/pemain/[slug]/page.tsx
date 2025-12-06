"use client"

import Image from "next/image"
import Link from "next/link"
import {
    ArrowLeft,
    MapPin,
    Calendar,
    User,
    Users,
    Trophy,
    Ruler,
    Weight,
    Shield,
    WifiOff,
    RefreshCw,
} from "lucide-react"
import { motion } from "framer-motion"
import { notFound, useParams } from "next/navigation"
import { useState, useEffect, useCallback } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";
import { PageTransition } from "@/components/page-transition"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import type { Player } from "@/lib/types"
import { formatDateLong } from "@/lib/date-utils"

const calculateAge = (birthDateString: string | null) => {
    if (!birthDateString) return null;
    const today = new Date();
    const birthDate = new Date(birthDateString);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age >= 0 ? `${age} Tahun` : null;
};

const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return formatDateLong(dateString);
};

export default function PlayerPage() {
    const params = useParams()
    const slug = params.slug as string

    const [player, setPlayer] = useState<Player | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchPlayer = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch(`/api/pemain/${slug}`)
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || `Error: ${response.status}`)
            }
            const fetchedPlayer = await response.json()
            setPlayer(fetchedPlayer)
        } catch (err: any) {
            console.error("Kesalahan mengambil pemain:", err)
            setError(err.message || "Terjadi kesalahan saat memuat data pemain.")
        } finally {
            setLoading(false)
        }
    }, [slug])

    useEffect(() => {
        fetchPlayer()
    }, [fetchPlayer])

    if (loading) {
        return <LoadingSpinner message="Memuat profil pemain..." />
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="text-center max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <WifiOff className="h-8 w-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Gagal Memuat Data</h3>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <Button onClick={fetchPlayer} className="w-full bg-orange-600 hover:bg-orange-700">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Coba Lagi
                    </Button>
                    <Link href="/database" className="block mt-4 text-sm text-gray-500 hover:text-orange-600">
                        Kembali ke Database
                    </Link>
                </div>
            </div>
        )
    }

    if (!player) {
        notFound()
    }

    const age = calculateAge(player.birth_date);

    return (
        <PageTransition>
            <div className="min-h-screen bg-[#FDFDFD] pb-20">
                {/* Decorative Background */}
                <div className="absolute inset-0 -z-10 h-[500px] w-full bg-gradient-to-b from-orange-50/50 to-transparent" />

                <div className="container mx-auto px-4 pt-24">
                    {/* Back Button */}
                    <Link href="/database" className="inline-flex items-center text-gray-500 hover:text-orange-600 transition-colors mb-8 group">
                        <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center mr-3 group-hover:border-orange-200 group-hover:bg-orange-50 transition-all">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span className="font-medium">Kembali ke Database</span>
                    </Link>

                    <div className="grid lg:grid-cols-12 gap-8 items-start">
                        {/* Left Column: Photo & Key Stats */}
                        <div className="lg:col-span-4 space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100"
                            >
                                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-gray-100">
                                    <Image
                                        src={player.photo_url || "/placeholder.svg?height=600&width=400&query=player"}
                                        alt={player.name}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="grid grid-cols-2 gap-4"
                            >
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
                                    <div className="w-8 h-8 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-2">
                                        <Ruler className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Tinggi</p>
                                    <p className="text-lg font-bold text-gray-900">{player.height || '-'} <span className="text-sm font-normal text-gray-500">cm</span></p>
                                </div>
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
                                    <div className="w-8 h-8 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-2">
                                        <Weight className="w-4 h-4 text-green-600" />
                                    </div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Berat</p>
                                    <p className="text-lg font-bold text-gray-900">{player.weight || '-'} <span className="text-sm font-normal text-gray-500">kg</span></p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Column: Info & Details */}
                        <div className="lg:col-span-8 space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="flex flex-wrap gap-3 mb-4">
                                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200 px-3 py-1 text-sm">
                                        {player.position}
                                    </Badge>
                                    {player.club?.name && (
                                        <Badge variant="outline" className="text-gray-600 border-gray-200 px-3 py-1 text-sm flex items-center gap-1">
                                            <Shield className="w-3 h-3" />
                                            {player.club.name}
                                        </Badge>
                                    )}
                                </div>

                                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">{player.name}</h1>
                                <p className="text-xl text-gray-500 flex items-center gap-2">
                                    <MapPin className="w-5 h-5" />
                                    {player.club?.city || 'Sulawesi Utara'}
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
                            >
                                <div className="p-6 md:p-8">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <User className="w-5 h-5 text-orange-600" />
                                        Informasi Pribadi
                                    </h2>

                                    <div className="grid md:grid-cols-2 gap-y-6 gap-x-12">
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-500">Tanggal Lahir</p>
                                            <div className="flex items-center gap-2 font-medium text-gray-900">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                {formatDate(player.birth_date)}
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-500">Usia</p>
                                            <div className="font-medium text-gray-900">
                                                {age || '-'}
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-500">Klub Saat Ini</p>
                                            <div className="font-medium text-gray-900">
                                                {player.club?.name || '-'}
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-500">Jenis Kelamin</p>
                                            <div className="flex items-center gap-2 font-medium text-gray-900">
                                                <Users className="w-4 h-4 text-gray-400" />
                                                {player.gender === 'putri' ? 'Putri' : 'Putra'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {player.achievements && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
                                >
                                    <div className="p-6 md:p-8">
                                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                            <Trophy className="w-5 h-5 text-yellow-500" />
                                            Prestasi & Penghargaan
                                        </h2>

                                        <div className="space-y-4">
                                            {player.achievements.split(',').map((achievement, index) => (
                                                <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                                                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                                                        <Trophy className="w-5 h-5 text-yellow-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">{achievement.trim()}</p>
                                                        <p className="text-sm text-gray-500 mt-1">Prestasi membanggakan dalam karir voli.</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    )
}
