import Dexie, { type Table } from "dexie"
import type { SecureTimestamp, TimestampValidation } from "./secure-time"

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
  // Campos de segurança
  sequence?: number
  hash?: string
  previousHash?: string
  secureTimestamp?: SecureTimestamp
  validation?: TimestampValidation
  trustScore?: number
  deviceInfo?: string
  suspicious?: boolean
}

// Declaração do banco de dados
export class UCADB extends Dexie {
  // Renomeado de UMTYDB para UCADB
  userSettings!: Table<UserSettings>
  scrollProgress!: Table<ScrollProgress>
  readings!: Table<ReadingEntry>

  constructor() {
    super("ucaDatabase") // Renomeado de umtyDatabase para ucaDatabase
    this.version(2).stores({
      userSettings: "&id", // Primary key 'id', single entry
      scrollProgress: "&scrollId, completedDays, lastReadingDate", // Primary key 'scrollId'
      readings: "[scrollId+dateKey+period], scrollId, dateKey, period, timestamp, sequence, suspicious", // Composite primary key for unique readings
    })
    
    // Migration para versão 2 - adicionar campos de segurança
    this.version(2).upgrade(trans => {
      // Os novos campos serão automaticamente adicionados como undefined
      // Não precisamos fazer nada especial aqui
      console.log('Atualizando banco de dados para versão 2 com campos de segurança');
    });
  }
}

export const db = new UCADB() // Renomeado de UMTYDB para UCADB
