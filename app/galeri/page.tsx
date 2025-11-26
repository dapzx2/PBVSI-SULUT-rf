import { Suspense } from 'react'
import { PageTransition } from "@/components/page-transition"
import { getGalleryItems } from "@/lib/gallery"
import { GaleriList } from '@/components/galeri-list'
import GaleriPageLoading from './loading'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { WifiOff } from 'lucide-react'

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
        <div className="min-h-screen bg-[#FDFDFD] relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-orange-50/80 to-transparent -z-10" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/30 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2" />

          <Suspense fallback={<GaleriPageLoading />}>
            <GaleriList initialItems={initialItems} />
          </Suspense>
        </div>
      </PageTransition>
    )
  } catch (error: any) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">
          <div className="container mx-auto px-4 py-16 text-center max-w-lg">
            <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
              <WifiOff className="h-4 w-4" />
              <AlertTitle>Gagal Memuat Galeri</AlertTitle>
              <AlertDescription>
                {error.message || "Terjadi kesalahan saat mengambil data. Silakan coba lagi nanti."}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </PageTransition>
    )
  }
}
