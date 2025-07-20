"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Check, ArrowLeft, Volume2, VolumeX } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"

import { db } from "@/lib/db"
import { useLiveQuery } from "dexie-react-hooks"
import { staticScrolls } from "@/lib/scrolls"
import { formatDateToKey, getReadingDay, getPeriod, calculateCompletedDays, formatDateToDisplay } from "@/lib/app-utils"
import { useAndroidBackHandler } from "@/hooks/use-android-back-handler"

interface ReadingPageContentProps {
  scrollId: number
}

export default function ReadingPageContent({ scrollId }: ReadingPageContentProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  
  // Hook para tratar o botão voltar do Android
  useAndroidBackHandler()

  const displayScrollId = scrollId

  // Scroll para o topo quando o componente é montado ou o scrollId muda
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [displayScrollId]) // Re-executa se o scrollId mudar

  // Estes hooks agora são seguros, pois a página só será renderizada após o DbInitializer garantir que o DB está pronto.
  const userSettings = useLiveQuery(() => db.userSettings.get("settings"), [])
  const allScrollProgress = useLiveQuery(() => db.scrollProgress.toArray(), [])
  const allReadings = useLiveQuery(() => db.readings.toArray(), [])

  const currentScrollId = userSettings?.currentScrollId || 1
  const currentScrollData = staticScrolls.find((s) => s.id === displayScrollId) || staticScrolls[0]
  const currentUserScrollProgressForDisplay = allScrollProgress?.find((s) => s.scrollId === displayScrollId) || {
    scrollId: displayScrollId,
    completedDays: 0,
    lastReadingDate: null,
  }

  const isCurrentActiveScroll = displayScrollId === currentScrollId
  const hasCompleted30Days = currentUserScrollProgressForDisplay.completedDays >= 30

  const confirmReading = useCallback(async () => {
    const now = new Date()
    const readingTimestamp = now.getTime()
    const readingDay = getReadingDay(readingTimestamp)
    const readingDayKey = formatDateToKey(readingDay)
    const currentHour = now.getHours()
    const period = getPeriod(currentHour)

    try {
      // Criar um ID composto para a entrada de leitura
      const readingId = `${currentScrollId}-${readingDayKey}-${period}`

      // Adicionar ou atualizar a entrada de leitura
      await db.readings.put({
        id: readingId,
        scrollId: currentScrollId,
        dateKey: readingDayKey,
        period: period,
        timestamp: readingTimestamp,
      })

      // Recalcular completedDays e lastReadingDate para o scroll atual
      const updatedReadingsForScroll = await db.readings.where({ scrollId: currentScrollId }).toArray()
      const newCompletedDays = calculateCompletedDays(updatedReadingsForScroll, currentScrollId)
      const newLastReadingDate = readingDayKey

      await db.scrollProgress.update(currentScrollId, {
        completedDays: newCompletedDays,
        lastReadingDate: newLastReadingDate,
      })

      // Verificar se o pergaminho atual foi concluído (30 dias) e avançar para o próximo
      if (newCompletedDays >= 30 && currentScrollId < staticScrolls.length) {
        await db.userSettings.update("settings", { currentScrollId: currentScrollId + 1 })
        toast({
          title: `Pergaminho ${currentScrollId} Concluído!`,
          description: `Parabéns! Você completou 30 dias de leitura. Próximo: Pergaminho ${currentScrollId + 1}.`,
        })
      } else {
        toast({
          title: "Leitura Confirmada!",
          description: `Sua leitura da ${period === "morning" ? "manhã" : period === "afternoon" ? "tarde" : "noite"} foi registrada.`,
        })
      }

      // Voltar para a página inicial
      router.push("/home")
    } catch (error) {
      console.error("Erro ao confirmar leitura:", error)
      toast({
        title: "Erro",
        description: "Não foi possível confirmar a leitura. Tente novamente.",
        variant: "destructive",
      })
    }
  }, [currentScrollId, router, toast])

  const readingsForCurrentScroll = allReadings?.filter((r) => r.scrollId === currentScrollId) || []
  const todayKey = formatDateToKey(new Date())
  const todayReadings = readingsForCurrentScroll.filter((r) => r.dateKey === todayKey)
  const hasMorningReading = todayReadings.some((r) => r.period === "morning")
  const hasAfternoonReading = todayReadings.some((r) => r.period === "afternoon")
  const hasEveningReading = todayReadings.some((r) => r.period === "evening")
  const currentHour = new Date().getHours()
  const currentPeriod = getPeriod(currentHour)
  const hasCurrentPeriodReading = todayReadings.some((r) => r.period === currentPeriod)

  const completedProgress = (currentUserScrollProgressForDisplay.completedDays / 30) * 100

  if (!currentScrollData) {
    return <div>Pergaminho não encontrado</div>
  }

  const canConfirmReading = isCurrentActiveScroll && !hasCurrentPeriodReading && agreedToTerms

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.push("/home")} className="text-orange-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="text-sm text-orange-600 font-medium">
            Pergaminho {displayScrollId}
          </div>
        </div>

        {/* Scroll Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border border-orange-200">
          <div className="flex items-start gap-4 mb-4">
            <img
              src={currentScrollData.image}
              alt={currentScrollData.title}
              className="w-16 h-16 rounded-lg object-cover border-2 border-orange-200"
            />
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-800 mb-2">{currentScrollData.title}</h1>
              <p className="text-sm text-gray-600">{currentScrollData.preview}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progresso: {currentUserScrollProgressForDisplay.completedDays}/30 dias</span>
              <span>{Math.round(completedProgress)}%</span>
            </div>
            <Progress value={completedProgress} className="h-2" />
          </div>

          {/* Status Info */}
          <div className="flex flex-wrap gap-2 mb-4">
            {hasCompleted30Days && (
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                <Check className="w-4 h-4" />
                Concluído
              </div>
            )}
            {isCurrentActiveScroll && !hasCompleted30Days && (
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                📖 Pergaminho Atual
              </div>
            )}
            {!isCurrentActiveScroll && !hasCompleted30Days && (
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                🔒 Bloqueado
              </div>
            )}
          </div>

          {/* Reading Status Today */}
          {isCurrentActiveScroll && (
            <div className="bg-orange-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">Leituras de Hoje ({formatDateToDisplay(new Date())}):</h3>
              <div className="flex gap-2">
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${hasMorningReading ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {hasMorningReading ? <Check className="w-4 h-4" /> : "○"}
                  Manhã
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${hasAfternoonReading ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {hasAfternoonReading ? <Check className="w-4 h-4" /> : "○"}
                  Tarde
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${hasEveningReading ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {hasEveningReading ? <Check className="w-4 h-4" /> : "○"}
                  Noite
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reading Instructions */}
        {isCurrentActiveScroll && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border border-orange-200">
            <div className={`p-4 rounded-lg border-l-4 ${
              currentPeriod === "evening" 
                ? "bg-blue-50 border-blue-400" 
                : "bg-orange-50 border-orange-400"
            }`}>
              <div className="flex items-center gap-3">
                {currentPeriod === "evening" ? (
                  <Volume2 className="w-6 h-6 text-blue-600" />
                ) : (
                  <VolumeX className="w-6 h-6 text-orange-600" />
                )}
                <div>
                  <h3 className={`font-semibold ${
                    currentPeriod === "evening" ? "text-blue-800" : "text-orange-800"
                  }`}>
                    {currentPeriod === "evening" 
                      ? "🌙 Leitura da Noite - EM VOZ ALTA" 
                      : "🌅 Leitura Silenciosa"
                    }
                  </h3>
                  <p className={`text-sm mt-1 ${
                    currentPeriod === "evening" ? "text-blue-700" : "text-orange-700"
                  }`}>
                    {currentPeriod === "evening" 
                      ? "Para a leitura da noite, você deve ler o pergaminho EM VOZ ALTA. Isso ajuda a fixar melhor o conteúdo em sua mente."
                      : currentPeriod === "morning"
                        ? "Para a leitura da manhã, você deve ler o pergaminho EM SILÊNCIO, permitindo que as palavras se gravem em sua mente."
                        : "Para a leitura da tarde, você deve ler o pergaminho EM SILÊNCIO, absorvendo profundamente cada ensinamento."
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Text */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border border-orange-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Texto Completo</h2>
          <ScrollArea className="h-96">
            <div className="whitespace-pre-line text-gray-700 leading-relaxed">
              {currentScrollData.fullText}
            </div>
          </ScrollArea>
        </div>

        {/* Confirmation Section */}
        {isCurrentActiveScroll && !hasCurrentPeriodReading && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-orange-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirmar Leitura</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Declaro que li o texto completo do pergaminho pois quem faz as coisas pela metade é um FRACASSADO!
                </label>
              </div>

              <Button
                onClick={confirmReading}
                disabled={!canConfirmReading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Check className="w-4 h-4 mr-2" />
                Confirmar Leitura da {currentPeriod === "morning" ? "Manhã" : currentPeriod === "afternoon" ? "Tarde" : "Noite"}
              </Button>

              {hasCurrentPeriodReading && (
                <p className="text-sm text-green-600 text-center">
                  ✓ Você já confirmou a leitura da {currentPeriod === "morning" ? "manhã" : currentPeriod === "afternoon" ? "tarde" : "noite"} hoje
                </p>
              )}
            </div>
          </div>
        )}

        {!isCurrentActiveScroll && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-orange-200 text-center">
            <p className="text-gray-600">
              {displayScrollId < currentScrollId 
                ? "Este pergaminho já foi concluído." 
                : "Complete o pergaminho atual para desbloquear este."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
