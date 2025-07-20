"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Link from "next/link" // Importar Link
import { useAndroidBackHandler } from "@/hooks/use-android-back-handler"

export default function LaunchPage() {
  const router = useRouter()
  
  // Hook para tratar o botão voltar do Android
  useAndroidBackHandler()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-purple-700 flex flex-col text-white">
      {/* Imagem da equipe na parte superior */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <Image
            src="/images/team-photo.png"
            alt="Team UCA"
            width={400}
            height={300}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Conteúdo textual na parte inferior */}
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold mb-2">UNIÃO</h1>
        <h1 className="text-3xl font-bold mb-2">COMPROMETIMENTO</h1>
        <h1 className="text-3xl font-bold mb-6">AÇÃO</h1>

        <p className="text-lg mb-8 px-4 leading-relaxed">
          O app que mantém as águias que fizeram o treinamento DL no caminho de evolução
        </p>

        <Button
          onClick={() => router.push("/home")}
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg rounded-full w-full max-w-xs mx-auto font-semibold"
        >
          Eu conseguirei!
        </Button>

        <div className="mt-6 text-sm">
          <Link href="/privacy-policy" className="text-white hover:underline">
            Política de Privacidade
          </Link>
        </div>
      </div>
    </div>
  )
}
