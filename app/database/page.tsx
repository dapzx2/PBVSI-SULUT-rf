import { Suspense } from 'react'
import { PageTransition } from "@/components/page-transition"
import { getPlayers } from "@/lib/players"
import { DatabaseList } from '@/components/database-list'
import DatabasePageLoading from './loading' // Assuming you have a loading component
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { WifiOff } from 'lucide-react'

async function fetchPlayersData() {
  const { players, error } = await getPlayers();
  if (error) {
    throw new Error(error);
  }
  return players || [];
}

export default async function DatabasePage() {
  try {
    const initialPlayers = await fetchPlayersData()

    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
          <Suspense fallback={<DatabasePageLoading />}>
            <DatabaseList initialPlayers={initialPlayers} />
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
                {error.message || "Gagal memuat data pemain. Silakan coba lagi nanti."}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </PageTransition>
    )
  }
}
