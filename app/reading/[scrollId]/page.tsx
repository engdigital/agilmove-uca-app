"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Check, ArrowLeft } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"

import { db } from "@/lib/db"
import { useLiveQuery } from "dexie-react-hooks"
import { staticScrolls } from "@/lib/scrolls"
import { formatDateToKey, getReadingDay, getPeriod, calculateCompletedDays, formatDateToDisplay } from "@/lib/app-utils"

interface ReadingPageProps {
  params: {
    scrollId: string
  }
}

export default function ReadingPage({ params }: ReadingPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const displayScrollId = Number(params.scrollId)

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
          description: `Sua leitura da ${
            period === "morning" ? "manhã" : period === "afternoon" ? "tarde" : "noite"
          } foi registrada para o dia ${formatDateToDisplay(readingDay)}.`,
        })
      }
    } catch (error) {
      console.error("Erro ao confirmar leitura:", error)
      toast({
        title: "Erro ao Salvar Leitura",
        description: "Não foi possível registrar sua leitura. Tente novamente.",
        variant: "destructive",
      })
    }

    setAgreedToTerms(false) // Reset toggle after confirmation
    router.push("/home") // Go back to home after confirming
    window.scrollTo(0, 0) // Scroll to the top of the page after redirect
  }, [userSettings, toast, currentScrollId, router])

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen transition-all duration-300 ease-in-out">
      <div className="min-h-screen bg-white">
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
          <h1 className="text-lg font-bold">Pergaminho {currentScrollData.id}</h1>
          <div className="ml-auto">
            <Progress value={(currentUserScrollProgressForDisplay.completedDays / 30) * 100} className="w-20" />
          </div>
        </div>

        <div className="p-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">{currentScrollData.title}</h2>

          <div className="h-96 overflow-hidden">
            <ScrollArea className="h-full touch-scroll">
              <div className="prose prose-lg max-w-none space-y-4 text-gray-800 leading-relaxed pr-4">
                {currentScrollData.fullText.split("\n\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4">
            {isCurrentActiveScroll && !hasCompleted30Days && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(!!checked)}
                  aria-describedby="terms-description"
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Declaro que li o texto por completo pois, quem faz as coisas pela metade, é um fracassado!
                </label>
                <span id="terms-description" className="sr-only">
                  Marque esta caixa para confirmar que você leu o texto por completo.
                </span>
              </div>
            )}

            <Button
              onClick={confirmReading}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg"
              disabled={!isCurrentActiveScroll || !agreedToTerms || hasCompleted30Days}
            >
              <Check className="w-5 h-5 mr-2" />
              Confirmar leitura
            </Button>
            {!isCurrentActiveScroll && (
              <p className="text-sm text-red-500" aria-live="polite">
                Você só pode marcar como lido o Pergaminho {currentScrollId}.
              </p>
            )}
            {hasCompleted30Days && (
              <p className="text-sm text-green-600" aria-live="polite">
                Você já completou 30 dias de leitura para este pergaminho!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
