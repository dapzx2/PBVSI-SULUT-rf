"use client"

import { motion } from "framer-motion"
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff, User, Shield, AlertCircle, CheckCircle } from "lucide-react"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

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
    } catch (error) {
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
    } catch (error) {
      setError("Terjadi kesalahan koneksi")
    } finally {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src="/images/pbvsi-logo.png" alt="PBVSI Logo" className="w-16 h-16" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Login Admin</CardTitle>
          <CardDescription>PBVSI Sulawesi Utara</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Demo Buttons */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fillDemoCredentials("super")}
              className="flex items-center gap-2"
              disabled={loading}
            >
              <Shield className="w-4 h-4" />
              Super Admin
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fillDemoCredentials("regular")}
              className="flex items-center gap-2"
              disabled={loading}
            >
              <User className="w-4 h-4" />
              Admin Biasa
            </Button>
          </div>

          {/* Success Message */}
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pbvsisulut.com"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Kata Sandi</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi Anda"
                  required
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Masuk"
              )}
            </Button>
          </form>

          {/* Demo Credentials Info */}
          <div className="text-xs text-gray-500 text-center mt-4 space-y-1">
            <p className="font-medium">Kredensial Demo:</p>
            <p>Super Admin: admin@pbvsisulut.com / admin123</p>
            <p>Regular Admin: user@pbvsisulut.com / admin123</p>
          </div>
        </CardContent>
      </Card>
      </motion.div>
    </div>
  )
}