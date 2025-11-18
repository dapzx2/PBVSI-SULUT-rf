"use client"

import { motion } from "framer-motion"
import { StickyHeader } from "@/components/sticky-header"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Download, Shield } from "lucide-react"

export default function InformasiPublikPage() {
  const documents = [
    { name: "Laporan Tahunan 2023", category: "Laporan", size: "2.5 MB" },
    { name: "Anggaran Dasar & Anggaran Rumah Tangga (AD/ART)", category: "Regulasi", size: "1.2 MB" },
    { name: "Rencana Strategis 2025-2029", category: "Perencanaan", size: "3.1 MB" },
    { name: "Laporan Keuangan 2023", category: "Keuangan", size: "1.8 MB" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <StickyHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-20 mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Informasi Publik</h1>
              <p className="text-xl md:text-2xl text-orange-100 leading-relaxed">
                Akses informasi dan dokumen publik PBVSI Sulawesi Utara sebagai bentuk transparansi kami.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Documents Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Dokumen Publik</h2>
              <p className="text-lg text-gray-600">Berikut adalah dokumen-dokumen yang dapat diakses oleh publik.</p>
            </motion.div>

            <div className="space-y-4">
              {documents.map((doc, index) => (
                <motion.div
                  key={doc.name}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="w-8 h-8 text-orange-500 mr-4" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{doc.name}</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <span>{doc.category}</span>
                            <span className="mx-2">•</span>
                            <span>{doc.size}</span>
                          </div>
                        </div>
                      </div>
                      <a href="#" download className="flex items-center text-orange-600 hover:text-orange-700">
                        <Download className="w-5 h-5 mr-2" />
                        <span>Unduh</span>
                      </a>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12 text-center text-gray-600 bg-gray-100 p-6 rounded-lg"
            >
              <Shield className="w-8 h-8 mx-auto text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Keterbukaan Informasi</h3>
              <p>PBVSI Sulawesi Utara berkomitmen untuk menyediakan informasi yang akurat dan transparan kepada publik sesuai dengan peraturan yang berlaku.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
