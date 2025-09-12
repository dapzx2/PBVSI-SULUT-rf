"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Trophy,
  Clock,
  Award,
  Target,
  TrendingUp,
  Users,
  Phone,
  Mail,
  Globe,
  Star,
  Loader2,
  RefreshCw,
  WifiOff,
} from "lucide-react"
import { motion } from "framer-motion"
import { notFound } from "next/navigation"
import { useState, useEffect, useCallback } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";
import { StickyHeader } from "@/components/sticky-header"
import { PageTransition } from "@/components/page-transition"
import type { Player } from "@/lib/types"

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.02,
    y: -5,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
}

const progressVariants = {
  hidden: { width: 0 },
  visible: (value: number) => ({
    width: `${value}%`,
    transition: {
      duration: 1.5,
      ease: "easeOut",
      delay: 0.5,
    },
  }),
}

const badgeVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      delay: 0.8,
    },
  },
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: {
      duration: 0.2,
    },
  },
}

const floatingVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
}

const calculateAge = (birthDateString: string | null) => {
  if (!birthDateString) return 'N/A';
  const today = new Date();
  const birthDate = new Date(birthDateString);

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? `${age} tahun` : 'N/A';
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

interface PlayerPageProps {
  params: {
    id: string
  }
}

export default function PlayerPage({ params }: PlayerPageProps) {
  const { id } = params
  const [player, setPlayer] = useState<Player | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPlayer = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/pemain/${id}`)
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
  }, [id])

  useEffect(() => {
    fetchPlayer()
  }, [fetchPlayer])

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white">
          <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
          <p className="ml-2 text-xl text-gray-600 mt-4">Memuat data pemain...</p>
        </div>
      </PageTransition>
    )
  }

  if (error) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">
              <WifiOff className="h-16 w-16 mx-auto text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-red-600 mb-2">Gagal Memuat Pemain</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={fetchPlayer} className="bg-orange-600 hover:bg-orange-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Coba Lagi
            </Button>
          </div>
        </div>
      </PageTransition>
    )
  }

  if (!player) {
    notFound()
  }

  const getThemeClasses = (baseClass: string) => {
    // Assuming player.gender is available from the fetched player data
    const gender = player.club?.name.toLowerCase().includes("putri") ? "female" : "male";

    if (gender === "female") {
      if (baseClass.includes("bg-blue-600")) return "bg-pink-500"
      if (baseClass.includes("text-blue-600")) return "text-pink-600"
      if (baseClass.includes("from-blue-500")) return "from-pink-400"
      if (baseClass.includes("to-blue-600")) return "to-pink-500"
      if (baseClass.includes("border-blue-300")) return "border-pink-300"
      if (baseClass.includes("bg-blue-100")) return "bg-pink-100"
      if (baseClass.includes("text-blue-800")) return "text-pink-800"
    } else {
      if (baseClass.includes("bg-blue-600")) return "bg-orange-500"
      if (baseClass.includes("text-blue-600")) return "text-orange-600"
      if (baseClass.includes("from-blue-500")) return "from-orange-400"
      if (baseClass.includes("to-blue-600")) return "to-orange-500"
      if (baseClass.includes("border-blue-300")) return "border-orange-300"
      if (baseClass.includes("bg-blue-100")) return "bg-orange-100"
      if (baseClass.includes("text-blue-800")) return "text-orange-800"
    }
    return baseClass
  }

  const getLevelBadge = (level: string) => {
    // This logic needs to be adapted if 'level' is not stored in the database
    // For now, using a placeholder based on player's club name
    const gender = player.club?.name.toLowerCase().includes("putri") ? "female" : "male";
    const levelConfig = {
      Pemula: { color: gender === "female" ? "bg-pink-100 text-pink-700" : "bg-green-100 text-green-700" },
      Bagus: { color: gender === "female" ? "bg-pink-200 text-pink-800" : "bg-blue-100 text-blue-700" },
      Bintang: { color: gender === "female" ? "bg-pink-300 text-pink-900" : "bg-yellow-100 text-yellow-700" },
      "Naik Daun": {
        color: gender === "female" ? "bg-pink-200 text-pink-800" : "bg-purple-100 text-purple-700",
      },
      Veteran: { color: gender === "female" ? "bg-pink-400 text-white" : "bg-gray-100 text-gray-700" },
    }
    // Default to 'Bagus' if level is not found or not applicable
    return levelConfig[level as keyof typeof levelConfig] || levelConfig.Bagus
  }

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return player.club?.name.toLowerCase().includes("putri")
        ? "bg-pink-100 text-pink-800 border-pink-200"
        : "bg-green-100 text-green-800 border-green-200"
    } else if (status === "injured") {
      return "bg-red-100 text-red-800 border-red-200"
    }
    return "bg-gray-100 text-gray-800 border-gray-200"
  }

  return (
    <PageTransition>
      <motion.div
        className="min-h-screen bg-gradient-to-br from-gray-50 to-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <StickyHeader currentPage="database" />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`bg-gradient-to-br ${getThemeClasses("from-blue-500 to-blue-600")} text-white shadow-xl pt-16 relative overflow-hidden`}
        >
          {/* Background Animation Elements */}
          <motion.div
            className="absolute top-0 left-0 w-full h-full opacity-10"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />

          <div className="container mx-auto px-4 py-12 relative z-10">
            <motion.div
              className="flex items-center mb-8"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link href="/database">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 mr-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali ke Database
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              {/* Player Photo */}
              <motion.div className="relative" variants={floatingVariants} animate="animate">
                <motion.div whileHover={{ scale: 1.05, rotate: 2 }} transition={{ duration: 0.3 }}>
                  <Image
                    src={player.image_url || "/placeholder.svg"}
                    alt={player.name}
                    width={250}
                    height={250}
                    className="rounded-2xl border-4 border-white/20 object-cover shadow-2xl"
                  />
                </motion.div>

                {/* Level Badge (Placeholder logic) */}
                <motion.div
                  className="absolute -top-3 -right-3"
                  variants={badgeVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <Badge
                    className={`text-lg px-4 py-2 border-4 border-white shadow-lg cursor-pointer ${getLevelBadge("Bagus").color}`}
                  >
                    Bagus
                  </Badge>
                </motion.div>

                {/* Status Badge (Placeholder logic) */}
                <motion.div
                  className="absolute -bottom-3 -left-3"
                  variants={badgeVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 1 }}
                  whileHover="hover"
                >
                  <Badge
                    className={`text-sm px-3 py-1 border-2 border-white shadow-lg cursor-pointer ${getStatusBadge("active")}`}
                  >
                    Aktif
                  </Badge>
                </motion.div>
              </motion.div>

              {/* Player Info */}
              <motion.div className="flex-1 text-center lg:text-left">
                <motion.div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                  <motion.h1
                    className="text-4xl md:text-5xl font-bold"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                  >
                    {player.name}
                  </motion.h1>
                  {/* Gender icon - Placeholder logic */}
                  <motion.span
                    className="text-3xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
                  >
                    {player.club?.name.toLowerCase().includes("putri") ? "♀" : "♂"}
                  </motion.span>
                  <motion.span
                    className="text-2xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 4 }}
                  >
                    🇮🇩
                  </motion.span>
                </motion.div>

                <motion.div
                  className="flex flex-wrap justify-center lg:justify-start gap-4 mb-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {[player.position, player.club?.name, calculateAge(player.birth_date)].filter(Boolean).map((item, index) => (
                    <motion.div key={index} variants={itemVariants} whileHover={{ scale: 1.05 }}>
                      <Badge className="bg-white/20 text-white text-lg px-4 py-2 border border-white/30 hover:bg-white/30 transition-all duration-200">
                        {item}
                      </Badge>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.p
                  className="text-xl text-white/90 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  Pemain voli {player.club?.name.toLowerCase().includes("putri") ? "putri" : "putra"} dari {player.club?.city || ''}
                </motion.p>

                {/* Main Achievement - Placeholder logic */}
                <motion.p
                  className="text-lg text-white/80 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  Prestasi utama: <span className="font-semibold">Belum ada prestasi utama</span>
                </motion.p>

                {/* Quick Stats - Placeholder logic */}
                <motion.div
                  className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {[
                    { value: 0, label: "Pertandingan" },
                    { value: 0, label: "Turnamen" },
                    { value: 0, label: "Penghargaan" },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      className="text-center"
                      variants={itemVariants}
                      whileHover={{ scale: 1.1, y: -5 }}
                    >
                      <motion.div
                        className="text-2xl font-bold"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.4 + index * 0.1, type: "spring" }}
                      >
                        {stat.value}
                      </motion.div>
                      <div className="text-sm text-white/80">{stat.label}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <motion.div
              className="lg:col-span-2 space-y-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Basic Information */}
              <motion.div variants={cardVariants} whileHover="hover">
                <Card className="shadow-lg border-0 rounded-2xl overflow-hidden">
                  <CardHeader className={`${getThemeClasses("bg-blue-100")} border-b`}>
                    <CardTitle className={`text-2xl ${getThemeClasses("text-blue-800")} flex items-center gap-2`}>
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 5 }}
                      >
                        <User className="w-6 h-6" />
                      </motion.div>
                      Informasi Dasar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <motion.div
                      className="grid md:grid-cols-2 gap-6"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <div className="space-y-4">
                        {[
                          { icon: Calendar, label: "Tanggal Lahir", value: formatDate(player.birth_date) },
                          { icon: MapPin, label: "Asal Klub", value: player.club?.city || 'N/A' },
                          { icon: Clock, label: "Pengalaman", value: 'N/A' }, // Placeholder
                        ].map((item, index) => (
                          <motion.div
                            key={index}
                            className="flex items-center space-x-3"
                            variants={itemVariants}
                            whileHover={{ x: 5, scale: 1.02 }}
                          >
                            <item.icon className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">{item.label}</p>
                              <p className="font-semibold">{item.value}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      <div className="space-y-4">
                        {[
                          { icon: TrendingUp, label: "Tinggi Badan", value: player.height_cm ? `${player.height_cm} cm` : 'N/A' },
                          { icon: Target, label: "Berat Badan", value: player.weight_kg ? `${player.weight_kg} kg` : 'N/A' },
                          { icon: Users, label: "Tim Saat Ini", value: player.club?.name || 'N/A' },
                        ].map((item, index) => (
                          <motion.div
                            key={index}
                            className="flex items-center space-x-3"
                            variants={itemVariants}
                            whileHover={{ x: 5, scale: 1.02 }}
                          >
                            <item.icon className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">{item.label}</p>
                              <p
                                className={`font-semibold ${item.label === "Tim Saat Ini" ? getThemeClasses("text-blue-600") : ""}`}
                              >
                                {item.value}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Performance Statistics - Placeholder logic */}
              <motion.div variants={cardVariants} whileHover="hover">
                <Card className="shadow-lg border-0 rounded-2xl overflow-hidden">
                  <CardHeader className={`${getThemeClasses("bg-blue-100")} border-b`}>
                    <CardTitle className={`text-2xl ${getThemeClasses("text-blue-800")} flex items-center gap-2`}>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                      >
                        <TrendingUp className="w-6 h-6" />
                      </motion.div>
                      Statistik Performa
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
                      {[
                        { label: "Tingkat Keberhasilan Serangan", value: 0 },
                        { label: "Tingkat Keberhasilan Block", value: 0 },
                        { label: "Tingkat Keberhasilan Serve", value: 0 },
                        { label: "Tingkat Keberhasilan Receive", value: 0 },
                      ].map((stat, index) => (
                        <motion.div key={index} variants={itemVariants}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{stat.label}</span>
                            <motion.span
                              className="font-bold"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 + index * 0.1 }}
                            >
                              {stat.value}%
                            </motion.span>
                          </div>
                          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full ${player.club?.name.toLowerCase().includes("putri") ? "bg-pink-500" : "bg-orange-500"} rounded-full`}
                              initial={{ width: 0 }}
                              animate={{ width: `${stat.value}%` }}
                              transition={{ duration: 1.5, delay: 0.5 + index * 0.1, ease: "easeOut" }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Career Highlights - Placeholder logic */}
              <motion.div variants={cardVariants} whileHover="hover">
                <Card className="shadow-lg border-0 rounded-2xl overflow-hidden">
                  <CardHeader className={`${getThemeClasses("bg-blue-100")} border-b`}>
                    <CardTitle className={`text-2xl ${getThemeClasses("text-blue-800")} flex items-center gap-2`}>
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatDelay: 4 }}
                      >
                        <Star className="w-6 h-6" />
                      </motion.div>
                      Sorotan Karier
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
                      {player.achievements && player.achievements.length > 0 ? (
                        player.achievements.map((achievement, index) => (
                          <motion.div
                            key={index}
                            className="flex gap-4"
                            variants={itemVariants}
                            whileHover={{ x: 10, scale: 1.02 }}
                          >
                            <motion.div
                              className={`flex-shrink-0 w-16 h-16 rounded-full ${getThemeClasses("bg-blue-100")} flex items-center justify-center`}
                              whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                              <span className={`font-bold text-sm ${getThemeClasses("text-blue-800")}`}>
                                {new Date(player.created_at).getFullYear()} {/* Placeholder for year */}
                              </span>
                            </motion.div>
                            <div className="flex-1">
                              <motion.h4
                                className="font-bold text-lg mb-1"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                              >
                                {achievement}
                              </motion.h4>
                              <motion.p
                                className="text-gray-600"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                              >
                                {/* Placeholder for description */}
                                Deskripsi prestasi
                              </motion.p>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <p className="text-gray-600">Belum ada sorotan karier.</p>
                      )}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Personal Information - Placeholder logic */}
              <motion.div variants={cardVariants} whileHover="hover">
                <Card className="shadow-lg border-0 rounded-2xl overflow-hidden">
                  <CardHeader className={`${getThemeClasses("bg-blue-100")} border-b`}>
                    <CardTitle className={`text-2xl ${getThemeClasses("text-blue-800")} flex items-center gap-2`}>
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                      >
                        <Award className="w-6 h-6" />
                      </motion.div>
                      Informasi Personal
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
                      <motion.div
                        className={`${getThemeClasses("bg-blue-100")} rounded-xl p-4`}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02, y: -2 }}
                      >
                        <p className="text-sm text-gray-500 mb-1">Hobi & Minat</p>
                        <p className="font-semibold">N/A</p>
                      </motion.div>
                      <motion.div
                        className={`${getThemeClasses("bg-blue-100")} rounded-xl p-4`}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02, y: -2 }}
                      >
                        <p className="text-sm text-gray-500 mb-1">Posisi Bermain</p>
                        <p className="font-semibold">{player.position}</p>
                      </motion.div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Sidebar */}
            <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
              {/* Contact Information - Placeholder logic */}
              <motion.div variants={cardVariants} whileHover="hover">
                <Card className="shadow-lg border-0 rounded-2xl overflow-hidden">
                  <CardHeader className={`${getThemeClasses("bg-blue-100")} border-b`}>
                    <CardTitle className={`text-xl ${getThemeClasses("text-blue-800")} flex items-center gap-2`}>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 4 }}
                      >
                        <Phone className="w-5 h-5" />
                      </motion.div>
                      Kontak
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    {[
                      { icon: Phone, value: 'N/A' },
                      { icon: Mail, value: 'N/A' },
                      { icon: Globe, value: 'N/A' },
                    ].map((contact, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        whileHover={{ x: 5, scale: 1.02 }}
                      >
                        <contact.icon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{contact.value}</span>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Achievements */}
              <motion.div variants={cardVariants} whileHover="hover">
                <Card className="shadow-lg border-0 rounded-2xl overflow-hidden">
                  <CardHeader className={`${getThemeClasses("bg-blue-100")} border-b`}>
                    <CardTitle className={`text-xl ${getThemeClasses("text-blue-800")} flex items-center gap-2`}>
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
                      >
                        <Trophy className="w-5 h-5" />
                      </motion.div>
                      Prestasi
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {player.achievements && player.achievements.length > 0 ? (
                        player.achievements.map((achievement, index) => (
                          <motion.div
                            key={index}
                            className="flex items-center space-x-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            whileHover={{ x: 5, scale: 1.02 }}
                          >
                            <motion.div
                              className={`w-2 h-2 ${player.club?.name.toLowerCase().includes("putri") ? "bg-pink-400" : "bg-orange-400"} rounded-full`}
                              animate={{ scale: [1, 1.5, 1] }}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.2 }}
                            />
                            <p className="font-medium text-sm">{achievement}</p>
                          </motion.div>
                        ))
                      ) : (
                        <p className="text-gray-600">Belum ada prestasi.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Navigation */}
              <motion.div variants={cardVariants}>
                <div className="space-y-3">
                  <Link href="/database">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        className={`w-full ${getThemeClasses("bg-blue-600 hover:bg-blue-700")} text-lg py-3 rounded-xl shadow-lg`}
                      >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Kembali ke Database
                      </Button>
                    </motion.div>
                  </Link>

                  {/* Navigation to other players - Removed for simplicity as it requires fetching all players */}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </PageTransition>
  )
}