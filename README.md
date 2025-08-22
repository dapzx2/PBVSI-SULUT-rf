# PBVSI Sulut - Portal Resmi Bola Voli Sulawesi Utara

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Styled with Tailwind](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)

Portal resmi PBVSI Sulawesi Utara dengan informasi lengkap tentang bola voli putra dan putri, database pemain, berita terkini, dan struktur organisasi.

## 🚀 Live Demo

**[https://pbvsi-sulut.vercel.app](https://pbvsi-sulut.vercel.app)**

## ✨ Fitur Utama

- 🏐 **Database Pemain Lengkap** - Profil detail pemain putra dan putri
- 📰 **Portal Berita** - Berita terkini dunia bola voli Sulut
- 🏛️ **Struktur Organisasi** - Susunan pengurus PBVSI resmi
- 📱 **Responsive Design** - Optimal di semua perangkat
- 🎨 **Theme Switching** - Tema berbeda untuk putra (orange) dan putri (pink)
- ⚡ **Performance Optimized** - Loading cepat dengan Next.js

## 🛠️ Teknologi

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Vercel
- **Language**: TypeScript

## 📦 Instalasi Lokal

\`\`\`bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/pbvsi-sulut-website.git
cd pbvsi-sulut-website

# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
# http://localhost:3000
\`\`\`

## 🚀 Deployment

### Deploy ke Vercel (Recommended)

1. **Push ke GitHub**:
   \`\`\`bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   \`\`\`

2. **Deploy via Vercel**:
   - Kunjungi [vercel.com](https://vercel.com)
   - Import repository GitHub
   - Deploy otomatis

3. **Custom Domain** (Opsional):
   - Tambahkan domain di Vercel dashboard
   - Konfigurasi DNS sesuai instruksi

### Deploy via CLI

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Login dan deploy
vercel login
vercel --prod
\`\`\`

## 📁 Struktur Project

\`\`\`
pbvsi-sulut-website/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Homepage
│   ├── berita/            # News section
│   ├── database/          # Player database
│   ├── player/[id]/       # Player profiles
│   └── struktur-organisasi/ # Organization structure
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── sticky-header.tsx # Navigation header
│   └── page-transition.tsx # Page animations
├── contexts/             # React contexts
│   └── theme-context.tsx # Theme management
├── public/              # Static assets
│   └── images/         # Player photos
└── styles/             # Global styles
\`\`\`

## 🎨 Fitur Design

- **Dual Theme System**: Orange untuk putra, pink untuk putri
- **Smooth Animations**: Transisi halus dengan Framer Motion
- **Modern UI**: Komponen shadcn/ui yang konsisten
- **Mobile First**: Responsive di semua ukuran layar
- **Accessibility**: Mengikuti standar WCAG

## 📊 Data Pemain

Website ini menampilkan data pemain bola voli Sulawesi Utara:

### Pemain Putra
- Rendy Tamamilang (Jakarta Bhayangkara Presisi)
- Jordan Michael Imanuel (Jakarta LavAni Allo Bank Electric)
- Dimas Saputra Pratama (Jakarta STIN BIN)
- Dan pemain lainnya...

### Pemain Putri
- Shelomitha Wongkar (Bandung bjb Tandamata)
- Angel Sualang (Tim Sulawesi Utara)
- Calista Maya Ersandita (Bandung bjb Tandamata)
- Dan pemain lainnya...

## 🔧 Konfigurasi

### Environment Variables

Untuk fitur tambahan, tambahkan di `.env.local`:

\`\`\`env
# Analytics (opsional)
NEXT_PUBLIC_GA_ID=your_google_analytics_id

# API Keys (jika diperlukan)
NEXT_PUBLIC_API_URL=your_api_url
\`\`\`

### Customization

- **Warna tema**: Edit `contexts/theme-context.tsx`
- **Data pemain**: Update `app/database/page.tsx`
- **Struktur organisasi**: Edit `app/struktur-organisasi/page.tsx`

## 📈 Performance

- ✅ **Core Web Vitals**: Optimized
- ✅ **SEO**: Meta tags dan struktur yang baik
- ✅ **Images**: Next.js Image optimization
- ✅ **Fonts**: Optimized font loading
- ✅ **Bundle Size**: Tree-shaking dan code splitting

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buat Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

**PBVSI Sulawesi Utara**
- Alamat: Jl. Piere Tendean, Manado, Sulawesi Utara 95111
- Telepon: +62 431 123456
- Email: info@pbvsisulut.com
- Jam Operasional: Senin - Jumat, 08:00 - 17:00
- Website: [pbvsi-sulut.vercel.app](https://pbvsi-sulut.vercel.app)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - React framework
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com) - UI components
- [Framer Motion](https://framer.com/motion) - Animation library
- [Vercel](https://vercel.com) - Deployment platform

---

**Dibuat dengan ❤️ untuk PBVSI Sulawesi Utara**
