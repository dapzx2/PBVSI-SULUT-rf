import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
    size?: number
    className?: string
    message?: string
}

export function LoadingSpinner({ size = 48, className, message = "Sedang memuat..." }: LoadingSpinnerProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center min-h-screen w-full animate-in fade-in duration-300",
                className
            )}
        >
            <Loader2
                className="animate-spin text-orange-600"
                size={size}
            />
            <p className="mt-4 text-gray-500 text-sm font-medium">{message}</p>
        </div>
    )
}
