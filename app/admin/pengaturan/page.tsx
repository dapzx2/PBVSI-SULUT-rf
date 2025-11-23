"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { toast as sonnerToast } from "sonner"
import { Loader2, Globe, Share2, User, LogOut, Upload, X, Building2, Mail, Phone, MapPin, Save } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Website Info State
  const [websiteInfo, setWebsiteInfo] = useState({
    name: "PBVSI Sulawesi Utara",
    tagline: "Persatuan Bola Voli Seluruh Indonesia",
    email: "info@pbvsisulut.com",
    phone: "+62 812-3456-7890",
    address: "Jl. Contoh No. 123, Manado, Sulawesi Utara"
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  // Social Media State
  const [socialMedia, setSocialMedia] = useState({
    facebook: "https://facebook.com/pbvsisulut",
    instagram: "https://instagram.com/pbvsisulut",
    twitter: "https://twitter.com/pbvsisulut",
    youtube: "https://youtube.com/@pbvsisulut",
    whatsapp: "+62 812-3456-7890"
  })

  // Admin Profile State
  const [adminProfile, setAdminProfile] = useState({
    name: "Admin PBVSI",
    email: "admin@pbvsisulut.com"
  })
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null)
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null)
  const profilePhotoInputRef = useRef<HTMLInputElement>(null)

  // Password State
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  // Fetch settings from API on mount
  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (!response.ok) throw new Error('Failed to fetch settings')

      const data = await response.json()
      setWebsiteInfo({
        name: data.website_name || '',
        tagline: data.tagline || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || ''
      })
      setSocialMedia({
        facebook: data.facebook || '',
        instagram: data.instagram || '',
        twitter: data.twitter || '',
        youtube: data.youtube || '',
        whatsapp: data.whatsapp || ''
      })
      if (data.logo_url) setLogoPreview(data.logo_url)
    } catch (error) {
      console.error('Error fetching settings:', error)
      sonnerToast.error('Gagal memuat pengaturan')
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setLogoPreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfilePhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setProfilePhotoPreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setLogoPreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfilePhotoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setProfilePhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setProfilePhotoPreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const saveWebsiteInfo = async () => {
    setSaving(true)
    try {
      let finalLogoUrl = logoPreview

      // Upload logo if new file selected
      if (logoFile) {
        const formData = new FormData()
        formData.append('file', logoFile)

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!uploadResponse.ok) throw new Error('Failed to upload logo')
        const uploadData = await uploadResponse.json()
        finalLogoUrl = uploadData.url
        setLogoPreview(finalLogoUrl)
      }

      // Save to database
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          website_name: websiteInfo.name,
          tagline: websiteInfo.tagline,
          email: websiteInfo.email,
          phone: websiteInfo.phone,
          address: websiteInfo.address,
          logo_url: finalLogoUrl
        })
      })

      if (!response.ok) throw new Error('Failed to save settings')

      setLogoFile(null)
      sonnerToast.success("Informasi website berhasil disimpan!")
    } catch (error: any) {
      console.error('Error saving website info:', error)
      sonnerToast.error(error.message || "Gagal menyimpan informasi website")
    } finally {
      setSaving(false)
    }
  }

  const saveSocialMedia = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          facebook: socialMedia.facebook,
          instagram: socialMedia.instagram,
          twitter: socialMedia.twitter,
          youtube: socialMedia.youtube,
          whatsapp: socialMedia.whatsapp
        })
      })

      if (!response.ok) throw new Error('Failed to save social media')

      sonnerToast.success("Link social media berhasil disimpan!")
    } catch (error: any) {
      console.error('Error saving social media:', error)
      sonnerToast.error(error.message || "Gagal menyimpan social media")
    } finally {
      setSaving(false)
    }
  }

  const saveAdminProfile = () => {
    // TODO: Implement admin profile update via admin_users table
    setSaving(true)
    setTimeout(() => {
      sonnerToast.success("Profile admin berhasil disimpan!")
      setSaving(false)
    }, 500)
  }

  const handleChangePassword = () => {
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      sonnerToast.error("Semua field password harus diisi!")
      return
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      sonnerToast.error("Password baru dan konfirmasi tidak cocok!")
      return
    }
    if (passwordData.newPassword.length < 6) {
      sonnerToast.error("Password minimal 6 karakter!")
      return
    }

    // TODO: Implement password change via auth API
    setSaving(true)
    setTimeout(() => {
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" })
      setSaving(false)
      sonnerToast.success("Password berhasil diubah!")
    }, 500)
  }

  const handleLogout = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Berhasil",
          description: "Anda telah berhasil keluar.",
        })
        router.push("/admin/login")
      } else {
        const errorData = await response.json()
        toast({
          title: "Gagal",
          description: errorData.error || "Terjadi kesalahan saat keluar.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Error",
        description: "Tidak dapat terhubung ke server.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="border-none shadow-md">
        <CardHeader className="border-b pb-6">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            Pengaturan Sistem
          </CardTitle>
          <CardDescription>
            Kelola pengaturan website, social media, dan profile admin Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="website" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
              <TabsTrigger value="website" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span className="hidden sm:inline">Website</span>
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Social Media</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Akun</span>
              </TabsTrigger>
            </TabsList>

            {/* Website Info Tab */}
            <TabsContent value="website" className="space-y-6 min-h-[600px]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="website-name" className="flex items-center gap-2 text-primary">
                      <Building2 className="h-4 w-4" /> Nama Website
                    </Label>
                    <Input
                      id="website-name"
                      value={websiteInfo.name}
                      onChange={(e) => setWebsiteInfo({ ...websiteInfo, name: e.target.value })}
                      placeholder="PBVSI Sulawesi Utara"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tagline" className="flex items-center gap-2 text-primary">
                      <Globe className="h-4 w-4" /> Tagline/Slogan
                    </Label>
                    <Input
                      id="tagline"
                      value={websiteInfo.tagline}
                      onChange={(e) => setWebsiteInfo({ ...websiteInfo, tagline: e.target.value })}
                      placeholder="Persatuan Bola Voli Seluruh Indonesia"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2 text-primary">
                      <Mail className="h-4 w-4" /> Email Kontak
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={websiteInfo.email}
                      onChange={(e) => setWebsiteInfo({ ...websiteInfo, email: e.target.value })}
                      placeholder="info@pbvsisulut.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2 text-primary">
                      <Phone className="h-4 w-4" /> Nomor Telepon
                    </Label>
                    <Input
                      id="phone"
                      value={websiteInfo.phone}
                      onChange={(e) => setWebsiteInfo({ ...websiteInfo, phone: e.target.value })}
                      placeholder="+62 812-3456-7890"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center gap-2 text-primary">
                      <MapPin className="h-4 w-4" /> Alamat Kantor
                    </Label>
                    <Textarea
                      id="address"
                      value={websiteInfo.address}
                      onChange={(e) => setWebsiteInfo({ ...websiteInfo, address: e.target.value })}
                      placeholder="Alamat lengkap kantor"
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-primary">
                      <Upload className="h-4 w-4" /> Logo Website
                    </Label>
                    <div
                      className={cn(
                        "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors hover:bg-muted/50 min-h-[200px] flex flex-col items-center justify-center",
                        logoPreview ? "border-primary/50" : "border-muted-foreground/25"
                      )}
                      onDrop={handleLogoDrop}
                      onDragOver={(e) => e.preventDefault()}
                      onClick={() => logoInputRef.current?.click()}
                    >
                      <Input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                      {logoPreview ? (
                        <div className="relative w-full h-full min-h-[200px]">
                          <Image
                            src={logoPreview}
                            alt="Logo Preview"
                            fill
                            className="object-contain"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation()
                              setLogoFile(null)
                              setLogoPreview(null)
                              localStorage.removeItem('logoPreview')
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground py-8">
                          <div className="p-3 bg-muted rounded-full">
                            <Upload className="h-6 w-6" />
                          </div>
                          <p className="text-sm font-medium">Klik atau tarik logo ke sini</p>
                          <p className="text-xs">PNG, JPG, SVG (Max 2MB)</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button onClick={saveWebsiteInfo} disabled={saving} className="min-w-[140px]">
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Simpan
                </Button>
              </div>
            </TabsContent>

            {/* Social Media Tab */}
            <TabsContent value="social" className="space-y-6 min-h-[600px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook URL</Label>
                  <Input
                    id="facebook"
                    value={socialMedia.facebook}
                    onChange={(e) => setSocialMedia({ ...socialMedia, facebook: e.target.value })}
                    placeholder="https://facebook.com/pbvsisulut"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram URL</Label>
                  <Input
                    id="instagram"
                    value={socialMedia.instagram}
                    onChange={(e) => setSocialMedia({ ...socialMedia, instagram: e.target.value })}
                    placeholder="https://instagram.com/pbvsisulut"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter/X URL</Label>
                  <Input
                    id="twitter"
                    value={socialMedia.twitter}
                    onChange={(e) => setSocialMedia({ ...socialMedia, twitter: e.target.value })}
                    placeholder="https://twitter.com/pbvsisulut"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube URL</Label>
                  <Input
                    id="youtube"
                    value={socialMedia.youtube}
                    onChange={(e) => setSocialMedia({ ...socialMedia, youtube: e.target.value })}
                    placeholder="https://youtube.com/@pbvsisulut"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input
                    id="whatsapp"
                    value={socialMedia.whatsapp}
                    onChange={(e) => setSocialMedia({ ...socialMedia, whatsapp: e.target.value })}
                    placeholder="+62 812-3456-7890"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button onClick={saveSocialMedia} disabled={saving} className="min-w-[140px]">
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Simpan
                </Button>
              </div>
            </TabsContent>

            {/* Admin Profile Tab */}
            <TabsContent value="profile" className="space-y-6 min-h-[600px]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-name">Nama Display</Label>
                    <Input
                      id="admin-name"
                      value={adminProfile.name}
                      onChange={(e) => setAdminProfile({ ...adminProfile, name: e.target.value })}
                      placeholder="Admin PBVSI"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email Admin</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      value={adminProfile.email}
                      readOnly
                      className="bg-muted cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground">Email tidak dapat diubah</p>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-semibold mb-4">Ubah Password</h3>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="old-password">Password Lama</Label>
                        <Input
                          id="old-password"
                          type="password"
                          value={passwordData.oldPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                          placeholder="Masukkan password lama"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Password Baru</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          placeholder="Masukkan password baru"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Konfirmasi Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          placeholder="Ulangi password baru"
                        />
                      </div>
                      <Button onClick={handleChangePassword} disabled={saving} variant="outline" className="w-full">
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Ubah Password
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-primary">
                      <Upload className="h-4 w-4" /> Foto Profile
                    </Label>
                    <div
                      className={cn(
                        "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors hover:bg-muted/50 h-[300px] flex flex-col items-center justify-center",
                        profilePhotoPreview ? "border-primary/50" : "border-muted-foreground/25"
                      )}
                      onDrop={handleProfilePhotoDrop}
                      onDragOver={(e) => e.preventDefault()}
                      onClick={() => profilePhotoInputRef.current?.click()}
                    >
                      <Input
                        ref={profilePhotoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePhotoChange}
                        className="hidden"
                      />
                      {profilePhotoPreview ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={profilePhotoPreview}
                            alt="Profile Preview"
                            fill
                            className="object-contain rounded-md"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md z-10"
                            onClick={(e) => {
                              e.stopPropagation()
                              setProfilePhotoFile(null)
                              setProfilePhotoPreview(null)
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <div className="p-3 bg-muted rounded-full">
                            <User className="h-8 w-8" />
                          </div>
                          <p className="text-sm font-medium">Klik atau tarik foto ke sini</p>
                          <p className="text-xs">PNG, JPG (Max 2MB)</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button onClick={saveAdminProfile} disabled={saving} className="min-w-[140px]">
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Simpan Profile
                </Button>
              </div>
            </TabsContent>

            {/* Account Tab */}
            <TabsContent value="account" className="space-y-6 min-h-[600px]">
              <div className="max-w-md mx-auto">
                <Card className="border-destructive/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Informasi Akun</CardTitle>
                    <CardDescription>
                      Anda sedang login sebagai admin
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input value={adminProfile.email} readOnly className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                      <Label>Nama</Label>
                      <Input value={adminProfile.name} readOnly className="bg-muted" />
                    </div>
                    <div className="pt-4 border-t">
                      <Button
                        onClick={handleLogout}
                        disabled={loading}
                        variant="destructive"
                        className="w-full"
                      >
                        {loading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <LogOut className="mr-2 h-4 w-4" />
                        )}
                        Keluar dari Akun
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
