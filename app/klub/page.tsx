import { Suspense } from 'react'
import { PageTransition } from "@/components/page-transition"
import { getClubs } from "@/lib/clubs"
import { ClubList } from '@/components/club-list'
import KlubPageLoading from './loading'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { WifiOff } from 'lucide-react'

async function fetchClubsData() {
  const { clubs, error } = await getClubs();
  if (error) {
    // Throwing an error here will be caught by the nearest error.tsx file
    throw new Error(error);
  }
  return clubs || [];
}

export default async function KlubPage() {
  try {
    const initialClubs = await fetchClubsData()

    return (
      <PageTransition>
        <div className="min-h-screen bg-[#FDFDFD]">
          <Suspense fallback={<KlubPageLoading />}>
            <ClubList initialClubs={initialClubs} />
          </Suspense>
        </div>
      </PageTransition>
    )
  } catch (error: any) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4 py-16 pt-32 text-center">
            <Alert variant="destructive">
              <WifiOff className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error.message || "Gagal memuat data klub. Silakan coba lagi nanti."}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </PageTransition>
    )
  }
}