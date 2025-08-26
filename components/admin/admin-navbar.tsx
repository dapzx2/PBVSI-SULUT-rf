'use client'

'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const adminNavItems = [
  { name: 'Dashboard', href: '/admin/dashboard' },
  { name: 'Publikasi', href: '/admin/publikasi' },
  { name: 'Klub', href: '/admin/klub' },
  { name: 'Pemain', href: '/admin/pemain' },
  { name: 'Galeri', href: '/admin/galeri' },
  { name: 'Live Score', href: '/admin/live-score' },
  { name: 'Pengaturan', href: '/admin/pengaturan' },
]

export function AdminNavbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname()

  const getActiveClass = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
      ? 'text-orange-600 font-semibold'
      : 'text-gray-700 hover:text-orange-600'
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/admin/dashboard" className="flex items-center gap-2 flex-shrink-0">
          <Image
            src="/images/pbvsi-logo.png"
            alt="PBVSI Logo"
            width={40}
            height={40}
            className="h-8 w-8 sm:h-10 sm:w-10"
          />
          <span className="text-base sm:text-lg font-bold text-gray-800">Admin Panel</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-1 justify-center">
          <nav className="flex items-center gap-6">
            {adminNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-all duration-200 px-4 py-3 rounded-lg hover:bg-orange-50',
                  getActiveClass(item.href),
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Empty div for flex spacing */}
        <div className="hidden lg:block flex-shrink-0 w-[120px]"></div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <span>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-sm p-0">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b">
                <Link href="/admin/dashboard" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                  <Image src="/images/pbvsi-logo.png" alt="PBVSI Logo" width={32} height={32} className="h-8 w-8" />
                  <span className="text-lg font-bold text-gray-800">Admin Panel</span>
                </Link>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-2">
                  {adminNavItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'block text-base font-semibold transition-all duration-200 py-3 px-3 rounded-md hover:bg-orange-50 hover:translate-x-1',
                        getActiveClass(item.href),
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}