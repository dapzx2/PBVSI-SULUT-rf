import { Suspense } from 'react'
import { PageTransition } from "@/components/page-transition"
import { getPlayers } from "@/lib/players"
import { DatabaseList } from '@/components/database-list'
import DatabasePageLoading from './loading'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { WifiOff, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
        <div className="min-h-screen bg-[#FDFDFD]">
          <div className="fixed inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#fff7ed_100%)]"></div>
          <Suspense fallback={<DatabasePageLoading />}>
            <DatabaseList initialPlayers={initialPlayers} />
          </Suspense>
        </div>
      </PageTransition>
    )
  } catch (error: any) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <WifiOff className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Gagal Memuat Data</h2>
            <p className="text-gray-500 mb-8">
              {error.message || "Terjadi kesalahan saat mengambil data pemain. Silakan periksa koneksi internet Anda dan coba lagi."}
            </p>
            <Button
              variant="default"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              asChild
            >
              <a href="/database">
                <RefreshCw className="mr-2 h-4 w-4" />
                Coba Lagi
              </a>
            </Button>
          </div>
        </div>
      </PageTransition>
    )
  }
}
