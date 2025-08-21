"use client"
import { useState } from "react"
import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  const [adminClickCount, setAdminClickCount] = useState(0)

  const handleLogoClick = () => {
    const newCount = adminClickCount + 1
    setAdminClickCount(newCount)

    console.log(`Admin access: ${newCount}/5 clicks`)

    if (newCount >= 5) {
      console.log("🎉 Admin access unlocked!")
      window.location.href = "/admin/login"
    }
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/images/pbvsi-logo.png"
                alt="PBVSI Sulut Logo"
                className="w-12 h-12 cursor-pointer transition-transform hover:scale-110"
                onClick={handleLogoClick}
              />
              <div>
                <h3 className="text-lg font-bold">PBVSI</h3>
                <p className="text-sm text-gray-300">Sulawesi Utara</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Persatuan Bola Voli Seluruh Indonesia Sulawesi Utara adalah organisasi yang mengembangkan olahraga bola
              voli di wilayah Sulawesi Utara.
            </p>
            {adminClickCount > 0 && adminClickCount < 5 && (
              <p className="text-xs text-orange-400">Admin access: {adminClickCount}/5 clicks</p>
            )}
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Tautan Cepat</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/tentang" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/sejarah" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Sejarah
                </Link>
              </li>
              <li>
                <Link href="/struktur-organisasi" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Struktur Organisasi
                </Link>
              </li>
              <li>
                <Link href="/berita" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Berita
                </Link>
              </li>
              <li>
                <Link href="/galeri" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Galeri
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Layanan</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/klub" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Daftar Klub
                </Link>
              </li>
              <li>
                <Link href="/database" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Database Pemain
                </Link>
              </li>
              <li>
                <Link href="/live-scores" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Live Scores
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Kontak Kami</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 mt-1 text-orange-400 flex-shrink-0" />
                <p className="text-gray-300 text-sm">
                  Jl. Piere Tendean, Manado
                  <br />
                  Sulawesi Utara 95111
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <p className="text-gray-300 text-sm">+62 431 123456</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <p className="text-gray-300 text-sm">info@pbvsisulut.com</p>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">© 2025 PBVSI Sulawesi Utara. Semua hak dilindungi.</p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Kebijakan Privasi
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Syarat & Ketentuan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
