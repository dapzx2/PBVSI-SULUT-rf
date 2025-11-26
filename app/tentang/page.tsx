"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

const stats = [
  { label: "Anggota Aktif", value: "500+", description: "Hubungi Pengprov untuk data akurat" },
  { label: "Prestasi", value: "50+", description: "Lebih spesifik dengan detail medali" },
  { label: "Klub Terdaftar", value: "25+", description: "Konfirmasi dengan Pengprov" },
  { label: "Tahun Berdiri", value: "1955", description: "Pengalaman 70 Tahun" },
]

const quickLinks = [
  {
    title: "Sejarah PBVSI Sulut",
    description: "Pelajari perjalanan panjang organisasi kami.",
    href: "/sejarah",
  },
  {
    title: "Struktur Organisasi",
    description: "Lihat susunan pengurus dan struktur kami.",
    href: "/struktur-organisasi",
  },
]

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-24 mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Tentang PBVSI Sulawesi Utara</h1>
              <p className="text-xl md:text-2xl text-orange-100 leading-relaxed">
                Membangun prestasi melalui dedikasi dan kerja sama.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border-t-4 border-orange-500">
                  <CardContent className="p-0">
                    <p className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</p>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{stat.label}</h3>
                    <p className="text-sm text-gray-600">{stat.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visi & Misi Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Visi & Misi</h2>
              <p className="text-gray-600 mt-2">Panduan kami dalam memajukan bola voli di Sulawesi Utara.</p>
            </div>
            <Card className="bg-white">
              <CardContent className="p-8">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-orange-600 mb-3">Visi</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    Menjadi organisasi olahraga bola voli terdepan di Sulawesi Utara yang menghasilkan atlet
                    berprestasi tingkat nasional dan internasional, serta mengembangkan olahraga bola voli secara
                    berkelanjutan.
                  </p>
                </div>
                <Separator />
                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-orange-600 mb-4">Misi</h3>
                  <ul className="text-gray-700 leading-relaxed space-y-3 text-lg">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Mengembangkan bakat dan prestasi atlet.
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Menyelenggarakan kompetisi berkualitas.
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Meningkatkan kualitas pelatih dan wasit.
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Membangun kerjasama dengan berbagai pihak.
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Mempromosikan sportivitas dan fair play.
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Program & Prestasi Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Program & Prestasi</h2>
              <p className="text-gray-600 mt-2">Aksi dan pencapaian kami dalam beberapa tahun terakhir.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Program Kegiatan */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-800">Program Unggulan</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 text-gray-700">
                    <li>✓ Pembinaan Atlet Muda (U-12 hingga U-19)</li>
                    <li>✓ Kejuaraan Bola Voli Sulut Tahunan</li>
                    <li>✓ Pelatihan Pelatih & Wasit Bersertifikat</li>
                    <li>✓ Kemitraan dengan Sekolah & Universitas</li>
                    <li>✓ Pengembangan Infrastruktur Olahraga</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Prestasi Terbaru */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-800">Prestasi Terbaru</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800">Kejurnas U-19 2025 (Putra)</h4>
                    <p className="text-gray-600">Bright Jos Elektrik Sulut - Peserta</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Jelajahi Lebih Lanjut</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {quickLinks.map((link) => (
                <Link href={link.href} key={link.title} className="group">
                  <Card className="h-full bg-white hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-transparent group-hover:border-orange-500">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 transition-colors">{link.title}</h3>
                        <p className="text-gray-600 mt-1">{link.description}</p>
                      </div>
                      <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

