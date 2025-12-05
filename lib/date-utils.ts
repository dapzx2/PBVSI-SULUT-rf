/**
 * Utility functions untuk format tanggal dan waktu yang konsisten
 * Semua waktu ditampilkan dalam zona waktu WITA (UTC+8)
 */

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
const MONTHS_LONG = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

/**
 * Format waktu lengkap dengan detik: "5 Des 10:28:50 WITA"
 */
export function formatTimeWithSeconds(dateInput: string | Date): string {
    const date = new Date(dateInput)

    const day = date.getDate()
    const month = MONTHS_SHORT[date.getMonth()]
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')

    return `${day} ${month} ${hours}:${minutes}:${seconds} WITA`
}

/**
 * Format waktu tanpa detik: "5 Des 10:28 WITA"
 */
export function formatTime(dateInput: string | Date): string {
    const date = new Date(dateInput)

    const day = date.getDate()
    const month = MONTHS_SHORT[date.getMonth()]
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')

    return `${day} ${month} ${hours}:${minutes} WITA`
}

/**
 * Format hanya jam: "10:28:50 WITA"
 */
export function formatClockTime(dateInput: string | Date): string {
    const date = new Date(dateInput)

    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')

    return `${hours}:${minutes}:${seconds} WITA`
}

/**
 * Format tanggal saja: "5 Des 2025"
 */
export function formatDateShort(dateInput: string | Date): string {
    const date = new Date(dateInput)

    const day = date.getDate()
    const month = MONTHS_SHORT[date.getMonth()]
    const year = date.getFullYear()

    return `${day} ${month} ${year}`
}

/**
 * Format tanggal lengkap: "Selasa, 5 Desember 2025"
 */
export function formatDateLong(dateInput: string | Date): string {
    const date = new Date(dateInput)

    const dayName = DAYS[date.getDay()]
    const day = date.getDate()
    const month = MONTHS_LONG[date.getMonth()]
    const year = date.getFullYear()

    return `${dayName}, ${day} ${month} ${year}`
}

/**
 * Format tanggal dan waktu lengkap: "Selasa, 5 Desember 2025 pukul 10:28 WITA"
 */
export function formatDateTimeLong(dateInput: string | Date): string {
    const date = new Date(dateInput)

    const dayName = DAYS[date.getDay()]
    const day = date.getDate()
    const month = MONTHS_LONG[date.getMonth()]
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')

    return `${dayName}, ${day} ${month} ${year} pukul ${hours}:${minutes} WITA`
}

/**
 * Format relatif: "2 jam yang lalu", "Kemarin", dll.
 */
export function formatRelativeTime(dateInput: string | Date): string {
    const date = new Date(dateInput)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'Baru saja'
    if (diffMins < 60) return `${diffMins} menit yang lalu`
    if (diffHours < 24) return `${diffHours} jam yang lalu`
    if (diffDays === 1) return 'Kemarin'
    if (diffDays < 7) return `${diffDays} hari yang lalu`

    return formatDateShort(date)
}
