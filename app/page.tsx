"use client"

import { motion } from "framer-motion"
import { StickyHeader } from "@/components/sticky-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Trophy, ArrowRight, Award, Target, Heart } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-red-600/10" />
          <div className="container mx-auto relative z-10">
            <motion.div
              className="text-center max-w-4xl mx-auto"
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
                PBVSI <span className="text-orange-600">Sulut</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                Persatuan Bola Voli Seluruh Indonesia Sulawesi Utara
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3">
                  <Link href="/berita" className="flex items-center gap-2">
                    Publikasi Terbaru
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-3 bg-transparent"
                >
                  <Link href="/database" className="flex items-center gap-2">
                    Database Pemain
                    <Users className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Quick Stats */}

        {/* Sambutan Ketua Umum */}
        <section className="py-16 px-4 bg-gradient-to-r from-orange-50 to-red-50">
          <div className="container mx-auto">
            <motion.div
              className="max-w-6xl mx-auto"
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-6">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <img
                        src="/images/irjen-pol-roycke-langie.jpg"
                        alt="Irjen Pol. Roycke Harry Langie, S.I.K., MH"
                        className="w-48 h-auto object-contain border-4 border-orange-200 shadow-lg"
                      />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                        <Award className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                    Sambutan Ketua Umum PBVSI Sulut
                  </CardTitle>
                  <h3 className="text-xl font-semibold text-orange-600 mb-2">
                    Irjen Pol. Roycke Harry Langie, S.I.K., MH
                  </h3>
                  <p className="text-gray-600">Kapolda Sulawesi Utara (ex-officio)</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <Target className="w-6 h-6 text-orange-600 mr-2" />
                        <span className="font-semibold text-gray-900">Masa Bakti</span>
                      </div>
                      <p className="text-sm text-gray-600">2025-2029</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <Trophy className="w-6 h-6 text-orange-600 mr-2" />
                        <span className="font-semibold text-gray-900">Ex-Officio</span>
                      </div>
                      <p className="text-sm text-gray-600">Kapolda Sulut</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <Heart className="w-6 h-6 text-orange-600 mr-2" />
                        <span className="font-semibold text-gray-900">Komitmen</span>
                      </div>
                      <p className="text-sm text-gray-600">Pembinaan Berkelanjutan</p>
                    </div>
                  </div>

                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    <p className="text-lg mb-6">
                      <strong>Assalamu'alaikum Warahmatullahi Wabarakatuh,</strong>
                    </p>

                    <p className="mb-6">
                      Selamat datang di website resmi PBVSI Sulawesi Utara. Sebagai Ketua Umum PBVSI Sulawesi Utara masa
                      bakti 2025-2029, saya menyambut baik semua pihak yang mendukung pengembangan olahraga bola voli di
                      tanah Sulawesi Utara.
                    </p>

                    <p className="mb-6">
                      Kami berkomitmen penuh untuk mewujudkan program-program pembinaan bola voli yang berkualitas dan
                      berkelanjutan di Sulawesi Utara. Melalui kerja sama yang solid antara pengurus, pelatih, atlet,
                      dan seluruh stakeholder, kita akan terus membangun prestasi yang membanggakan daerah dan
                      mengharumkan nama Sulawesi Utara di kancah nasional maupun internasional.
                    </p>

                    <blockquote className="border-l-4 border-orange-500 pl-6 py-4 bg-orange-50 rounded-r-lg mb-6">
                      <p className="text-lg italic text-gray-800 mb-2">
                        "Mari kita bersama-sama membangun ekosistem bola voli yang kuat, mulai dari pembinaan grassroot
                        hingga prestasi elite, demi kemajuan olahraga bola voli Sulawesi Utara."
                      </p>
                      <cite className="text-sm font-semibold text-orange-600">
                        - Irjen Pol. Roycke Harry Langie, S.I.K., MH
                      </cite>
                    </blockquote>

                    <p className="mb-6">
                      Apresiasi dan terima kasih yang setinggi-tingginya saya sampaikan kepada seluruh pengurus yang
                      telah mengabdikan diri dalam membangun bola voli Sulawesi Utara. Dedikasi dan kerja keras Anda
                      semua adalah fondasi kuat bagi kemajuan olahraga bola voli di daerah kita.
                    </p>

                    <p className="mb-4">
                      Semoga Allah SWT senantiasa memberikan berkah dan kemudahan dalam setiap langkah kita untuk
                      memajukan bola voli Sulawesi Utara menuju prestasi yang lebih gemilang.
                    </p>

                    <p className="font-semibold">
                      <strong>Wassalamu'alaikum Warahmatullahi Wabarakatuh</strong>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Seputar PBVSI - News Preview */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Seputar PBVSI</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Publikasi terkini dan update kegiatan PBVSI Sulawesi Utara
              </p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-3 gap-8 mb-12"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.div variants={fadeInUp}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-video bg-gradient-to-br from-orange-100 to-red-100 rounded-t-lg flex items-center justify-center">
                    <img
                      src="/images/jordan-susanto-tournament.jpg"
                      alt="Turnamen Bola Voli"
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                  <CardContent className="p-6">
                    <Badge className="mb-3 bg-orange-100 text-orange-800 hover:bg-orange-200">Prestasi</Badge>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      Putra Sulut Jordan Susanto Masuk Timnas Voli Indonesia
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      Jordan Susanto, atlet muda bola voli berbakat asal Sulawesi Utara mendapat dukungan dari
                      Pemerintah Provinsi Sulut usai dirinya menjadi bagian dari Tim Nasional Voli Putra Indonesia...
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">1 hari yang lalu</span>
                      <Link
                        href="/berita/gubernur-yulius-selvanus-bangga-putra-sulut"
                        className="text-orange-600 hover:text-orange-700 font-medium"
                      >
                        Baca selengkapnya →
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg flex items-center justify-center">
                    <img
                      src="/images/smansa-manado-tournament.jpg"
                      alt="Kompetisi Sekolah"
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                  <CardContent className="p-6">
                    <Badge className="mb-3 bg-blue-100 text-blue-800 hover:bg-blue-200">Turnamen</Badge>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      Smansa Manado Pertahankan Kawin Gelar
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      SMA Negeri 1 Manado kembali ukir prestasi di bidang olahraga bola voli. Dalam beberapa
                      pertandingan tingkat pelajar se-Sulut, Smansa Manado berhasil mempertahankan status kawin gelar
                      champion...
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">3 bulan yang lalu</span>
                      <Link
                        href="/berita/spektakuler-pertandingan-bola-volly-tingkat-pelajar"
                        className="text-orange-600 hover:text-orange-700 font-medium"
                      >
                        Baca selengkapnya →
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-video bg-gradient-to-br from-green-100 to-teal-100 rounded-t-lg flex items-center justify-center">
                    <img
                      src="/images/volleyball-court-training.webp"
                      alt="Pelatihan Pelatih"
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                  <CardContent className="p-6">
                    <Badge className="mb-3 bg-green-100 text-green-800 hover:bg-green-200">Pembinaan</Badge>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      Metode Pencarian Bakat Pemain Voli Pelajar
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      Pelaksanaan turnamen olahraga bola voli di Sulawesi Utara digalakkan untuk mendorong lahirnya
                      atlet-atlet berkualitas, terutama dalam keterampilan dan teknik bermain voli...
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">2 tahun yang lalu</span>
                      <Link
                        href="/berita/menilik-metode-pencarian-bakat-pemain-voli"
                        className="text-orange-600 hover:text-orange-700 font-medium"
                      >
                        Baca selengkapnya →
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button
                size="lg"
                variant="outline"
                className="border-orange-600 text-orange-600 hover:bg-orange-50 bg-transparent"
              >
                <Link href="/berita" className="flex items-center gap-2">
                  Lihat Semua Publikasi
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  )
}
