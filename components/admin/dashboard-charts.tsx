"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Loader2 } from "lucide-react"

interface ChartData {
    name: string
    value: number
    [key: string]: any
}

const COLORS = [
    "#FF6B6B", // Red
    "#4ECDC4", // Teal
    "#45B7D1", // Blue
    "#FFA07A", // Light Salmon
    "#98D8C8", // Mint
    "#F7DC6F", // Yellow
    "#BB8FCE", // Purple
    "#82E0AA", // Green
];

export function DashboardCharts() {
    const [data, setData] = useState<ChartData[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/admin/dashboard/player-distribution")
                if (response.ok) {
                    const result = await response.json()
                    setData(result.data)
                }
            } catch (error) {
                console.error("Failed to fetch chart data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Distribusi Pemain per Klub</CardTitle>
                <CardDescription>
                    Persentase jumlah pemain yang terdaftar di setiap klub.
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                {loading ? (
                    <div className="h-[350px] flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                    </div>
                ) : data.length === 0 ? (
                    <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                        Belum ada data pemain.
                    </div>
                ) : (
                    <ChartContainer
                        config={{
                            value: {
                                label: "Pemain",
                            },
                        }}
                        className="h-[350px] w-full"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }: { name?: string; percent?: number }) => `${((percent || 0) * 100).toFixed(0)}%`}
                                    outerRadius={120}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
