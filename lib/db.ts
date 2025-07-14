import Dexie, { type Table } from "dexie"

// Interfaces para os tipos de dados que serão armazenados
export interface UserSettings {
  id: string // 'settings'
  currentScrollId: number
  notificationSettings: {
    morning: string
    afternoon: string
    evening: string
  }
}

export interface ScrollProgress {
  scrollId: number
  completedDays: number
  lastReadingDate: string | null // YYYY-MM-DD
}

export interface ReadingEntry {
  id?: string // Composite key: `${scrollId}-${dateKey}-${period}`
  scrollId: number
  dateKey: string // YYYY-MM-DD
  period: "morning" | "afternoon" | "evening"
  timestamp: number
}

// Declaração do banco de dados
export class UCADB extends Dexie {
  // Renomeado de UMTYDB para UCADB
  userSettings!: Table<UserSettings>
  scrollProgress!: Table<ScrollProgress>
  readings!: Table<ReadingEntry>

  constructor() {
    super("ucaDatabase") // Renomeado de umtyDatabase para ucaDatabase
    this.version(1).stores({
      userSettings: "&id", // Primary key 'id', single entry
      scrollProgress: "&scrollId, completedDays, lastReadingDate", // Primary key 'scrollId'
      readings: "[scrollId+dateKey+period], scrollId, dateKey, period, timestamp", // Composite primary key for unique readings
    })
  }
}

export const db = new UCADB() // Renomeado de UMTYDB para UCADB
