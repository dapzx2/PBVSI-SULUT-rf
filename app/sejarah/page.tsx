"use client"

import { motion } from "framer-motion"
import { Calendar, Trophy, Users, Star, Award, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const timelineEvents = [
  {
    year: "1955",
    title: "PBVSI Nasional Didirikan",
    description: "Persatuan Bola Voli Seluruh Indonesia didirikan secara nasional di Jakarta dengan tujuan mengembangkan bola voli di Indonesia",
    type: "founding",
  },
  {
    year: "1960-an",
    title: "PBVSI Sulut Mulai Terbentuk",
    description: "Organisasi bola voli Sulawesi Utara mulai terstruktur dan aktif (catatan: waktu pembentukan eksak belum terdokumentasi)",
    type: "milestone",
  },
  {
    year: "1961-1962",
    title: "Kompetisi Tingkat Nasional & Internasional",
    description: "Sulawesi Utara mulai mengirim kontingen ke PON V Bandung (1961) dan Asian Games Jakarta (1962), menunjukkan organisasi sudah terstruktur",
    type: "achievement",
  },
  {
    year: "1978",
    title: "Pengembangan SDM",
    description: "Pimpinan Daerah PBVSI Sulut mengirim pelatih Drs. M.M Rambing untuk kursus pelatih internasional di Hongkong (Maret-April 1978), membuktikan organisasi sudah memiliki struktur profesional",
    type: "milestone",
  },
  {
    year: "2015-2019",
    title: "Era Kepemimpinan Berkelanjutan",
    description: "Periode kepengurusan dengan fokus pengembangan klub dan atlet lokal",
    type: "milestone",
  },
  {
    year: "2020-2024",
    title: "Transformasi Modern",
    description: "Dipimpin Kapolda Sulut, PBVSI Sulut melanjutkan pembinaan atlet dan pengembangan infrastruktur olahraga bola voli di Sulawesi Utara",
    type: "achievement",
  },
  {
    year: "2024-2028",
    title: "Era Digital & Inovasi",
    description: "Transformasi platform digital dan pengembangan jejaring kemitraan dengan institusi pendidikan di tingkat regional",
    type: "milestone",
  },
]

const achievements = [
  {
    icon: Users,
    title: "Ratusan Atlet Aktif",
    description: "Atlet dari berbagai klub terdaftar di Sulawesi Utara",
    color: "orange",
  },
  {
    icon: Trophy,
    title: "Kompetisi Nasional",
    description: "Peserta aktif dalam PON, Kejurnas, dan kompetisi regional",
    color: "orange",
  },
  {
    icon: Award,
    title: "Pelatih Bersertifikat",
    description: "Pelatih dan pengurus bersertifikat nasional dan internasional",
    color: "orange",
  },
  {
    icon: Target,
    title: "Infrastruktur Berkembang",
    description: "Infrastruktur olahraga bola voli yang terus dikembangkan",
    color: "orange",
  },
]

const legacyPoints = [
  "Turut berkontribusi dalam sejarah perbolavolian nasional sejak tahun 1960-an",
  "Mengembangkan sistem pembinaan atlet muda yang berkelanjutan",
  "Membangun jaringan kerjasama dengan institusi pendidikan lokal",
  "Memberikan kesempatan kepada atlet untuk berkompetisi di tingkat nasional",
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
                Perjalanan membangun bola voli sejak era 1955
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
                  className={`relative flex items-center mb-12 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full border-4 border-white shadow-lg z-10"></div>

                  {/* Content Card */}
                  <div
                    className={`ml-20 md:ml-0 md:w-5/12 ${index % 2 === 0 ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"}`}
                  >
                    <Card className="bg-white hover:shadow-lg transition-all duration-300">
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
                <Card className="bg-white text-center hover:shadow-lg transition-all duration-300">
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

            <Card className="bg-white hover:shadow-lg transition-all duration-300">
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
                    Melanjutkan tradisi dan inovasi untuk menghasilkan atlet-atlet berprestasi yang dapat membawa nama Sulawesi Utara hingga jenjang nasional dan internasional.
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
