import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function GalleryLoading() {
  return (
    // Div ini akan mengisi ruang yang disediakan oleh parent-nya (main)
    // dan mendorong kontennya ke bawah agar tidak tumpang tindih dengan header tetap.
    <div className="h-full w-full bg-gray-50 pt-16">
      {/* Hero Section Skeleton */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-800 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Skeleton className="h-12 w-64 mx-auto mb-4 bg-orange-500/20" />
            <Skeleton className="h-6 w-96 mx-auto bg-orange-500/20" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Statistics Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4 text-center">
                <Skeleton className="h-8 w-12 mx-auto mb-2" />
                <Skeleton className="h-4 w-16 mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter Skeleton */}
        <div className="flex flex-wrap gap-2 mb-8">
          <div className="flex items-center gap-2 mr-4">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-12" />
          </div>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-8 w-20" />
          ))}
        </div>

        {/* Gallery Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-square w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
