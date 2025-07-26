import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { DbInitializer } from "@/components/db-initializer"
import { PWAInstaller } from "@/components/pwa-installer"
import { SecurityProvider } from "@/components/security-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import { AgeVerificationWrapper } from "@/components/age-verification"
import { OrientationLock } from "@/components/orientation-lock"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AgilMove Pergaminhos UCA",
  description: "Aplicativo para acompanhar sua jornada de leitura dos pergaminhos",
  generator: 'Next.js',
  applicationName: 'UCA - Pergaminhos',
  referrer: 'origin-when-cross-origin',
  keywords: ['UCA', 'pergaminhos', 'leitura', 'agilmove', 'desenvolvimento pessoal'],
  authors: [{ name: 'AgilMove' }],
  creator: 'Marcus Mandara',
  publisher: 'AgilMove',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://agilmove.com.br/uca-app/'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AgilMove Pergaminhos UCA',
    description: 'Aplicativo para acompanhar sua jornada de leitura dos pergaminhos',
    url: 'https://agilmove.com.br/uca-app/',
    siteName: 'UCA - Pergaminhos',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'AgilMove UCA Logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'AgilMove Pergaminhos UCA',
    description: 'Aplicativo para acompanhar sua jornada de leitura dos pergaminhos',
    images: ['/icon-512x512.png'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-touch-icon.png',
    },
  },
  appleWebApp: {
    title: 'AgilMove Pergaminhos UCA',
    statusBarStyle: 'default',
    capable: true,
    startupImage: [
      {
        url: '/icon-512x512.png',
        media: '(device-width: 768px) and (device-height: 1024px)',
      },
    ],
  },
  verification: {
    google: undefined,
    yandex: undefined,
    yahoo: undefined,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no, viewport-fit=cover" />
        <meta name="screen-orientation" content="portrait" />
        <meta name="orientation" content="portrait" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AgilMove UCA" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="background-color" content="#ffffff" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; media-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="mask-icon" href="/icon-512x512.png" color="#3b82f6" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} portrait-lock`}>
        <OrientationLock>
          <ErrorBoundary>
            <AgeVerificationWrapper>
              <SecurityProvider>
                <PWAInstaller />
                <DbInitializer>{children}</DbInitializer>
                <Toaster />
              </SecurityProvider>
            </AgeVerificationWrapper>
          </ErrorBoundary>
        </OrientationLock>
      </body>
    </html>
  )
}
