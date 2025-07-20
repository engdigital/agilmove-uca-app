"use client"

import { useMemo } from "react" // Importar useMemo
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLiveQuery } from "dexie-react-hooks"
import { db, type ReadingEntry } from "@/lib/db"
import { staticScrolls } from "@/lib/scrolls"
import { formatDateToDisplay } from "@/lib/app-utils"
import { useAndroidBackHandler } from "@/hooks/use-android-back-handler"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts"

export default function AnalyticsPage() {
  const router = useRouter()
  
  // Hook para tratar o botão voltar do Android
  useAndroidBackHandler()
  
  const allReadings = useLiveQuery(() => db.readings.toArray(), [])
  const allScrollProgress = useLiveQuery(() => db.scrollProgress.toArray(), [])

  const getDailyReadingsData = (readings: ReadingEntry[] | undefined) => {
    if (!readings || readings.length === 0) return []

    const dailyCounts: { [key: string]: number } = {}
    readings.forEach((reading) => {
      const dateKey = reading.dateKey
      dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1
    })

    return Object.keys(dailyCounts)
      .map((dateKey) => ({
        date: formatDateToDisplay(new Date(dateKey)),
        count: dailyCounts[dateKey],
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  const getPeriodDistributionData = (readings: ReadingEntry[] | undefined) => {
    if (!readings || readings.length === 0) return []

    const periodCounts = { morning: 0, afternoon: 0, evening: 0 }
    readings.forEach((reading) => {
      periodCounts[reading.period]++
    })

    return [
      { name: "Manhã", value: periodCounts.morning, color: "#FFD700" },
      { name: "Tarde", value: periodCounts.afternoon, color: "#FFA500" },
      { name: "Noite", value: periodCounts.evening, color: "#4169E1" },
    ].filter((p) => p.value > 0)
  }

  const getScrollProgressData = (
    scrollProgress: { scrollId: number; completedDays: number }[] | undefined,
    allReadings: ReadingEntry[] | undefined,
  ) => {
    if (!scrollProgress || !allReadings) return []

    return staticScrolls
      .map((scroll) => {
        const progress = scrollProgress.find((s) => s.scrollId === scroll.id)
        const completedDays = progress ? progress.completedDays : 0
        const totalDays = 30
        const percentage = Math.round((completedDays / totalDays) * 100)

        return {
          id: scroll.id,
          title: scroll.title,
          completedDays,
          totalDays,
          percentage,
        }
      })
      .sort((a, b) => a.id - b.id)
  }

  const dailyReadingsData = useMemo(() => getDailyReadingsData(allReadings), [allReadings])
  const periodDistributionData = useMemo(() => getPeriodDistributionData(allReadings), [allReadings])
  const scrollProgressData = useMemo(
    () => getScrollProgressData(allScrollProgress, allReadings),
    [allScrollProgress, allReadings],
  )

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen transition-all duration-300 ease-in-out">
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white p-4 shadow-sm flex items-center sticky top-0 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/home")}
            className="mr-4"
            aria-label="Voltar para a tela inicial"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold">Análises de Leitura</h1>
        </div>

        <div className="p-4 space-y-6">
          <Card className="transition-all duration-200 hover:scale-[1.02]">
            <CardHeader>
              <CardTitle className="text-lg">Leituras por Dia</CardTitle>
            </CardHeader>
            <CardContent>
              {dailyReadingsData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={dailyReadingsData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <XAxis dataKey="date" tickFormatter={(value) => value.substring(0, 6)} />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                      formatter={(value: number, name: string, props: any) => [`${value} leituras`, props.payload.date]}
                    />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-500">Nenhuma leitura registrada ainda.</p>
              )}
            </CardContent>
          </Card>

          <Card className="transition-all duration-200 hover:scale-[1.02]">
            <CardHeader>
              <CardTitle className="text-lg">Leituras por Período do Dia</CardTitle>
            </CardHeader>
            <CardContent>
              {periodDistributionData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={periodDistributionData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#82ca9d"
                      label
                    >
                      {periodDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number, name: string) => [`${value} leituras`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-500">Nenhuma leitura registrada ainda.</p>
              )}
            </CardContent>
          </Card>

          <Card className="transition-all duration-200 hover:scale-[1.02]">
            <CardHeader>
              <CardTitle className="text-lg">Progresso por Pergaminho</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {scrollProgressData.length > 0 ? (
                scrollProgressData.map((scroll) => (
                  <div key={scroll.id} className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="font-medium">
                        Pergaminho {scroll.id}: {scroll.title}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${scroll.percentage}%` }}
                          ></div>
                        </div>
                        <span>
                          {scroll.completedDays}/{scroll.totalDays} dias ({scroll.percentage}%)
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">Nenhum progresso de pergaminho encontrado.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
