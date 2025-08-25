"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function AdminMatchesPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Manajemen Pertandingan</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600 mb-4" />
          <p className="text-gray-600">Fungsionalitas CRUD untuk Pertandingan akan segera hadir!</p>
          <p className="text-sm text-gray-500 mt-2">Halaman ini sedang dalam pengembangan.</p>
        </CardContent>
      </Card>
    </div>
  )
}
