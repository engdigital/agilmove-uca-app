"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { db } from "@/lib/db"

export function DbInitializer({ children }: { children: React.ReactNode }) {
  const [isDbOpen, setIsDbOpen] = useState(false)

  useEffect(() => {
    const openDb = async () => {
      try {
        // Tenta abrir o banco de dados. Dexie.js lida com a criação se não existir.
        await db.open()
        setIsDbOpen(true)

        // Adiciona um teste direto para acessibilidade da tabela userSettings
        await db.userSettings.get("settings")
      } catch (error) {
        console.error("Error opening database or accessing table:", error)
        // Em caso de erro, você pode querer mostrar uma mensagem de erro mais específica
        // ou tentar novamente, dependendo da estratégia de tratamento de erros.
      }
    }

    openDb()

    // Limpeza: fechar o banco de dados quando o componente for desmontado
    return () => {
      if (db.isOpen()) {
        db.close()
        // console.log("Database closed.") // Removido conforme solicitado
      }
    }
  }, []) // Executa apenas uma vez na montagem

  if (!isDbOpen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">Carregando banco de dados...</p>
      </div>
    )
  }

  return <>{children}</>
}
