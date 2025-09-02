import { Suspense } from 'react'
import { PageTransition } from "@/components/page-transition"
import { getGalleryItems } from "@/lib/gallery"
import { GaleriList } from '@/components/galeri-list'
import GaleriPageLoading from './loading' // Assuming you have a loading component
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { WifiOff } from 'lucide-react'
import { StickyHeader } from '@/components/sticky-header'

async function fetchGalleryData() {
  const { galleryItems, error } = await getGalleryItems();
  if (error) {
    throw new Error(error);
  }
  return galleryItems || [];
}

export default async function GaleriPage() {
  try {
    const initialItems = await fetchGalleryData()

    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
          <StickyHeader currentPage="galeri" />
          <Suspense fallback={<GaleriPageLoading />}>
            <GaleriList initialItems={initialItems} />
          </Suspense>
        </div>
      </PageTransition>
    )
  } catch (error: any) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
          <StickyHeader currentPage="galeri" />
          <div className="container mx-auto px-4 py-16 pt-32 text-center">
            <Alert variant="destructive">
              <WifiOff className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error.message || "Gagal memuat data galeri. Silakan coba lagi nanti."}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </PageTransition>
    )
  }
}
