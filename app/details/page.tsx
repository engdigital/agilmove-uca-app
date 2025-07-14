"use client"

import { useState, useEffect, useCallback, useMemo } from "react" // Importar useMemo
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Bell, ArrowLeft, Check, X, Sun, Moon, AlertTriangle } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

import { db, type ReadingEntry, type UserSettings } from "@/lib/db"
import { useLiveQuery } from "dexie-react-hooks"
import { staticScrolls } from "@/lib/scrolls"
import { formatDateToDisplay, isDayCompleted, calculateConsecutiveDays, getMotivationalMessage } from "@/lib/app-utils"

// Constante para controlar a visibilidade da aba de notificações
const ENABLE_NOTIFICATIONS = false // Mude para 'true' para reativar a aba de notificações

// Função auxiliar para converter VAPID public key para Uint8Array
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export default function DetailsPage() {
  const router = useRouter()
  const { toast } = useToast()

  const userSettings = useLiveQuery(() => db.userSettings.get("settings"), [])
  const allScrollProgress = useLiveQuery(() => db.scrollProgress.toArray(), [])
  const allReadings = useLiveQuery(() => db.readings.toArray(), [])

  const currentScrollId = userSettings?.currentScrollId || 1
  const initialNotificationSettings = userSettings?.notificationSettings || {
    morning: "07h59",
    afternoon: "11h59",
    evening: "20h59",
  }
  const [currentNotificationSettings, setCurrentNotificationSettings] = useState(initialNotificationSettings)

  useEffect(() => {
    setCurrentNotificationSettings(initialNotificationSettings)
  }, [initialNotificationSettings])

  // Memoize derived states
  const currentScrollDetails = useMemo(() => {
    return staticScrolls.find((s) => s.id === currentScrollId)
  }, [currentScrollId])

  const currentUserScrollProgressData = useMemo(() => {
    return (
      allScrollProgress?.find((s) => s.scrollId === currentScrollId) || {
        scrollId: currentScrollId,
        completedDays: 0,
        lastReadingDate: null,
      }
    )
  }, [allScrollProgress, currentScrollId])

  const readingsForCurrentScroll = useMemo(() => {
    return allReadings?.filter((r) => r.scrollId === currentScrollId) || []
  }, [allReadings, currentScrollId])

  const readingsByDate = useMemo(() => {
    const result: { [date: string]: ReadingEntry[] } = {}
    readingsForCurrentScroll.forEach((r) => {
      if (!result[r.dateKey]) {
        result[r.dateKey] = []
      }
      result[r.dateKey].push(r)
    })
    return result
  }, [readingsForCurrentScroll])

  const calendarEntries = useMemo(() => {
    return Object.keys(readingsByDate)
      .map((dateKey) => {
        const dailyReadings = readingsByDate[dateKey]
        const [entryYear, entryMonth, entryDay] = dateKey.split("-").map(Number)
        const date = new Date(entryYear, entryMonth - 1, entryDay)
        const now = new Date()
        const entryDate = new Date(entryYear, entryMonth - 1, entryDay)

        const allPeriods: ("morning" | "afternoon" | "evening")[] = ["morning", "afternoon", "evening"]
        const periodStatuses: {
          periodName: string
          status: "completed" | "missed" | "attention"
          time?: string
        }[] = []

        dailyReadings.sort((a, b) => a.timestamp - b.timestamp)

        allPeriods.forEach((period) => {
          const reading = dailyReadings.find((r) => r.period === period)
          const periodDisplayName = period === "morning" ? "manhã" : period === "afternoon" ? "tarde" : "noite"

          if (reading) {
            periodStatuses.push({
              periodName: periodDisplayName,
              status: "completed",
              time: new Date(reading.timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
            })
          } else {
            let periodStartTime: Date
            let periodEndTime: Date

            if (period === "morning") {
              periodStartTime = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate(), 4, 0, 0)
              periodEndTime = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate(), 12, 0, 0)
            } else if (period === "afternoon") {
              periodStartTime = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate(), 12, 0, 0)
              periodEndTime = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate(), 19, 0, 0)
            } else {
              periodStartTime = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate(), 19, 0, 0)
              periodEndTime = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate() + 1, 4, 0, 0)
            }

            const nowTime = now.getTime()
            const periodStartTimeMs = periodStartTime.getTime()
            const periodEndTimeMs = periodEndTime.getTime()

            const todayKey = formatDateToDisplay(now)
            const isToday = formatDateToDisplay(entryDate) === todayKey

            if (isToday && nowTime >= periodStartTimeMs && nowTime < periodEndTimeMs) {
              periodStatuses.push({
                periodName: periodDisplayName,
                status: "attention",
              })
            } else if (nowTime >= periodEndTimeMs || !isToday) {
              periodStatuses.push({
                periodName: periodDisplayName,
                status: "missed",
              })
            } else {
              periodStatuses.push({
                periodName: periodDisplayName,
                status: "attention",
              })
            }
          }
        })

        return {
          date: formatDateToDisplay(date),
          dateKey: dateKey,
          status: isDayCompleted(dailyReadings) ? "completed" : "partial",
          periodStatuses: periodStatuses,
          bonus: isDayCompleted(dailyReadings),
        }
      })
      .filter((day) =>
        day.periodStatuses.some(
          (ps) => ps.status === "completed" || ps.status === "attention" || ps.status === "missed",
        ),
      )
      .sort((a, b) => new Date(b.dateKey).getTime() - new Date(a.dateKey).getTime())
  }, [readingsByDate])

  const currentScrollCompletedDays = currentUserScrollProgressData.completedDays
  const currentScrollConsecutiveDays = useMemo(() => {
    return calculateConsecutiveDays(readingsForCurrentScroll, currentScrollId)
  }, [readingsForCurrentScroll, currentScrollId])

  const motivationalData = useMemo(() => {
    return getMotivationalMessage(currentScrollCompletedDays, currentScrollConsecutiveDays, 30)
  }, [currentScrollCompletedDays, currentScrollConsecutiveDays])

  const handleNotificationSave = useCallback(
    async (newSettings: UserSettings["notificationSettings"]) => {
      try {
        await db.userSettings.update("settings", {
          notificationSettings: newSettings,
        })
        toast({
          title: "Configurações Salvas!",
          description: "Suas preferências de notificação foram atualizadas.",
        })
      } catch (error) {
        console.error("Erro ao salvar notificações:", error)
        toast({
          title: "Erro ao Salvar",
          description: "Não foi possível salvar as configurações de notificação.",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  const handleEnablePushNotifications = useCallback(async () => {
    if (!("serviceWorker" in navigator)) {
      toast({
        title: "Notificações não suportadas",
        description: "Seu navegador não suporta Service Workers.",
        variant: "destructive",
      })
      return
    }

    if (!("PushManager" in window)) {
      toast({
        title: "Notificações Push não suportadas",
        description: "Seu navegador não suporta Notificações Push.",
        variant: "destructive",
      })
      return
    }

    try {
      const registration = await navigator.serviceWorker.register("/service-worker.js")
      console.log("Service Worker registrado:", registration)

      const permission = await Notification.requestPermission()
      if (permission !== "granted") {
        toast({
          title: "Permissão Negada",
          description: "Você precisa permitir as notificações para recebê-las.",
          variant: "destructive",
        })
        return
      }

      const VAPID_PUBLIC_KEY = "YOUR_VAPID_PUBLIC_KEY"
      const convertedVapidKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY)

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      })

      console.log("Assinatura Push:", JSON.stringify(subscription))

      toast({
        title: "Notificações Ativadas!",
        description: "Você receberá lembretes de leitura. (Assinatura enviada para o console)",
      })
    } catch (error) {
      console.error("Erro ao ativar notificações push:", error)
      toast({
        title: "Erro ao Ativar Notificações",
        description: "Não foi possível ativar as notificações push. Verifique o console.",
        variant: "destructive",
      })
    }
  }, [toast])

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
          <h1 className="text-xl font-bold">Detalhes</h1>
        </div>

        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white">
            <TabsTrigger
              value="calendar"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
            >
              Calendário
            </TabsTrigger>
            {ENABLE_NOTIFICATIONS && (
              <TabsTrigger
                value="notifications"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
              >
                Notificações
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="calendar" className="p-4 space-y-4">
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Image
                    src={currentScrollDetails?.image || "/placeholder.svg"}
                    alt={`Pergaminho ${currentScrollDetails?.id}`}
                    width={50}
                    height={50}
                    className="rounded"
                  />
                  <h3 className="font-bold">Pergaminho {currentScrollDetails?.id}</h3>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total: {currentScrollCompletedDays} dias</p>
                </div>
              </div>

              <div className={`text-sm ${motivationalData.color} font-medium text-center p-2 bg-gray-50 rounded-lg`}>
                {motivationalData.message}
                {currentScrollConsecutiveDays > 0 && (
                  <p className="text-xs mt-1">({currentScrollConsecutiveDays} dias consecutivos)</p>
                )}
              </div>
            </div>

            {calendarEntries.length > 0 ? (
              calendarEntries.map((day, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{day.date}</span>
                      </div>
                      {day.bonus && <Badge className="bg-green-500 text-white">+ 1 dia</Badge>}
                      {day.status === "partial" && (
                        <Badge variant="outline" className="text-orange-500 border-orange-500">
                          0 dias
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-4">
                      {day.periodStatuses.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          {item.status === "completed" ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : item.status === "missed" ? (
                            <X className="w-4 h-4 text-red-500" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          )}
                          <span
                            className={`text-sm flex items-center gap-1 ${item.status === "missed" ? "text-red-500" : item.status === "attention" ? "text-yellow-600" : "text-green-600"}`}
                          >
                            {item.time || item.periodName}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-500 mt-8">Nenhuma leitura registrada para este pergaminho ainda.</p>
            )}
          </TabsContent>

          {ENABLE_NOTIFICATIONS && (
            <TabsContent value="notifications" className="p-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Bell className="w-5 h-5" />
                    <div>
                      <h3 className="font-bold">Notificações</h3>
                      <p className="text-sm text-gray-600">
                        Defina os horários que o APP irá te lembrar de fazer a leitura do pergaminho
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Sun className="w-5 h-5 text-orange-500" />
                      <span className="font-medium w-16">Manhã</span>
                      <div className="flex gap-2">
                        {["07h59", "08h59", "09h59"].map((time) => (
                          <Button
                            key={time}
                            variant={currentNotificationSettings.morning === time ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              setCurrentNotificationSettings((prev) => ({ ...prev, morning: time }))
                            }}
                            className={currentNotificationSettings.morning === time ? "bg-blue-500" : ""}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Sun className="w-5 h-5 text-yellow-500" />
                      <span className="font-medium w-16">Tarde</span>
                      <div className="flex gap-2">
                        {["11h59", "12h59", "13h59"].map((time) => (
                          <Button
                            key={time}
                            variant={currentNotificationSettings.afternoon === time ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              setCurrentNotificationSettings((prev) => ({ ...prev, afternoon: time }))
                            }}
                            className={currentNotificationSettings.afternoon === time ? "bg-blue-500" : ""}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Moon className="w-5 h-5 text-blue-600" />
                      <span className="font-medium w-16">Noite</span>
                      <div className="flex gap-2">
                        {["20h59", "21h59", "22h59"].map((time) => (
                          <Button
                            key={time}
                            variant={currentNotificationSettings.evening === time ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              setCurrentNotificationSettings((prev) => ({ ...prev, evening: time }))
                            }}
                            className={currentNotificationSettings.evening === time ? "bg-blue-500" : ""}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleNotificationSave(currentNotificationSettings)}
                    className="w-full mt-8 bg-green-500 hover:bg-green-600"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Salvar Horários
                  </Button>

                  <Button onClick={handleEnablePushNotifications} className="w-full mt-4 bg-blue-500 hover:bg-blue-600">
                    <Bell className="w-4 h-4 mr-2" />
                    Ativar Notificações Push
                  </Button>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    (Um backend é necessário para enviar notificações reais. Esta função apenas solicita permissão e
                    registra o Service Worker.)
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}
