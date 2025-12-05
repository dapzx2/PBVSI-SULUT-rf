"use client"

import { motion } from "framer-motion"
import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import pbvsiLogo from "@/public/images/pbvsi-logo.png"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff, AlertCircle, CheckCircle, Mail } from "lucide-react"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    checkExistingAuth()
  }, [])

  const checkExistingAuth = async () => {
    try {
      const response = await fetch("/api/admin/auth/me", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setSuccess("Sudah login, mengalihkan ke dashboard...")
          setTimeout(() => {
            window.location.href = "/admin/dashboard"
          }, 1000)
        }
      }
    } catch {
      // Silent fail - user is not authenticated
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const loginData = { email, password }

      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(loginData),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(`Login berhasil! Selamat datang, ${data.user.username}`)
        setTimeout(() => {
          window.location.href = "/admin/dashboard"
        }, 1500)
      } else {
        setError(data.message || "Login gagal")
      }
    } catch {
      setError("Terjadi kesalahan koneksi")
    }
    finally {
      setLoading(false)
    }
  }

  const fillDemoCredentials = (userType: "super" | "regular") => {
    if (userType === "super") {
      setEmail("admin@pbvsisulut.com")
      setPassword("admin123")
    } else {
      setEmail("user@pbvsisulut.com")
      setPassword("admin123")
    }
    setError("")
    setSuccess("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-600 to-red-700 p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Decorative Circles */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-none shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-6">
              <div className="relative w-20 h-20 bg-white rounded-full p-2 shadow-lg ring-4 ring-orange-100">
                <Image
                  src={pbvsiLogo}
                  alt="PBVSI Logo"
                  fill
                  className="object-contain p-2"
                  priority
                />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Selamat Datang
            </CardTitle>
            <CardDescription className="text-base">
              Portal Admin PBVSI Sulawesi Utara
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <Alert className="border-green-200 bg-green-50 text-green-800">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="pl-10 h-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-all"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Kata Sandi</Label>
                <div className="relative group">
                  <div className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-orange-500 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-all"
                    required
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 h-11"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memverifikasi...
                  </>
                ) : (
                  "Masuk ke Dashboard"
                )}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Atau</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800"
                onClick={() => fillDemoCredentials("super")}
                disabled={loading}
              >
                Gunakan Akun Demo
              </Button>
            </form>
          </CardContent>
          <div className="p-4 bg-gray-50 rounded-b-xl border-t border-gray-100 text-center">
            <a href="/" className="text-sm text-gray-500 hover:text-orange-600 transition-colors flex items-center justify-center gap-2">
              ← Kembali ke Beranda
            </a>
          </div>
        </Card>

        <p className="text-center text-orange-100/80 text-sm mt-8">
          &copy; 2025 PBVSI Sulawesi Utara. Secure Admin Portal.
        </p>
      </motion.div>
    </div>
  )
}

