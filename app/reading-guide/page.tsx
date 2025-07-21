"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Clock, Calendar, CheckCircle, BookOpen, Target, Zap, Volume2, VolumeX } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAndroidBackHandler } from "@/hooks/use-android-back-handler"

export default function ReadingGuidePage() {
  const router = useRouter()
  
  // Hook para tratar o botão voltar do Android
  useAndroidBackHandler()

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <div className="min-h-screen bg-gray-50 pt-10 pb-10">
        {/* Header */}
        <div className="bg-white p-4 shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/home")}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold">Como Ler os Pergaminhos</h1>
              <p className="text-sm text-gray-600">Regras e orientações</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Seção: Períodos de Leitura */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Períodos de Confirmação de Leitura
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 text-sm mb-4">
                O app considera uma confirmação de leitura válida baseada no horário em que você confirma:
              </p>
              
              <div className="space-y-3">
                <div className="bg-orange-50 p-3 rounded-lg border-l-4 border-orange-400">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                    <span className="font-medium text-orange-700">Manhã</span>
                  </div>
                  <p className="text-sm text-orange-600">
                    Das <strong>04h00 às 11h59</strong>
                  </p>
                  <p className="text-xs text-orange-500 mt-1">
                    Qualquer confirmação neste horário será registrada como "leitura da manhã"
                  </p>
                </div>

                <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <span className="font-medium text-yellow-700">Tarde</span>
                  </div>
                  <p className="text-sm text-yellow-600">
                    Das <strong>12h00 às 18h59</strong>
                  </p>
                  <p className="text-xs text-yellow-500 mt-1">
                    Qualquer confirmação neste horário será registrada como "leitura da tarde"
                  </p>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span className="font-medium text-blue-700">Noite</span>
                  </div>
                  <p className="text-sm text-blue-600">
                    Das <strong>19h00 às 03h59</strong> (do dia seguinte)
                  </p>
                  <p className="text-xs text-blue-500 mt-1">
                    Qualquer confirmação neste horário será registrada como "leitura da noite"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seção: Regras de Contagem de Dias */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-500" />
                Regras de Contagem de Dias
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-700">Dia Completo</span>
                </div>
                <p className="text-sm text-green-600 mb-2">
                  Um dia só é considerado <strong>completo</strong> quando você confirma a leitura nos 3 períodos:
                </p>
                <ul className="text-xs text-green-600 space-y-1 ml-4">
                  <li>✓ Manhã (04h00 - 11h59)</li>
                  <li>✓ Tarde (12h00 - 18h59)</li>
                  <li>✓ Noite (19h00 - 03h59)</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-purple-700">Dias Consecutivos</span>
                </div>
                <p className="text-sm text-purple-600">
                  A sequência de dias consecutivos só conta <strong>dias completos</strong> em ordem, sem pular nenhum dia.
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600">
                  <strong>Importante:</strong> Se for noite (19h00 - 03h59) e você confirmar entre 00h00 - 03h59, 
                  a leitura será contada para o dia anterior.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Seção: Orientações para Leitura */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-500" />
                Como Ler Corretamente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Aviso sobre leitura em silêncio vs voz alta */}
              <div className="bg-gradient-to-r from-orange-50 to-blue-50 p-4 rounded-lg border border-orange-200 mb-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-blue-600" />
                  <VolumeX className="w-5 h-5 text-orange-600" />
                  Forma Correta de Ler por Período
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-orange-100 rounded-lg">
                    <VolumeX className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <span className="font-medium text-orange-800">Manhã e Tarde - EM SILÊNCIO</span>
                      <p className="text-sm text-orange-700 mt-1">
                        Durante o dia (manhã e tarde), leia o pergaminho <strong>em silêncio</strong>. 
                        Isso permite que as palavras se gravem profundamente em sua mente inconsciente.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-blue-100 rounded-lg">
                    <Volume2 className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <span className="font-medium text-blue-800">Noite - EM VOZ ALTA</span>
                      <p className="text-sm text-blue-700 mt-1">
                        À noite, leia o pergaminho <strong>em voz alta</strong>. 
                        Isso fortalece a fixação do conteúdo por conta da absorção dele através de 2 sistemas representacionais (visão e audição) e programa sua mente inconsciente durante o sono.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-indigo-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">Leia com Atenção e Respeite o Método</h4>
                    <p className="text-sm text-gray-600">
                      Dedique tempo para absorver o conteúdo e siga a forma correta: silêncio pela manhã/tarde, voz alta à noite.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-indigo-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">Reflita sobre o Conteúdo</h4>
                    <p className="text-sm text-gray-600">
                      Após ler, pense sobre como aplicar os ensinamentos em sua vida diária.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-indigo-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">Confirme Apenas Após Ler</h4>
                    <p className="text-sm text-gray-600">
                      Só confirme a leitura depois de realmente ter lido o pergaminho por completo.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-indigo-600">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">Mantenha a Consistência</h4>
                    <p className="text-sm text-gray-600">
                      O poder está na repetição diária. Leia nos 3 períodos todos os dias por 30 dias.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seção: Objetivo dos 30 Dias */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-red-500" />
                A Regra de Ouro dos 30 Dias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-sm text-gray-700 mb-3">
                  <strong>Objetivo:</strong> Completar 30 dias de leitura completos (manhã, tarde e noite) 
                  para cada pergaminho.
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  Esta disciplina cria um hábito poderoso e permite que os ensinamentos se fixem 
                  profundamente em sua mente e coração.
                </p>
                <p className="text-xs text-yellow-700 font-medium">
                  🏆 Quando completar todos os 10 pergaminhos, você terá desenvolvido uma transformação real!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Botão de Voltar */}
          <div className="pt-4 pb-8">
            <Button 
              onClick={() => router.push("/home")} 
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Voltar para Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
