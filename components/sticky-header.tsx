"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Menu,
  ChevronDown,
  ChevronRight,
  Home,
  Info,
  History,
  Users,
  Newspaper,
  Image as ImageIcon,
  Trophy,
  FileText,
  Database,
  Shield,
  Phone,
  X
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface StickyHeaderProps {
  currentPage?: string
}

export function StickyHeader({ currentPage: _currentPage }: StickyHeaderProps) {
  void _currentPage
  const [isOpen, setIsOpen] = React.useState(false)
  const [hoveredDropdown, setHoveredDropdown] = React.useState<string | null>(null)
  const pathname = usePathname()

  const navigation = [
    { name: "Beranda", href: "/", icon: Home },
    {
      name: "Tentang",
      href: "/tentang",
      icon: Info,
      dropdown: [
        { name: "Sejarah PBVSI", href: "/sejarah", icon: History, description: "Perjalanan bola voli di Sulut" },
        { name: "Struktur Organisasi", href: "/struktur-organisasi", icon: Users, description: "Pengurus dan jajaran" },
      ],
    },
    { name: "Berita", href: "/berita", icon: Newspaper },
    { name: "Galeri", href: "/galeri", icon: ImageIcon },
    { name: "Pertandingan", href: "/pertandingan", icon: Trophy },
    {
      name: "Informasi Publik",
      href: "/informasi-publik",
      icon: FileText,
      dropdown: [
        { name: "Database", href: "/database", icon: Database, description: "Data atlet dan pelatih" },
        { name: "Klub", href: "/klub", icon: Shield, description: "Daftar klub terdaftar" },
        { name: "Kontak", href: "/kontak", icon: Phone, description: "Hubungi kami" },
      ],
    },
  ]

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/images/pbvsi-logo.png"
              alt="PBVSI Logo"
              fill
              className="object-contain drop-shadow-sm"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight leading-none">PBVSI</span>
            <span className="text-xs sm:text-sm font-medium text-orange-600 tracking-widest uppercase">Sulawesi Utara</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-1 justify-center">
          <nav className="flex items-center gap-1 bg-gray-50 p-1.5 rounded-full border border-gray-100">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.dropdown && setHoveredDropdown(item.name)}
                onMouseLeave={() => item.dropdown && setHoveredDropdown(null)}
              >
                {item.dropdown ? (
                  <div className="relative">
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                        isActive(item.href)
                          ? "bg-white text-orange-600 shadow-sm ring-1 ring-gray-200"
                          : "text-gray-600 hover:text-gray-900 hover:bg-white/80"
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                      <ChevronDown className={cn("w-3 h-3 transition-transform duration-300", hoveredDropdown === item.name ? "rotate-180" : "")} />
                    </Link>

                    <AnimatePresence>
                      {hoveredDropdown === item.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 pt-2 w-64 z-50"
                        >
                          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden p-2">
                            {item.dropdown.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className="flex items-start gap-3 p-3 rounded-xl hover:bg-orange-50 transition-colors group/item"
                              >
                                <div className="p-2 bg-orange-100 rounded-lg text-orange-600 group-hover/item:bg-orange-200 transition-colors">
                                  <subItem.icon className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-gray-900 group-hover/item:text-orange-700">
                                    {subItem.name}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    {subItem.description}
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                      isActive(item.href)
                        ? "bg-white text-orange-600 shadow-sm ring-1 ring-gray-200"
                        : "text-gray-600 hover:text-gray-900 hover:bg-white/80"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center justify-end lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-orange-50 text-gray-700">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0 border-l-0">
              <div className="flex flex-col h-full bg-white">
                <div className="p-6 pt-8 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image src="/images/pbvsi-logo.png" alt="PBVSI" width={32} height={32} className="w-8 h-8" />
                    <span className="font-bold text-lg text-gray-900">Menu</span>
                  </div>
                  {/* Default SheetClose is used here */}
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  <nav className="space-y-2">
                    {navigation.map((item) => (
                      item.dropdown ? (
                        <Accordion type="single" collapsible key={item.name} className="border-none">
                          <AccordionItem value={item.name} className="border-none">
                            <AccordionTrigger className={cn(
                              "flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-orange-600 hover:no-underline transition-all",
                              isActive(item.href) && "bg-orange-50 text-orange-600 font-semibold"
                            )}>
                              <div className="flex items-center gap-3">
                                <item.icon className="w-5 h-5" />
                                <span>{item.name}</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-0 pt-1">
                              <div className="pl-12 pr-2 space-y-1">
                                {item.dropdown.map((subItem) => (
                                  <Link
                                    key={subItem.name}
                                    href={subItem.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors",
                                      isActive(subItem.href)
                                        ? "bg-orange-50 text-orange-600 font-medium"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    )}
                                  >
                                    <subItem.icon className="w-4 h-4" />
                                    {subItem.name}
                                  </Link>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      ) : (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                            isActive(item.href)
                              ? "bg-orange-50 text-orange-600 font-semibold"
                              : "text-gray-700 hover:bg-gray-50 hover:text-orange-600"
                          )}
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.name}</span>
                        </Link>
                      )
                    ))}
                  </nav>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      &copy; 2025 PBVSI Sulawesi Utara
                    </p>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
