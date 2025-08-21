"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, ChevronDown, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

interface StickyHeaderProps {
  currentPage?: string
}

export function StickyHeader({ currentPage }: StickyHeaderProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [openDropdowns, setOpenDropdowns] = React.useState<string[]>([])
  const [hoveredDropdown, setHoveredDropdown] = React.useState<string | null>(null)
  const [closeTimeout, setCloseTimeout] = React.useState<NodeJS.Timeout | null>(null)
  const pathname = usePathname()

  const navigation = [
    { name: "Beranda", href: "/" },
    {
      name: "Tentang",
      href: "/tentang",
      dropdown: [
        { name: "Overview", href: "/tentang" },
        { name: "Sejarah PBVSI", href: "/sejarah" },
        { name: "Struktur Organisasi", href: "/struktur-organisasi" },
      ],
    },
    { name: "Publikasi", href: "/berita" },
    { name: "Galeri", href: "/galeri" },
    { name: "Live Skor", href: "/live-scores" },
    {
      name: "Informasi Publik",
      href: "/informasi-publik",
      dropdown: [
        { name: "Database", href: "/database" },
        { name: "Klub", href: "/klub" },
        { name: "Kontak", href: "/kontak" },
      ],
    },
  ]

  const toggleDropdown = (itemName: string) => {
    setOpenDropdowns((prev) =>
      prev.includes(itemName) ? prev.filter((name) => name !== itemName) : [...prev, itemName],
    )
  }

  const handleMouseEnter = (itemName: string) => {
    // Clear any existing timeout
    if (closeTimeout) {
      clearTimeout(closeTimeout)
      setCloseTimeout(null)
    }
    setHoveredDropdown(itemName)
  }

  const handleMouseLeave = () => {
    // Add a delay before closing to prevent premature closure
    const timeout = setTimeout(() => {
      setHoveredDropdown(null)
    }, 150) // 150ms delay
    setCloseTimeout(timeout)
  }

  const handleDropdownMouseEnter = () => {
    // Clear timeout when mouse enters dropdown area
    if (closeTimeout) {
      clearTimeout(closeTimeout)
      setCloseTimeout(null)
    }
  }

  const handleDropdownMouseLeave = () => {
    // Close immediately when leaving dropdown area
    setHoveredDropdown(null)
    if (closeTimeout) {
      clearTimeout(closeTimeout)
      setCloseTimeout(null)
    }
  }

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (closeTimeout) {
        clearTimeout(closeTimeout)
      }
    }
  }, [closeTimeout])

  const getActiveClass = (href: string, isDropdownParent = false) => {
    if (isDropdownParent) {
      const dropdownItems = navigation.find((nav) => nav.href === href)?.dropdown
      if (dropdownItems && dropdownItems.some((item) => pathname.startsWith(item.href))) {
        return "text-orange-600 font-semibold"
      }
    }
    return pathname === href || pathname.startsWith(href + "/")
      ? "text-orange-600 font-semibold"
      : "text-gray-700 hover:text-orange-600"
  }

  // Function to determine dropdown alignment
  const getDropdownAlignment = (itemName: string) => {
    // For the last item in the navigation, align the dropdown to the right
    return itemName === "Informasi Publik" ? "right-0" : "left-0"
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <Image
            src="/images/pbvsi-logo.png"
            alt="PBVSI Logo"
            width={40}
            height={40}
            className="h-8 w-8 sm:h-10 sm:w-10"
          />
          <span className="text-base sm:text-lg font-bold text-gray-800">PBVSI Sulut</span>
        </Link>

        {/* Desktop Navigation - Centered */}
        <div className="hidden lg:flex flex-1 justify-center">
          <nav className="flex items-center gap-6">
            {navigation.map((item) =>
              item.dropdown ? (
                <div
                  key={item.name}
                  className="relative group"
                  onMouseEnter={() => handleMouseEnter(item.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      "text-sm font-medium transition-colors h-auto px-4 py-3 rounded-lg",
                      getActiveClass(item.href, true),
                    )}
                  >
                    {item.name}{" "}
                    <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                  </Button>

                  {/* Invisible bridge to prevent gap issues */}
                  <div
                    className={cn(
                      "absolute top-full left-0 w-full h-2 bg-transparent",
                      hoveredDropdown === item.name ? "block" : "hidden",
                    )}
                  />

                  <div
                    className={cn(
                      "absolute top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-3 z-50 overflow-hidden transition-all duration-200",
                      getDropdownAlignment(item.name),
                      hoveredDropdown === item.name
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-2 pointer-events-none",
                    )}
                    onMouseEnter={handleDropdownMouseEnter}
                    onMouseLeave={handleDropdownMouseLeave}
                  >
                    {/* Dropdown header */}
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-800">{item.name}</h3>
                    </div>

                    {/* Dropdown items */}
                    <div className="py-2">
                      {item.dropdown.map((dropdownItem, index) => (
                        <div
                          key={dropdownItem.name}
                          className={cn(
                            "transition-all duration-200",
                            hoveredDropdown === item.name ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2",
                            `transition-delay-${index * 50}`,
                          )}
                        >
                          <Link
                            href={dropdownItem.href}
                            className={cn(
                              "flex items-center px-4 py-3 text-sm transition-all duration-200 hover:bg-orange-50 hover:text-orange-600 hover:translate-x-1 group",
                              pathname === dropdownItem.href || pathname.startsWith(dropdownItem.href + "/")
                                ? "text-orange-600 font-semibold bg-orange-50 border-r-2 border-orange-600"
                                : "text-gray-700",
                            )}
                          >
                            <div className="flex-1">
                              <div className="font-medium">{dropdownItem.name}</div>
                              <div className="text-xs text-gray-500 mt-0.5 group-hover:text-orange-500">
                                {dropdownItem.name === "Overview" && "Informasi umum tentang PBVSI"}
                                {dropdownItem.name === "Sejarah PBVSI" && "Perjalanan sejarah organisasi"}
                                {dropdownItem.name === "Struktur Organisasi" && "Susunan kepengurusan"}
                                {dropdownItem.name === "Database" && "Data pemain dan statistik"}
                                {dropdownItem.name === "Klub" && "Daftar klub terdaftar"}
                                {dropdownItem.name === "Kontak" && "Informasi kontak dan alamat"}
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        </div>
                      ))}
                    </div>

                    {/* Dropdown footer */}
                    <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
                      <p className="text-xs text-gray-500">
                        {item.name === "Tentang" && "Pelajari lebih lanjut tentang PBVSI Sulawesi Utara"}
                        {item.name === "Informasi Publik" && "Akses informasi publik dan data terbuka"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-all duration-200 px-4 py-3 rounded-lg hover:bg-orange-50",
                    getActiveClass(item.href),
                  )}
                >
                  {item.name}
                </Link>
              ),
            )}
          </nav>
        </div>

        {/* Empty div for flex spacing */}
        <div className="hidden lg:block flex-shrink-0 w-[120px]"></div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-sm p-0">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b">
                <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                  <Image src="/images/pbvsi-logo.png" alt="PBVSI Logo" width={32} height={32} className="h-8 w-8" />
                  <span className="text-lg font-bold text-gray-800">PBVSI Sulut</span>
                </Link>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-2">
                  {navigation.map((item) =>
                    item.dropdown ? (
                      <Collapsible
                        key={item.name}
                        open={openDropdowns.includes(item.name)}
                        onOpenChange={() => toggleDropdown(item.name)}
                      >
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-between text-left font-semibold text-base p-3 h-auto transition-all duration-200 hover:bg-orange-50",
                              getActiveClass(item.href, true),
                            )}
                          >
                            {item.name}
                            <ChevronRight
                              className={cn(
                                "h-4 w-4 transition-transform duration-300",
                                openDropdowns.includes(item.name) && "rotate-90",
                              )}
                            />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="ml-4 mt-1 space-y-1">
                          {item.dropdown.map((dropdownItem) => (
                            <div
                              key={dropdownItem.name}
                              className="transition-all duration-300 opacity-100 translate-x-0"
                            >
                              <Link
                                href={dropdownItem.href}
                                className={cn(
                                  "block text-sm font-medium transition-all duration-200 py-2 px-3 rounded-md hover:bg-orange-50 hover:translate-x-1",
                                  pathname === dropdownItem.href || pathname.startsWith(dropdownItem.href + "/")
                                    ? "text-orange-600 font-semibold bg-orange-50"
                                    : "text-gray-700 hover:text-orange-600",
                                )}
                                onClick={() => setIsOpen(false)}
                              >
                                {dropdownItem.name}
                              </Link>
                            </div>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "block text-base font-semibold transition-all duration-200 py-3 px-3 rounded-md hover:bg-orange-50 hover:translate-x-1",
                          getActiveClass(item.href),
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ),
                  )}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
