// lib/app-utils.ts
import type { ReadingEntry } from "@/lib/db"

// Funções utilitárias de data e hora
export const formatDateToKey = (date: Date): string => {
  // Garante que a data seja formatada no fuso horário local
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const day = date.getDate().toString().padStart(2, "0")
  return `${year}-${month}-${day}` // YYYY-MM-DD
}

export const formatDateToDisplay = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }
  return date.toLocaleDateString("pt-BR", options)
}

// Modificar a função getPeriod para retornar strings em português
export const getPeriod = (hour: number): "morning" | "afternoon" | "evening" => {
  if (hour >= 4 && hour < 12) return "morning" // 04h00 - 11h59
  if (hour >= 12 && hour < 19) return "afternoon" // 12h00 - 18h59
  return "evening" // 19h00 - 03h59 (do dia seguinte)
}

export const getReadingDay = (timestamp: number): Date => {
  const date = new Date(timestamp)
  const hour = date.getHours()
  // Se for noite (19h00 - 03h59), e o horário for antes das 4h do dia atual,
  // significa que é a noite do dia anterior.
  if (hour >= 0 && hour < 4) {
    date.setDate(date.getDate() - 1)
  }
  date.setHours(0, 0, 0, 0) // Zera a hora para a chave do dia
  return date
}

// Funções para calcular dias completos e consecutivos (agora baseadas em ReadingEntry[] e não no objeto aninhado)
export const isDayCompleted = (dailyReadings: ReadingEntry[]): boolean => {
  const periods = dailyReadings.map((r) => r.period)
  return periods.includes("morning") && periods.includes("afternoon") && periods.includes("evening")
}

export const calculateCompletedDays = (allReadings: ReadingEntry[], scrollId: number): number => {
  const readingsForScroll = allReadings.filter((r) => r.scrollId === scrollId)
  const readingsByDate: { [date: string]: ReadingEntry[] } = {}
  readingsForScroll.forEach((r) => {
    if (!readingsByDate[r.dateKey]) {
      readingsByDate[r.dateKey] = []
    }
    readingsByDate[r.dateKey].push(r)
  })

  let count = 0
  for (const dateKey in readingsByDate) {
    if (isDayCompleted(readingsByDate[dateKey])) {
      count++
    }
  }
  return count
}

export const calculateConsecutiveDays = (allReadings: ReadingEntry[], scrollId: number): number => {
  const readingsForScroll = allReadings.filter((r) => r.scrollId === scrollId)
  const readingsByDate: { [date: string]: ReadingEntry[] } = {}
  readingsForScroll.forEach((r) => {
    if (!readingsByDate[r.dateKey]) {
      readingsByDate[r.dateKey] = []
    }
    readingsByDate[r.dateKey].push(r)
  })

  const sortedDates = Object.keys(readingsByDate)
    .filter((dateKey) => isDayCompleted(readingsByDate[dateKey]))
    .sort() // Sorts YYYY-MM-DD strings correctly

  if (sortedDates.length === 0) return 0

  let consecutiveCount = 0
  let lastDate: Date | null = null

  for (let i = sortedDates.length - 1; i >= 0; i--) {
    const currentDate = new Date(sortedDates[i])
    currentDate.setHours(0, 0, 0, 0) // Normalize to start of day

    if (lastDate === null) {
      // Check if the last completed day is today or yesterday
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const yesterday = new Date(today)
      yesterday.setDate(today.getDate() - 1)

      if (currentDate.getTime() === today.getTime() || currentDate.getTime() === yesterday.getTime()) {
        consecutiveCount = 1
        lastDate = currentDate
      } else {
        break // No recent consecutive days
      }
    } else {
      const prevDay = new Date(lastDate)
      prevDay.setDate(lastDate.getDate() - 1)
      if (currentDate.getTime() === prevDay.getTime()) {
        consecutiveCount++
        lastDate = currentDate
      } else {
        break // Streak broken
      }
    }
  }
  return consecutiveCount
}

// Função para gerar mensagens motivacionais
export const getMotivationalMessage = (completedDays: number, consecutiveDays: number, totalDays: number) => {
  if (completedDays === 0) {
    return {
      message: "Comece hoje sua jornada de transformação!",
      type: "start",
      color: "text-blue-600",
    }
  }

  if (completedDays >= totalDays) {
    return {
      message: "🎉 PARABÉNS! Você conquistou a Regra de Ouro dos 30 dias! Você é imparável!",
      type: "golden",
      color: "text-yellow-600",
    }
  }

  if (consecutiveDays >= 21) {
    return {
      message: "🔥 Incrível! 21 dias consecutivos! Você está criando um hábito poderoso!",
      type: "habit",
      color: "text-orange-600",
    }
  }

  if (consecutiveDays >= 14) {
    return {
      message: "💪 Duas semanas seguidas! Sua disciplina está se fortalecendo!",
      type: "strength",
      color: "text-purple-600",
    }
  }

  if (consecutiveDays >= 7) {
    return {
      message: "⭐ Uma semana completa! Você está no caminho certo!",
      type: "week",
      color: "text-green-600",
    }
  }

  if (consecutiveDays >= 3) {
    return {
      message: "🚀 Você está indo bem! Leu por " + consecutiveDays + " dias seguidos! Continue assim!",
      type: "progress",
      color: "text-green-600",
    }
  }

  if (completedDays >= 1) {
    return {
      message: "👏 Ótimo começo! Continue sua jornada de crescimento!",
      type: "beginning",
      color: "text-blue-600",
    }
  }

  return {
    message: "Comece hoje sua transformação!",
    type: "default",
    color: "text-gray-600",
  }
}
