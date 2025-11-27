import { getPublicInformation } from "@/lib/public-information"
import { PublicInformationList } from "@/components/public-information-list"
import { Shield } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function InformasiPublikPage() {
  const { data: documents } = await getPublicInformation()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-20 mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              Informasi Publik
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
              Akses informasi dan dokumen publik PBVSI Sulawesi Utara sebagai bentuk transparansi kami.
            </p>
          </div>
        </div>
      </section>

      {/* Documents Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Dokumen Publik</h2>
              <p className="text-lg text-gray-600">Berikut adalah dokumen-dokumen yang dapat diakses oleh publik.</p>
            </div>

            <PublicInformationList documents={documents || []} />

            <div className="mt-12 text-center text-gray-600 bg-gray-100 p-6 rounded-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
              <Shield className="w-8 h-8 mx-auto text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Keterbukaan Informasi</h3>
              <p>PBVSI Sulawesi Utara berkomitmen untuk menyediakan informasi yang akurat dan transparan kepada publik sesuai dengan peraturan yang berlaku.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
