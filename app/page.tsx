"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { db, type UserSettings } from "@/lib/db" // Import UserSettings type
import { staticScrolls } from "@/lib/scrolls"

export default function RootPage() {
  const router = useRouter()
  // settings: undefined = carregando, null = não encontrado, objeto = encontrado
  const [settings, setSettings] = useState<UserSettings | null | undefined>(undefined)
  const [isProcessingRedirect, setIsProcessingRedirect] = useState(false) // Para evitar múltiplos redirecionamentos

  // Efeito para buscar as configurações do usuário uma vez ao montar
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const currentSettings = await db.userSettings.get("settings")
        setSettings(currentSettings || null) // Atualiza o estado com o resultado (null ou objeto)
      } catch (error) {
        console.error("RootPage: Error fetching settings directly:", error)
        setSettings(null) // Em caso de erro, trata como se não houvesse configurações
      }
    }
    fetchSettings()
  }, []) // Executa apenas uma vez na montagem

  // Efeito para lidar com a inicialização e redirecionamento após as configurações serem carregadas
  useEffect(() => {
    if (settings === undefined || isProcessingRedirect) {
      return
    }

    const handleInitializationAndRedirect = async () => {
      setIsProcessingRedirect(true) // Define a flag para evitar reentrada

      try {
        if (settings === null) {
          // Configurações não encontradas, significa que é um novo começo ou após um reset.
          await db.userSettings.put({
            id: "settings",
            currentScrollId: 1,
            notificationSettings: {
              morning: "07h59",
              afternoon: "11h59",
              evening: "20h59",
            },
          })

          await db.transaction("rw", db.scrollProgress, async () => {
            for (const scroll of staticScrolls) {
              await db.scrollProgress.put({
                scrollId: scroll.id,
                completedDays: 0,
                lastReadingDate: null,
              })
            }
          })
          router.replace("/launch") // Redireciona para a tela de lançamento após a inicialização
        } else {
          // Configurações encontradas, prossegue para a home
          router.replace("/home")
        }
      } catch (error) {
        console.error("RootPage: Error during DB initialization/redirection:", error)
        setIsProcessingRedirect(false) // Reseta a flag se ocorrer um erro, permitindo nova tentativa ou exibição de erro
      }
    }

    handleInitializationAndRedirect()
  }, [settings, router, isProcessingRedirect]) // Depende de settings, router e da nova flag

  // Este componente será renderizado enquanto as configurações estiverem sendo carregadas
  if (settings === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">Preparando aplicativo...</p>
      </div>
    )
  }

  // Se as configurações foram carregadas e o redirecionamento foi iniciado,
  // este componente não precisa renderizar nada, pois a navegação ocorrerá.
  return null
}
