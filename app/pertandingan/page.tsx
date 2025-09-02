import { Suspense } from 'react'
import { PageTransition } from "@/components/page-transition"
import { getMatches } from "@/lib/matches"
import { PertandinganList } from '@/components/pertandingan-list'
import PertandinganPageLoading from './loading'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { WifiOff } from 'lucide-react'
import { StickyHeader } from '@/components/sticky-header'

async function fetchMatchesData() {
  const { matches, error } = await getMatches();
  if (error) {
    throw new Error(error);
  }
  return matches || [];
}

export default async function PertandinganPage() {
  try {
    const initialMatches = await fetchMatchesData()

    return (
      <div className="min-h-screen bg-gray-50">
        <StickyHeader currentPage="pertandingan" />
        <PageTransition>
          <Suspense fallback={<PertandinganPageLoading />}>
            <PertandinganList initialMatches={initialMatches} />
          </Suspense>
        </PageTransition>
      </div>
    )
  } catch (error: any) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StickyHeader currentPage="pertandingan" />
        <PageTransition>
          <div className="container mx-auto px-4 py-16 pt-32 text-center">
            <Alert variant="destructive">
              <WifiOff className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error.message || "Gagal memuat data pertandingan. Silakan coba lagi nanti."}
              </AlertDescription>
            </Alert>
          </div>
        </PageTransition>
      </div>
    )
  }
}