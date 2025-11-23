import { Suspense } from 'react'
import { PageTransition } from "@/components/page-transition"
import { getArticles } from "@/lib/articles"
import { BeritaList } from '@/components/berita-list'
import BeritaPageLoading from './loading' // Assuming you have a loading component
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { WifiOff } from 'lucide-react'

async function fetchArticlesData() {
  const { articles, error } = await getArticles();
  if (error) {
    throw new Error(error);
  }
  return articles || [];
}

export default async function BeritaPage() {
  try {
    const initialArticles = await fetchArticlesData()

    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
          <Suspense fallback={<BeritaPageLoading />}>
            <BeritaList initialArticles={initialArticles} />
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
                {error.message || "Gagal memuat data berita. Silakan coba lagi nanti."}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </PageTransition>
    )
  }
}
