"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { db } from "@/lib/db"
import { staticScrolls } from "@/lib/scrolls"
import { Toaster } from "@/components/ui/toaster"
import { useRouter, usePathname } from "next/navigation"

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const initializeDb = async () => {
      try {
        // Check if settings exist, if not, initialize the DB
        const settings = await db.userSettings.get("settings")
        if (!settings) {
          // Upsert da entry de configurações
          await db.userSettings.put({
            id: "settings",
            currentScrollId: 1,
            notificationSettings: {
              morning: "07h59",
              afternoon: "11h59",
              evening: "20h59",
            },
          })

          // Upsert do progresso de cada pergaminho
          await db.transaction("rw", db.scrollProgress, async () => {
            for (const scroll of staticScrolls) {
              await db.scrollProgress.put({
                scrollId: scroll.id,
                completedDays: 0,
                lastReadingDate: null,
              })
            }
          })
          console.log("Database initialized with default settings and scroll progress.")
        } else {
          console.log("Database already initialized.")
        }
      } catch (error) {
        console.error("Error initializing database:", error)
      } finally {
        setIsLoading(false)
        // Redirect to launch if on root and DB is ready
        if (pathname === "/") {
          router.replace("/launch")
        }
      }
    }
    initializeDb()
  }, [router, pathname])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">Carregando...</p>
      </div>
    )
  }

  return (
    <>
      {children}
      <Toaster />
    </>
  )
}
