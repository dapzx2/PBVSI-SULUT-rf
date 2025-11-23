"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Clock, UserPlus, Trophy, FileText, ImageIcon, Loader2, AlertCircle, ChevronLeft, ChevronRight, Shield } from "lucide-react"
import { AdminActivityLog } from "@/lib/admin"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function AdminActivityPage() {
  const [activities, setActivities] = useState<AdminActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit] = useState(10)

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/admin/activity?page=${page}&limit=${limit}`)
        if (!response.ok) {
          throw new Error("Failed to fetch activities")
        }
        const data = await response.json()
        setActivities(data.data?.logs || [])
        setTotalPages(data.data?.pagination?.totalPages || 1)
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false)
      }
    }
    fetchActivities()
  }, [page, limit])

  const getActivityIcon = (action: string) => {
    if (action.includes("player") || action.includes("pemain")) return <UserPlus className="h-4 w-4 text-blue-600" />
    if (action.includes("match") || action.includes("pertandingan")) return <Trophy className="h-4 w-4 text-orange-600" />
    if (action.includes("article") || action.includes("berita")) return <FileText className="h-4 w-4 text-purple-600" />
    if (action.includes("gallery") || action.includes("galeri")) return <ImageIcon className="h-4 w-4 text-pink-600" />
    if (action.includes("club") || action.includes("klub")) return <Shield className="h-4 w-4 text-green-600" />
    return <Clock className="h-4 w-4 text-gray-600" />
  }

  const getActionBadge = (action: string) => {
    let color = "bg-gray-100 text-gray-800"
    if (action.includes("create") || action.includes("tambah")) color = "bg-green-100 text-green-800"
    if (action.includes("update") || action.includes("edit") || action.includes("ubah")) color = "bg-blue-100 text-blue-800"
    if (action.includes("delete") || action.includes("hapus")) color = "bg-red-100 text-red-800"

    return <Badge variant="outline" className={`${color} border-none`}>{action}</Badge>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Clock className="h-6 w-6 text-orange-600" />
                Aktivitas Sistem
              </CardTitle>
              <CardDescription>
                Riwayat lengkap aktivitas administrator dalam sistem.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Aksi</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Waktu</TableHead>
                      <TableHead>Detail</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activities.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          Belum ada aktivitas tercatat.
                        </TableCell>
                      </TableRow>
                    ) : (
                      activities.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell className="font-medium">
                            {getActionBadge(activity.action)}
                          </TableCell>
                          <TableCell>{activity.username || "Unknown"}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {new Date(activity.timestamp).toLocaleString("id-ID", {
                              dateStyle: "medium",
                              timeStyle: "short"
                            })}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-[300px]">
                            {activity.details && typeof activity.details === 'object' ? (
                              <div className="flex flex-col gap-1">
                                {Object.entries(activity.details).map(([key, value]) => (
                                  <div key={key} className="flex gap-1">
                                    <span className="font-semibold capitalize">{key.replace(/_/g, ' ')}:</span>
                                    <span className="truncate" title={String(value)}>{String(value)}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="italic">No details</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}