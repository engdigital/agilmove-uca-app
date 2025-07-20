"use client"

import { useCallback, useMemo } from "react" // Importar useMemo
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Award, RotateCcw, Flame, BookOpen, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

import { db } from "@/lib/db"
import { useLiveQuery } from "dexie-react-hooks"
import { staticScrolls } from "@/lib/scrolls"
import { formatDateToDisplay, calculateConsecutiveDays, getMotivationalMessage } from "@/lib/app-utils"

export default function HomePage() {
  const router = useRouter()
  const { toast } = useToast()

  const userSettings = useLiveQuery(() => db.userSettings.get("settings"), [])
  const allScrollProgress = useLiveQuery(() => db.scrollProgress.toArray(), [])
  const allReadings = useLiveQuery(() => db.readings.toArray(), [])

  const handleResetApp = useCallback(async () => {
    if (confirm("Tem certeza que deseja recomeçar? Todos os seus registros de leitura serão apagados.")) {
      try {
        await db.readings.clear()
        await db.scrollProgress.clear()
        await db.userSettings.clear()

        await db.userSettings.put({
          id: "settings",
          currentScrollId: 1,
          notificationSettings: {
            morning: "07h59",
            afternoon: "11h59",
            evening: "20h59",
          },
        })
        for (const scroll of staticScrolls) {
          await db.scrollProgress.put({
            scrollId: scroll.id,
            completedDays: 0,
            lastReadingDate: null,
          })
        }

        router.push("/home")
        toast({
          title: "Aplicativo Reiniciado!",
          description: "Todos os seus registros foram apagados. Comece sua jornada novamente!",
        })
      } catch (error) {
        console.error("Erro ao reiniciar aplicativo:", error)
        toast({
          title: "Erro ao Reiniciar",
          description: "Não foi possível reiniciar o aplicativo.",
          variant: "destructive",
        })
      }
    }
  }, [toast, router])

  // Memoize derived states
  const currentScrollId = userSettings?.currentScrollId || 1

  const currentUserScrollProgress = useMemo(() => {
    return (
      allScrollProgress?.find((s) => s.scrollId === currentScrollId) || {
        scrollId: currentScrollId,
        completedDays: 0,
        lastReadingDate: null,
      }
    )
  }, [allScrollProgress, currentScrollId])

  const currentScrollCompletedDays = currentUserScrollProgress.completedDays
  const currentScrollTotalDays = 30 // Fixed for all scrolls
  const currentScrollRemainingDays = currentScrollTotalDays - currentScrollCompletedDays
  const currentScrollProgress = Math.round((currentScrollCompletedDays / currentScrollTotalDays) * 100)

  const currentScrollReadings = useMemo(() => {
    return allReadings?.filter((r) => r.scrollId === currentScrollId) || []
  }, [allReadings, currentScrollId])

  const currentScrollConsecutiveDays = useMemo(() => {
    return calculateConsecutiveDays(currentScrollReadings, currentScrollId)
  }, [currentScrollReadings, currentScrollId])

  const motivationalData = useMemo(() => {
    return getMotivationalMessage(currentScrollCompletedDays, currentScrollConsecutiveDays, currentScrollTotalDays)
  }, [currentScrollCompletedDays, currentScrollConsecutiveDays, currentScrollTotalDays])

  const lastReadingDisplay = useMemo(() => {
    return currentUserScrollProgress?.lastReadingDate
      ? formatDateToDisplay(
          new Date(
            Number.parseInt(currentUserScrollProgress.lastReadingDate.substring(0, 4)), // Ano
            Number.parseInt(currentUserScrollProgress.lastReadingDate.substring(5, 7)) - 1, // Mês (0-indexado)
            Number.parseInt(currentUserScrollProgress.lastReadingDate.substring(8, 10)), // Dia
          ),
        )
      : "não iniciada"
  }, [currentUserScrollProgress?.lastReadingDate])

  const sortedScrolls = useMemo(() => {
    return [...staticScrolls].sort((a, b) => a.id - b.id)
  }, []) // staticScrolls is constant

  const allScrollsCompleted = useMemo(() => {
    return allScrollProgress?.every((s) => s.completedDays >= 30) || false
  }, [allScrollProgress])

  const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || "1.0.3"

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen transition-all duration-300 ease-in-out">
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white p-6 shadow-sm">
          <h1 className="text-xl font-bold mb-4">Você está no Pergaminho {currentScrollId}</h1>

          <Card
            className="mb-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
            onClick={() => router.push("/details")}
          >
            <CardContent className="p-4">
              <p className="text-gray-600 mb-4 text-center">Faltam {currentScrollRemainingDays} dias de leitura</p>
              <div className="flex items-center justify-center gap-6">
                <div className="flex flex-col items-center">
                  <span className="text-5xl font-bold text-blue-500">{currentScrollProgress}%</span>
                  <span className="text-sm text-gray-500">concluído</span>
                </div>

                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="transparent"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-blue-500"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${currentScrollProgress}, 100`}
                      strokeLinecap="round"
                      fill="transparent"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                </div>
              </div>
              <div className={`text-sm ${motivationalData.color} font-medium text-center p-2 mt-4 rounded-lg`}>
                {motivationalData.message}
              </div>
              <p className="text-sm text-gray-500 text-center mt-2">clique para mais detalhes</p>
            </CardContent>
          </Card>

          <Card className="mb-4 p-4 text-center bg-white shadow-sm">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className="w-6 h-6 text-orange-500" />
              <h2 className="text-xl font-bold">Sua Sequência de Leitura</h2>
            </div>
            <p className="text-5xl font-bold text-orange-500">{currentScrollConsecutiveDays}</p>
            <p className="text-lg text-gray-600">dias consecutivos!</p>
            {currentScrollConsecutiveDays === 0 && (
              <p className="text-sm text-gray-500 mt-2">Comece a ler hoje para iniciar sua sequência!</p>
            )}
          </Card>

          {/* Link para o guia de leitura */}
          <Card 
            className="mb-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02] bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
            onClick={() => router.push("/reading-guide")}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-blue-900 mb-1">Entenda como ler os pergaminhos</h3>
                  <p className="text-sm text-blue-600">
                    Aprenda as regras de confirmação, contagem de dias e como ler corretamente
                  </p>
                </div>
                <ArrowLeft className="w-5 h-5 text-blue-500 transform rotate-180" />
              </div>
            </CardContent>
          </Card>

        </div>

        <div className="p-4 space-y-4">
          {sortedScrolls.map((scroll) => {
            const scrollUserData = allScrollProgress?.find((s) => s.scrollId === scroll.id) || {
              scrollId: scroll.id,
              completedDays: 0,
              lastReadingDate: null,
            }
            const lastReadingDisplayForScroll = scrollUserData?.lastReadingDate
              ? formatDateToDisplay(
                  new Date(
                    Number.parseInt(scrollUserData.lastReadingDate.substring(0, 4)),
                    Number.parseInt(scrollUserData.lastReadingDate.substring(5, 7)) - 1,
                    Number.parseInt(scrollUserData.lastReadingDate.substring(8, 10)),
                  ),
                )
              : "não iniciada"
            const scrollCompletedDays = scrollUserData?.completedDays || 0
            const scrollProgressValue = (scrollCompletedDays / 30) * 100
            const isCompleted = scrollCompletedDays >= 30

            return (
              <Card key={scroll.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <Image
                      src={scroll.image || "/placeholder.svg"}
                      alt={scroll.title}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">Pergaminho {scroll.id}</p>
                      <h3 className="font-bold text-lg mb-2">{scroll.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-3">{scroll.preview}</p>
                      <p className="text-sm text-gray-500">
                        Última leitura: <span className="italic">{lastReadingDisplayForScroll}</span>
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Progress value={scrollProgressValue} className="flex-1 h-2" />
                        <span className="text-xs text-gray-600">{scrollCompletedDays}/30 dias</span>
                        {isCompleted && <Award className="w-4 h-4 text-yellow-500" aria-label="Pergaminho Concluído" />}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => {
                        router.push(`/reading/${scroll.id}`)
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Ler Pergaminho
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
        {allScrollsCompleted && (
          <div className="p-4 text-center">
            <Button onClick={handleResetApp} className="bg-purple-600 hover:bg-purple-700 text-white">
              <RotateCcw className="w-4 h-4 mr-2" />
              Recomeçar Leitura
            </Button>
          </div>
        )}
        <div className="p-4 text-center text-gray-500 text-sm space-y-1 pb-10">
          <p>Versão do App: {appVersion}</p>
          <Link href="/privacy-policy" className="text-gray-500 hover:underline">
            Política de Privacidade
          </Link>
        </div>
      </div>
    </div>
  )
}
