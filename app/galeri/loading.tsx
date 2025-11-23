import { Loader2 } from 'lucide-react';
import { PageTransition } from "@/components/page-transition";

export default function GaleriPageLoading() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-16 pt-32 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Memuat Galeri...</h1>
          <p className="text-gray-600">Harap tunggu sebentar.</p>
          <Loader2 className="h-10 w-10 animate-spin text-orange-500 mx-auto mt-8" />
        </div>
      </div>
    </PageTransition>
  );
}
