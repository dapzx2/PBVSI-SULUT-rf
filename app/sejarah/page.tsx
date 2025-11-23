"use client"

import { motion } from "framer-motion"
import { Calendar, Trophy, Users, Star, Award, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const timelineEvents = [
  {
    year: "1955",
    title: "Pendirian PBVSI",
    description: "Persatuan Bola Voli Seluruh Indonesia didirikan secara nasional",
    type: "founding",
  },
  {
    year: "1960",
    title: "PBVSI Sulut Terbentuk",
    description: "Pengurus Provinsi Sulawesi Utara resmi dibentuk",
    type: "milestone",
  },
  {
    year: "1975",
    title: "Kompetisi Pertama",
    description: "Menyelenggarakan kompetisi bola voli tingkat provinsi pertama",
    type: "achievement",
  },
  {
    year: "1985",
    title: "Prestasi Nasional",
    description: "Atlet Sulut meraih medali pertama di tingkat nasional",
    type: "achievement",
  },
  {
    year: "1995",
    title: "Era Profesional",
    description: "Mulai menerapkan sistem pembinaan yang lebih profesional",
    type: "milestone",
  },
  {
    year: "2005",
    title: "Modernisasi",
    description: "Implementasi teknologi dan sistem manajemen modern",
    type: "milestone",
  },
  {
    year: "2015",
    title: "Prestasi Internasional",
    description: "Atlet Sulut tampil di kompetisi internasional",
    type: "achievement",
  },
  {
    year: "2023",
    title: "Era Digital",
    description: "Transformasi digital dan pengembangan platform online",
    type: "milestone",
  },
]

const achievements = [
  {
    icon: Trophy,
    title: "50+ Medali",
    description: "Medali di berbagai kompetisi nasional",
    color: "orange",
  },
  {
    icon: Users,
    title: "500+ Atlet",
    description: "Atlet aktif yang terdaftar",
    color: "orange",
  },
  {
    icon: Star,
    title: "25+ Klub",
    description: "Klub terdaftar di seluruh Sulut",
    color: "orange",
  },
  {
    icon: Award,
    title: "10+ Pelatih",
    description: "Pelatih bersertifikat nasional",
    color: "orange",
  },
]

const legacyPoints = [
  "Menghasilkan atlet-atlet berprestasi tingkat nasional dan internasional",
  "Membangun tradisi olahraga bola voli yang kuat di Sulawesi Utara",
  "Menciptakan sistem pembinaan yang berkelanjutan dan terstruktur",
  "Mengembangkan infrastruktur olahraga bola voli di daerah",
  "Membangun kerjasama dengan berbagai institusi pendidikan",
  "Menjadi wadah pengembangan bakat muda di bidang bola voli",
]

export default function SejarahPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-20 mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Sejarah PBVSI Sulawesi Utara</h1>
              <p className="text-xl md:text-2xl text-orange-100 leading-relaxed">
                Perjalanan panjang membangun prestasi bola voli di Sulawesi Utara sejak 1960
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Perjalanan Sejarah</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Menelusuri jejak perkembangan PBVSI Sulawesi Utara dari masa ke masa
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-1 h-full bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>

              {timelineEvents.map((event, index) => (
                <motion.div
                  key={event.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative flex items-center mb-12 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full border-4 border-white shadow-lg z-10"></div>

                  {/* Content Card */}
                  <div
                    className={`ml-20 md:ml-0 md:w-5/12 ${index % 2 === 0 ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"}`}
                  >
                    <Card className="hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary" className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                            {event.year}
                          </Badge>
                          <Calendar className="w-5 h-5 text-orange-500" />
                        </div>
                        <CardTitle className="text-xl text-gray-900">{event.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 leading-relaxed">{event.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Pencapaian Kami</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Prestasi yang telah diraih selama perjalanan panjang PBVSI Sulawesi Utara
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <achievement.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{achievement.title}</h3>
                    <p className="text-gray-600">{achievement.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Legacy Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Warisan & Kontribusi</h2>
              <p className="text-gray-600 text-lg">
                Kontribusi PBVSI Sulawesi Utara dalam pengembangan olahraga bola voli
              </p>
            </motion.div>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="grid gap-6">
                  {legacyPoints.map((point, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="flex items-start"
                    >
                      <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed text-lg">{point}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center mt-12"
            >
              <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <CardContent className="p-8">
                  <Target className="w-16 h-16 mx-auto mb-4 opacity-90" />
                  <h3 className="text-2xl font-bold mb-4">Visi Masa Depan</h3>
                  <p className="text-orange-100 text-lg leading-relaxed">
                    Melanjutkan tradisi keunggulan dan terus berinovasi untuk menghasilkan atlet-atlet berprestasi yang
                    dapat mengharumkan nama Sulawesi Utara di kancah nasional dan internasional.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
