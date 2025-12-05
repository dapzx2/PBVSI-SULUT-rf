import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function Loading() {
    return (
        <div className="w-full flex-1 flex items-center justify-center min-h-screen">
            <LoadingSpinner />
        </div>
    )
}
