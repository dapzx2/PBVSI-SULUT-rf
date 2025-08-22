"use client"

import { motion } from "framer-motion"
import { Users, Trophy, Target, Heart, Calendar, MapPin, Phone, Mail, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StickyHeader } from "@/components/sticky-header"
import Link from "next/link"

const stats = [
  { icon: Users, label: "Anggota Aktif", value: "500+", description: "Atlet dan pengurus" },
  { icon: Trophy, label: "Prestasi", value: "50+", description: "Medali dan penghargaan" },
  { icon: Target, label: "Klub Terdaftar", value: "25+", description: "Di seluruh Sulawesi Utara" },
  { icon: Heart, label: "Tahun Berdiri", value: "1955", description: "Pengalaman 68+ tahun" },
]

const values = [
  {
    icon: Trophy,
    title: "Prestasi",
    description: "Mengembangkan atlet berprestasi tingkat nasional dan internasional",
  },
  {
    icon: Users,
    title: "Kekeluargaan",
    description: "Membangun komunitas bola voli yang solid dan saling mendukung",
  },
  {
    icon: Target,
    title: "Profesionalisme",
    description: "Mengelola organisasi dengan standar profesional dan transparan",
  },
  {
    icon: Heart,
    title: "Integritas",
    description: "Menjunjung tinggi nilai-nilai sportivitas dan fair play",
  },
]

const quickLinks = [
  {
    title: "Sejarah PBVSI Sulut",
    description: "Pelajari perjalanan panjang organisasi kami",
    href: "/sejarah",
    color: "orange",
  },
  {
    title: "Struktur Organisasi",
    description: "Lihat susunan pengurus dan struktur organisasi",
    href: "/struktur-organisasi",
    color: "gray",
  },
]

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <StickyHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-20 mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Tentang PBVSI Sulawesi Utara</h1>
              <p className="text-xl md:text-2xl text-orange-100 leading-relaxed">
                Persatuan Bola Voli Seluruh Indonesia Pengurus Provinsi Sulawesi Utara - Membangun prestasi melalui
                dedikasi dan kerja sama
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 -mt-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center hover:shadow-lg transition-all duration-300 bg-white">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-lg font-semibold text-gray-800 mb-1">{stat.label}</div>
                    <div className="text-sm text-gray-600">{stat.description}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Visi & Misi Kami</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-2xl text-orange-600">Visi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      Menjadi organisasi olahraga bola voli terdepan di Sulawesi Utara yang menghasilkan atlet
                      berprestasi tingkat nasional dan internasional, serta mengembangkan olahraga bola voli secara
                      berkelanjutan.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-2xl text-orange-600">Misi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-gray-700 leading-relaxed space-y-3">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Mengembangkan bakat dan prestasi atlet bola voli
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Menyelenggarakan kompetisi berkualitas
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Meningkatkan kualitas pelatih dan wasit
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Membangun kerjasama dengan berbagai pihak
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Values Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-16"
            >
              <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Nilai-Nilai Kami</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((value, index) => (
                  <Card key={value.title} className="text-center hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <value.icon className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h4>
                      <p className="text-gray-600 leading-relaxed">{value.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Hubungi Kami</h3>
              <p className="text-gray-600 text-lg">Untuk informasi lebih lanjut tentang PBVSI Sulawesi Utara</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Alamat</h4>
                  <p className="text-gray-600 text-sm">Jl. Piere Tendean, Manado, Sulawesi Utara 95111</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Telepon</h4>
                  <p className="text-gray-600 text-sm">+62 431 123456</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
                  <p className="text-gray-600 text-sm">info@pbvsisulut.com</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Jam Kerja</h4>
                  <p className="text-gray-600 text-sm">
                    Senin - Jumat
                    <br />
                    08:00 - 17:00
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Links */}
            <div className="grid md:grid-cols-2 gap-6">
              {quickLinks.map((link, index) => (
                <motion.div
                  key={link.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-semibold text-gray-900">{link.title}</h4>
                        <ExternalLink
                          className={`w-5 h-5 ${link.color === "orange" ? "text-orange-500" : "text-gray-500"} group-hover:translate-x-1 transition-transform`}
                        />
                      </div>
                      <p className="text-gray-600 mb-4">{link.description}</p>
                      <Link href={link.href}>
                        <Button
                          variant="outline"
                          className={`w-full ${link.color === "orange" ? "border-orange-500 text-orange-600 hover:bg-orange-50" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}
                        >
                          Pelajari Lebih Lanjut
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
