import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { DbInitializer } from "@/components/db-initializer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "UCA App",
  description: "União, Comprometimento, Ação",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <DbInitializer>{children}</DbInitializer>
        <Toaster />
      </body>
    </html>
  )
}
