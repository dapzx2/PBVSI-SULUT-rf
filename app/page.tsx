"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Trophy, ArrowRight, Award, Target, Heart, Loader2, Calendar, MapPin, Activity } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import type { Article } from "@/lib/types"

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("/api/articles?limit=3")
        const data = await response.json()
        setArticles(data)
      } catch (error) {
        console.error("Error fetching articles:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [])

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
    <div className="min-h-screen bg-gray-50">
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-600 via-orange-700 to-red-800 text-white pt-16">
          {/* Abstract Background Patterns */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 -left-24 w-72 h-72 bg-orange-400/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-red-500/20 rounded-full blur-3xl" />
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="text-center max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="mb-6 bg-white/20 text-white hover:bg-white/30 border-none px-4 py-1.5 text-sm backdrop-blur-sm">
                Official Website
              </Badge>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-tight">
                PBVSI <span className="text-orange-200">Sulut</span>
              </h1>
              <p className="text-xl md:text-2xl text-orange-50 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
                Membangun Prestasi, Menjunjung Sportivitas. Wadah resmi pembinaan dan pengembangan olahraga bola voli di Sulawesi Utara.
              </p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Button size="lg" className="bg-white text-orange-700 hover:bg-orange-50 px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all w-full sm:w-auto" asChild>
                  <Link href="/berita" className="flex items-center gap-2">
                    Berita Terbaru
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white/40 text-white hover:bg-white/10 hover:text-white px-8 py-6 text-lg font-semibold backdrop-blur-sm w-full sm:w-auto"
                  asChild
                >
                  <Link href="/database" className="flex items-center gap-2">
                    Database Pemain
                    <Users className="w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2">
              <div className="w-1 h-2 bg-white rounded-full" />
            </div>
          </motion.div>
        </section>



        {/* Sambutan Ketua Umum */}
        <section className="py-24 px-4">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-12 gap-12 items-start">
              {/* Image Column */}
              <motion.div
                className="lg:col-span-4"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-orange-600 rounded-3xl transform rotate-3 opacity-10" />
                  <div className="relative bg-white p-4 rounded-3xl shadow-xl border border-gray-100">
                    <div className="aspect-[3/4] relative overflow-hidden rounded-2xl bg-gray-100">
                      <Image
                        src="/images/irjen-pol-roycke-langie.jpg"
                        alt="Irjen Pol. Roycke Harry Langie, S.I.K., MH"
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                    <div className="mt-6 text-center">
                      <h3 className="text-xl font-bold text-gray-900">
                        Irjen Pol. Roycke Harry Langie, S.I.K., MH
                      </h3>
                      <p className="text-orange-600 font-medium mt-1">Ketua Umum PBVSI Sulut</p>
                      <Badge variant="secondary" className="mt-3">Masa Bakti 2025-2029</Badge>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Content Column */}
              <motion.div
                className="lg:col-span-8"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 h-full">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-1 bg-orange-600 rounded-full" />
                    <span className="text-orange-600 font-bold tracking-wider uppercase text-sm">Sambutan Ketua Umum</span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
                    Membangun Ekosistem Voli yang <span className="text-orange-600">Modern & Berprestasi</span>
                  </h2>

                  <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-6">
                    <p>
                      <strong>Assalamu&apos;alaikum Warahmatullahi Wabarakatuh,</strong>
                    </p>
                    <p>
                      Selamat datang di era baru PBVSI Sulawesi Utara. Website ini adalah wujud komitmen kami dalam transformasi digital organisasi,
                      memastikan transparansi, dan mendekatkan olahraga voli kepada masyarakat.
                    </p>
                    <p>
                      Visi kami jelas: menjadikan Sulawesi Utara sebagai lumbung atlet voli nasional. Kami fokus pada pembinaan usia dini yang terstruktur,
                      kompetisi yang berkualitas, dan peningkatan kapasitas pelatih serta wasit.
                    </p>

                    <div className="bg-orange-50 border-l-4 border-orange-600 p-6 rounded-r-xl my-8">
                      <p className="text-lg font-medium text-gray-900 italic mb-2">
                        &quot;Tidak ada prestasi tanpa disiplin. Tidak ada juara tanpa kerja keras. Mari kita bangkitkan kejayaan voli Sulawesi Utara bersama-sama.&quot;
                      </p>
                    </div>

                    <p>
                      Saya mengajak seluruh elemen masyarakat, klub, dan pecinta voli untuk bersinergi. Mari kita jadikan voli bukan sekadar olahraga,
                      tapi juga sarana pembentukan karakter generasi muda yang tangguh.
                    </p>

                    <p className="font-semibold text-gray-900 pt-4">
                      WAssalamu&apos;alaikum Warahmatullahi Wabarakatuh
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* News Section */}
        <section className="py-24 px-4 bg-gray-50 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-orange-100/50 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-100/50 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="container mx-auto relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-200 border-none">Berita & Kegiatan</Badge>
                <h2 className="text-4xl font-bold text-gray-900">Seputar PBVSI</h2>
                <p className="text-gray-600 mt-2 text-lg">Update terkini dari lapangan dan kegiatan organisasi</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Button variant="outline" className="group bg-white border-orange-200 hover:border-orange-600 hover:bg-orange-50 text-orange-700 hover:text-orange-700" asChild>
                  <Link href="/berita" className="flex items-center gap-2">
                    Lihat Semua Berita
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
              </div>
            ) : articles && articles.length > 0 ? (
              <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {articles.map((article) => (
                  <motion.div variants={fadeInUp} key={article.id}>
                    <Link href={`/berita/${article.slug}`} className="group h-full block">
                      <Card className="h-full border-none shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white group-hover:-translate-y-2">
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
                          <Image
                            src={article.image_url || "/placeholder.svg"}
                            alt={article.title}
                            fill
                            className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                          />
                          <Badge className="absolute top-4 left-4 z-20 bg-orange-600 hover:bg-orange-700 text-white border-none shadow-lg">
                            {article.category}
                          </Badge>
                        </div>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                            <Calendar className="w-4 h-4 text-orange-500" />
                            <span>
                              {new Date(article.published_at).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed">
                            {/* We might want to add a summary field to the article type later, using title for now if no summary */}
                            Simak selengkapnya mengenai {article.title}...
                          </p>
                          <div className="mt-4 flex items-center text-orange-600 font-medium text-sm group-hover:underline">
                            Baca Selengkapnya <ArrowRight className="w-4 h-4 ml-1" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada berita</h3>
                <p className="text-gray-500">Nantikan update terbaru dari kami.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
