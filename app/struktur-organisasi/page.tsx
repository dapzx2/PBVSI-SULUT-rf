"use client"

import { motion } from "framer-motion"
import {
  Users,
  Shield,
  BookOpen,
  Briefcase,
  Award,
  UserCheck,
  Trophy,
  User,
  Building2,
  Megaphone,
  FlaskConical,
  ShieldCheck,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

// Data for Pimpinan Pusat PBVSI
const pimpinanPusat = [
  {
    name: "Komjen Pol (Purn) Imam Sudjarwo",
    position: "Ketua Umum PBVSI Pusat",
    image: "/images/imam-sudjarwo.jpg",
    description:
      "Memimpin PBVSI menuju organisasi yang profesional, mandiri, dan berprestasi di tingkat nasional maupun internasional dengan mengutamakan pembinaan berkelanjutan dan pengembangan bakat muda Indonesia.",
    masaBakti: "2023-2027",
  },
]

// Data for Pimpinan PBVSI Sulawesi Utara
const pimpinanSulut = [
  {
    name: "Irjen Pol. Roycke Harry Langie, S.I.K., MH",
    position: "Ketua Umum PBVSI Sulut",
    image: "/images/irjen-pol-roycke-langie.jpg",
    description:
      "Memimpin organisasi dengan visi memajukan bola voli Sulawesi Utara di tingkat nasional dan internasional.",
    masaBakti: "2025-2029",
    extraBadge: "Kapolda Sulawesi Utara (ex-officio)",
  },
]

// Data for Wakil Ketua Umum
const wakilKetuaUmum = [
  {
    name: "Kombes Pol. Slamet Waloya, S.H., S.I.K",
    position: "Wakil Ketua Umum I",
    jabatan: "Karo SDM Polda Sulawesi Utara",
    icon: User,
  },
  {
    name: "Kombes Pol. Indra K. Mangunsong S.H.,SIK, MH",
    position: "Wakil Ketua Umum II",
    jabatan: "Dir. Lantas Polda Sulawesi Utara",
    icon: User,
  },
  {
    name: "Kombes Pol. FX. Winardi Prabowo, S.I.K., M.H",
    position: "Wakil Ketua Umum III",
    jabatan: "Dir. Krimsus Polda Sulawesi Utara",
    icon: User,
  },
  {
    name: "Dirut PT. Meares Soputan Mining",
    position: "Wakil Ketua Umum IV",
    jabatan: "",
    icon: Building2,
  },
  {
    name: "Drs. Ferdinand E.M. Mewengkang, MM",
    position: "Wakil Ketua Umum V",
    jabatan: "",
    icon: User,
  },
  {
    name: "GM PLN UID Suluttenggo",
    position: "Wakil Ketua Umum VI",
    jabatan: "",
    icon: Building2,
  },
  {
    name: "Kombes Pol Sugeng Prayitno",
    position: "Wakil Ketua Umum VII",
    jabatan: "Dir. Intelkam Polda Sulawesi Utara",
    icon: User,
  },
]

// Data for Pelindung
const pelindung = [
  {
    name: "Gubernur Sulawesi Utara",
    icon: Shield,
  },
  {
    name: "Ketua Umum KONI Sulawesi Utara",
    icon: Shield,
  },
  {
    name: "Pangdam XIII/Merdeka",
    icon: Shield,
  },
]

// Data for Penasehat
const penasehat = [
  {
    name: "Netty Agnes Pantow, SE",
    icon: BookOpen,
  },
  {
    name: "DR Harley A.B Mangindaan, SE. MSM",
    icon: BookOpen,
  },
  {
    name: "Joubert R.J. Dondokambey, SE",
    icon: BookOpen,
  },
]

// Data for Sekretariat
const sekretariat = [
  {
    name: "Joko Susanto, SE",
    position: "Sekretaris Umum",
    icon: UserCheck,
  },
  {
    name: "AKBP Nonie Sengkey, SP",
    position: "Bendahara Umum",
    icon: Briefcase,
  },
  {
    name: "Iptu Krispen M. Thomas, S.Psi., M.Si",
    position: "Wakil Sekretaris I",
    icon: UserCheck,
  },
  {
    name: "Elen Sukadis, S.Pd",
    position: "Wakil Sekretaris II",
    icon: UserCheck,
  },
  {
    name: "Rovidnud Senewe, SE",
    position: "Wakil Bendahara",
    icon: Briefcase,
  },
]

// Data for Bidang-bidang
const bidangKerja = [
  {
    name: "Bidang I - Organisasi",
    fokus: "Pengembangan dan pengelolaan struktur organisasi PBVSI Sulut.",
    ketua: "Marty M. Tuturoong, SE",
    wakilKetua: "Berry Wakulu, S.Pd",
    icon: Users,
  },
  {
    name: "Bidang II - Pembinaan Prestasi",
    fokus: "Peningkatan kualitas teknik bermain dan pencapaian prestasi optimal atlet.",
    ketua: "Syarul Hulima, SE",
    wakilKetua: "Lasarus Elungan, S.Pd., M.Si",
    icon: Trophy,
  },
  {
    name: "Bidang III - Kompetisi",
    fokus: "Penyelenggaraan kompetisi berkualitas dan sistem pertandingan yang adil.",
    ketua: "Dr. Jan Lengkong, M,Kes, AIFO",
    wakilKetua: "Meylani Mamangkey, S.Pd",
    icon: Award,
  },
  {
    name: "Bidang IV - Usaha Dana",
    fokus: "Pengelolaan keuangan dan pencarian sumber pendanaan organisasi.",
    ketua: "Nolvi Kilanta, SE, Msi",
    wakilKetua: "AKBP Dasveri Abdi",
    icon: Briefcase,
  },
  {
    name: "Bidang V - Promosi",
    fokus: "Promosi olahraga bola voli dan kegiatan PBVSI Sulut kepada masyarakat.",
    ketua: "Ferdinand Mangubahang, ST",
    wakilKetua: "Youke Tani, SE",
    icon: Megaphone,
  },
  {
    name: "Bidang VI - Litbang",
    fokus: "Penelitian dan pengembangan untuk inovasi dalam pembinaan dan manajemen.",
    ketua: "Alfreds Salindeho, SE",
    wakilKetua: "AKBP Yindar T. Sapangallo, S.Sos",
    icon: FlaskConical,
  },
  {
    name: "Bidang VII - Keamanan, Kesehatan dan Keselamatan (K3)",
    fokus: "Memastikan keamanan, kesehatan, dan keselamatan dalam setiap kegiatan olahraga.",
    ketua: "AKBP Irham Halid, S.I.K",
    wakilKetua: "Fredy E. Ransoen, SE",
    icon: ShieldCheck,
  },
]

// Data for Sistem Kepengurusan
const sistemKepengurusan = {
  title: "Musyawarah Provinsi (Musprov)",
  description:
    "Kepengurusan PBVSI Sulawesi Utara dipilih melalui Musyawarah Provinsi (Musprov) yang diadakan setiap empat tahun sekali, dengan melibatkan perwakilan dari seluruh pengurus kabupaten/kota. Sistem ini memastikan representasi yang adil dari seluruh wilayah Sulawesi Utara dalam pengambilan keputusan organisasi.",
}

// Data for Fungsi dan Koordinasi
const fungsiKoordinasi = [
  {
    title: "Pengurus Provinsi",
    description:
      "Implementasi kebijakan nasional di tingkat provinsi, koordinasi dengan kabupaten/kota, dan pembinaan atlet regional",
  },
  {
    title: "Koordinasi Regional",
    description:
      "Mengoordinasikan kegiatan bola voli di seluruh Sulawesi Utara dan menjadi penghubung dengan pengurus pusat",
  },
  {
    title: "Pembinaan Lokal",
    description: "Pembinaan klub-klub lokal, pengembangan bakat muda, dan penyelenggaraan kompetisi regional",
  },
]

export default function StrukturOrganisasiPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-20 mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Struktur Organisasi</h1>
              <p className="text-xl md:text-2xl text-orange-100 leading-relaxed">
                Susunan pengurus PBVSI Sulawesi Utara periode 2025-2029
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pimpinan Pusat PBVSI Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Pimpinan Pusat PBVSI</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Kepemimpinan di tingkat nasional yang menaungi seluruh pengurus provinsi
            </p>
          </motion.div>

          <div className="grid md:grid-cols-1 gap-8 max-w-2xl mx-auto mb-16">
            {pimpinanPusat.map((leader, index) => (
              <motion.div
                key={leader.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="bg-white hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <CardContent className="p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden flex-shrink-0 border-2 border-orange-300">
                      <Image
                        src={leader.image || "/placeholder-user.jpg"}
                        alt={leader.name}
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{leader.name}</h3>
                      <p className="text-orange-600 font-medium mb-2">{leader.position}</p>
                      <p className="text-gray-600 leading-relaxed mb-3">{leader.description}</p>
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        <Badge className="bg-gray-600 text-white">{`Masa Bakti ${leader.masaBakti}`}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pimpinan PBVSI Sulawesi Utara Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Pimpinan PBVSI Sulawesi Utara</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Kepemimpinan yang kuat untuk memajukan bola voli Sulawesi Utara
            </p>
          </motion.div>

          <div className="grid md:grid-cols-1 gap-8 max-w-2xl mx-auto mb-16">
            {pimpinanSulut.map((leader, index) => (
              <motion.div
                key={leader.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="bg-white hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <CardContent className="p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden flex-shrink-0 border-2 border-orange-300">
                      <Image
                        src={leader.image || "/placeholder-user.jpg"}
                        alt={leader.name}
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{leader.name}</h3>
                      <p className="text-orange-600 font-medium mb-2">{leader.position}</p>
                      <p className="text-gray-600 leading-relaxed mb-3">{leader.description}</p>
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        <Badge className="bg-gray-600 text-white">{`Masa Bakti ${leader.masaBakti}`}</Badge>
                        {leader.extraBadge && <Badge className="bg-orange-700 text-white">{leader.extraBadge}</Badge>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Wakil Ketua Umum Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Wakil Ketua Umum</h2>
            <p className="text-gray-600 text-lg">Tim wakil ketua yang menangani bidang-bidang strategis</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {wakilKetuaUmum.map((wakil, index) => (
              <motion.div
                key={wakil.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-white text-center hover:shadow-lg transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <wakil.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{wakil.name}</h3>
                    <p className="text-orange-600 font-medium mb-1">{wakil.position}</p>
                    {wakil.jabatan && <p className="text-gray-600 text-sm leading-relaxed">{wakil.jabatan}</p>}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pelindung & Penasehat */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Pelindung */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Pelindung</h3>
              <div className="space-y-4">
                {pelindung.map((item) => (
                  <Card key={item.name} className="bg-white hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <item.icon className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h4>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Penasehat */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Penasehat</h3>
              <div className="space-y-4">
                {penasehat.map((item) => (
                  <Card key={item.name} className="bg-white hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h4>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sekretariat Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Sekretariat</h2>
            <p className="text-gray-600 text-lg">Tim inti yang mengelola operasional harian organisasi</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {sekretariat.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-white text-center hover:shadow-lg transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                    <p className="text-orange-600 font-medium mb-3">{item.position}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bidang-bidang Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Bidang-bidang</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Bidang-bidang kerja yang menjalankan program dan kegiatan organisasi
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {bidangKerja.map((bidang, index) => (
              <motion.div
                key={bidang.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-white hover:shadow-lg transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mr-4">
                        <bidang.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-gray-900">{bidang.name}</CardTitle>
                        <p className="text-orange-600 font-medium">{`Ketua: ${bidang.ketua}`}</p>
                        <p className="text-gray-600 text-sm">{`Wakil Ketua: ${bidang.wakilKetua}`}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 leading-relaxed">{`Fokus: ${bidang.fokus}`}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sistem Kepengurusan Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Sistem Kepengurusan</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-white max-w-3xl mx-auto hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">{sistemKepengurusan.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{sistemKepengurusan.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Fungsi dan Koordinasi Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Fungsi dan Koordinasi</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {fungsiKoordinasi.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-white text-center hover:shadow-lg transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

