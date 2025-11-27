import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
    size?: number
    className?: string
}

export function LoadingSpinner({ size = 48, className }: LoadingSpinnerProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center min-h-[50vh] w-full animate-in fade-in duration-300",
                className
            )}
        >
            <Loader2
                className="animate-spin text-orange-600"
                size={size}
            />
            <span className="sr-only">Loading...</span>
        </div>
    )
}
