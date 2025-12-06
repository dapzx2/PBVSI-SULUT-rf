"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
    ImageIcon,
    Calendar,
    Users,
    FileText,
    Trophy,
    Activity,
    Search,
    Database,
    type LucideIcon
} from "lucide-react"

// Preset types untuk berbagai konteks
export type EmptyStateType =
    | "berita"
    | "galeri"
    | "pertandingan"
    | "pemain"
    | "klub"
    | "search"
    | "data"
    | "custom"

interface EmptyStatePreset {
    icon: LucideIcon
    title: string
    description: string
}

const presets: Record<Exclude<EmptyStateType, "custom">, EmptyStatePreset> = {
    berita: {
        icon: FileText,
        title: "Belum ada berita",
        description: "Nantikan update terbaru dari kami."
    },
    galeri: {
        icon: ImageIcon,
        title: "Tidak ada hasil ditemukan",
        description: "Coba sesuaikan kata kunci atau filter pencarian Anda."
    },
    pertandingan: {
        icon: Calendar,
        title: "Tidak Ada Pertandingan",
        description: "Saat ini tidak ada pertandingan yang sesuai dengan filter Anda."
    },
    pemain: {
        icon: Users,
        title: "Belum ada data pemain",
        description: "Data pemain belum tersedia saat ini."
    },
    klub: {
        icon: Trophy,
        title: "Belum ada data klub",
        description: "Data klub belum tersedia saat ini."
    },
    search: {
        icon: Search,
        title: "Tidak ada hasil",
        description: "Coba gunakan kata kunci yang berbeda."
    },
    data: {
        icon: Database,
        title: "Data tidak tersedia",
        description: "Belum ada data di dalam database."
    }
}

interface EmptyStateProps {
    /** Tipe preset untuk empty state */
    type?: EmptyStateType
    /** Custom icon (override preset) */
    icon?: LucideIcon
    /** Custom title (override preset) */
    title?: string
    /** Custom description (override preset) */
    description?: string
    /** Tombol aksi opsional */
    actionLabel?: string
    /** Handler untuk tombol aksi */
    onAction?: () => void
    /** Ukuran komponen */
    size?: "sm" | "md" | "lg"
    /** Apakah menggunakan animasi */
    animate?: boolean
    /** Custom className untuk container */
    className?: string
}

export function EmptyState({
    type = "data",
    icon: customIcon,
    title: customTitle,
    description: customDescription,
    actionLabel,
    onAction,
    size = "md",
    animate = true,
    className = ""
}: EmptyStateProps) {
    // Ambil preset atau gunakan custom
    const preset = type !== "custom" ? presets[type] : null

    const Icon = customIcon || preset?.icon || Activity
    const title = customTitle || preset?.title || "Data tidak tersedia"
    const description = customDescription || preset?.description || "Belum ada data."

    // Ukuran berdasarkan size prop
    const sizes = {
        sm: {
            container: "py-12",
            iconWrapper: "w-16 h-16",
            icon: "w-7 h-7",
            title: "text-lg",
            description: "text-sm"
        },
        md: {
            container: "py-20",
            iconWrapper: "w-20 h-20",
            icon: "w-9 h-9",
            title: "text-xl",
            description: "text-base"
        },
        lg: {
            container: "py-24",
            iconWrapper: "w-24 h-24",
            icon: "w-10 h-10",
            title: "text-2xl",
            description: "text-lg"
        }
    }

    const currentSize = sizes[size]

    const content = (
        <div className={`text-center ${currentSize.container} ${className}`}>
            <div className={`${currentSize.iconWrapper} mx-auto mb-6 bg-orange-50 rounded-full flex items-center justify-center`}>
                <Icon className={`${currentSize.icon} text-orange-400`} />
            </div>
            <h3 className={`${currentSize.title} font-bold text-gray-900 mb-2`}>{title}</h3>
            <p className={`text-gray-500 ${currentSize.description} max-w-md mx-auto`}>
                {description}
            </p>
            {actionLabel && onAction && (
                <Button
                    onClick={onAction}
                    variant="outline"
                    className="mt-6 border-orange-200 text-orange-700 hover:bg-orange-50"
                >
                    {actionLabel}
                </Button>
            )}
        </div>
    )

    if (animate) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {content}
            </motion.div>
        )
    }

    return content
}
