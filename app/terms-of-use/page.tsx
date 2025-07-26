"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAndroidBackHandler } from "@/hooks/use-android-back-handler"

export default function TermsOfUsePage() {
  const router = useRouter()
  
  // Hook para tratar o botão voltar do Android
  useAndroidBackHandler()

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen transition-all duration-300 ease-in-out">
      <div className="min-h-screen bg-gray-50 pt-10 pb-10">
        <div className="bg-white p-4 shadow-sm flex items-center sticky top-0 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/home")}
            className="mr-4"
            aria-label="Voltar para Home"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold">Termos de Uso</h1>
        </div>

        <div className="p-6 max-w-2xl mx-auto">
          <div className="space-y-8">
            <div className="text-center bg-purple-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-purple-800 mb-4">
                Termos de Uso do Aplicativo UCA
              </h2>
              <p className="text-purple-700 leading-relaxed">
                Bem-vindo ao UCA - Pergaminhos! Estes termos definem as regras e condições para uso do nosso aplicativo educacional.
              </p>
            </div>

            <div className="space-y-6">
              {/* Seção 1 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
                  Aceitação dos Termos
                </h3>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-blue-700 leading-relaxed">
                    Ao acessar e usar o aplicativo "UCA - Pergaminhos", você aceita e 
                    concorda em estar vinculado aos termos e condições descritos neste documento. Se você 
                    não concordar com qualquer parte destes termos, não deve usar este aplicativo.
                  </p>
                </div>
              </div>

              {/* Seção 2 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">2</span>
                  Descrição do Serviço
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    O UCA é um aplicativo educacional e de desenvolvimento pessoal que oferece:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">📜 Pergaminhos Educativos</h4>
                      <p className="text-green-700 text-sm">Acesso a pergaminhos com conteúdo motivacional e educativo</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">📈 Progresso de Leitura</h4>
                      <p className="text-blue-700 text-sm">Acompanhamento detalhado do seu progresso</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-800 mb-2">🔔 Lembretes Inteligentes</h4>
                      <p className="text-purple-700 text-sm">Lembretes e notificações personalizadas</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <h4 className="font-semibold text-orange-800 mb-2">📊 Estatísticas</h4>
                      <p className="text-orange-700 text-sm">Estatísticas de engajamento e desenvolvimento</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 md:col-span-2">
                      <h4 className="font-semibold text-yellow-800 mb-2">⚡ Funcionalidade Offline</h4>
                      <p className="text-yellow-700 text-sm">Funcionalidade offline completa - use em qualquer lugar!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção 3 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">3</span>
                  Elegibilidade e Verificação de Idade
                </h3>
                <div className="space-y-4">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-bold text-red-800 mb-2">⚠️ IMPORTANTE - Requisitos de Idade:</h4>
                    <p className="text-red-700 text-sm">
                      Este aplicativo é destinado a usuários com <strong>13 anos ou mais</strong>. 
                      Usuários menores de 18 anos devem ter autorização de pais ou responsáveis legais para usar este serviço.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <h4 className="font-semibold text-red-800 mb-2">🚫 Menores de 13 anos</h4>
                      <p className="text-red-700 text-sm">Não são permitidos usar este aplicativo</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-yellow-800 mb-2">👨‍👩‍👧‍👦 Entre 13 e 17 anos</h4>
                      <p className="text-yellow-700 text-sm">Devem ter supervisão e autorização parental</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">✅ 18 anos ou mais</h4>
                      <p className="text-green-700 text-sm">Podem usar o aplicativo de forma independente</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-blue-700 text-sm">
                      <strong>Confirmação:</strong> Ao usar este aplicativo, você confirma que atende aos requisitos de idade ou possui 
                      a devida autorização parental.
                    </p>
                  </div>
                </div>
              </div>

              {/* Seção 4 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">4</span>
                  Uso Aceitável
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Você concorda em usar o aplicativo apenas para fins legais e de acordo com estes termos. É proibido:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <h4 className="font-semibold text-red-800 mb-2">🚫 Uso Ilegal</h4>
                      <p className="text-red-700 text-sm">Usar o aplicativo para qualquer finalidade ilegal ou não autorizada</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <h4 className="font-semibold text-orange-800 mb-2">⚠️ Acesso Não Autorizado</h4>
                      <p className="text-orange-700 text-sm">Tentar obter acesso não autorizado a qualquer parte do aplicativo</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-yellow-800 mb-2">🔧 Interferência</h4>
                      <p className="text-yellow-700 text-sm">Interferir ou interromper o funcionamento do aplicativo</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-800 mb-2">📋 Distribuição Não Autorizada</h4>
                      <p className="text-purple-700 text-sm">Reproduzir, distribuir ou modificar o conteúdo sem autorização</p>
                    </div>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-bold text-red-800 mb-2">🛡️ Proteção de Menores:</h4>
                    <p className="text-red-700 text-sm">
                      É terminantemente proibido usar o aplicativo de forma que possa prejudicar menores de idade.
                    </p>
                  </div>
                </div>
              </div>

              {/* Seção 5 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">5</span>
                  Conteúdo e Propriedade Intelectual
                </h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-blue-700 leading-relaxed">
                      O conteúdo dos pergaminhos é fornecido para fins educacionais e de desenvolvimento pessoal. 
                      Alguns conteúdos podem ser baseados em textos de domínio público ou fontes abertas, 
                      devidamente adaptados para o contexto do aplicativo.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">⚖️ Direitos Autorais</h4>
                      <p className="text-green-700 text-sm">Respeitamos todos os direitos de propriedade intelectual</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-yellow-800 mb-2">📚 Fontes Abertas</h4>
                      <p className="text-yellow-700 text-sm">Alguns conteúdos podem derivar de fontes públicas</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-800 mb-2">🎓 Adaptações</h4>
                      <p className="text-purple-700 text-sm">Todo conteúdo é adaptado para fins educacionais</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <h4 className="font-semibold text-orange-800 mb-2">👤 Uso Pessoal</h4>
                      <p className="text-orange-700 text-sm">O conteúdo é destinado apenas ao uso pessoal e educativo</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção 6 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">6</span>
                  Proteção de Menores
                </h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-bold text-blue-800 mb-2">🛡️ Nosso Compromisso</h4>
                    <p className="text-blue-700 text-sm">
                      Levamos a proteção de menores muito a sério e implementamos as seguintes medidas:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">✅ Conteúdo Apropriado</h4>
                      <p className="text-green-700 text-sm">Todo conteúdo é revisado para ser adequado para todas as idades</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-yellow-800 mb-2">🚫 Sem Interação Social</h4>
                      <p className="text-yellow-700 text-sm">O aplicativo não possui recursos de chat ou interação entre usuários</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-800 mb-2">🔒 Dados Locais</h4>
                      <p className="text-purple-700 text-sm">Nenhum dado pessoal é coletado ou compartilhado</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <h4 className="font-semibold text-orange-800 mb-2">👨‍👩‍👧‍👦 Supervisão Parental</h4>
                      <p className="text-orange-700 text-sm">Encorajamos a supervisão parental para usuários menores de 18 anos</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-bold text-blue-800 mb-2">⚙️ Controle de Acesso:</h4>
                    <p className="text-blue-700 text-sm">
                      Pais podem desinstalar ou restringir o acesso ao aplicativo através das configurações do dispositivo a qualquer momento.
                    </p>
                  </div>
                </div>
              </div>

              {/* Seção 7 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">7</span>
                  Privacidade e Proteção de Dados
                </h3>
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-bold text-green-800 mb-3">🔐 Sua privacidade é fundamental para nós</h4>
                    <p className="text-green-700 text-sm mb-3">Este aplicativo:</p>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        <span className="text-green-700 text-sm">Não coleta dados pessoais ou identificáveis</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        <span className="text-green-700 text-sm">Armazena apenas dados de progresso localmente no seu dispositivo</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        <span className="text-green-700 text-sm">Não compartilha informações com terceiros</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        <span className="text-green-700 text-sm">Funciona completamente offline após a instalação</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-blue-700 text-sm">
                      Para mais detalhes, consulte nossa <a href="/privacy-policy" className="text-blue-600 underline font-semibold">Política de Privacidade</a>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Seção 8 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">8</span>
                  Limitação de Responsabilidade
                </h3>
                <div className="space-y-4">
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-bold text-yellow-800 mb-2">⚠️ Isenção de Garantias</h4>
                    <p className="text-yellow-700 text-sm mb-3">
                      O aplicativo UCA é fornecido "como está" e "conforme disponível". Não garantimos que:
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <span className="text-yellow-500 mr-2 mt-1">•</span>
                        <span className="text-yellow-700 text-sm">O serviço será ininterrupto ou livre de erros</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-yellow-500 mr-2 mt-1">•</span>
                        <span className="text-yellow-700 text-sm">Os resultados obtidos serão precisos ou confiáveis</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-yellow-500 mr-2 mt-1">•</span>
                        <span className="text-yellow-700 text-sm">Defeitos serão corrigidos imediatamente</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-bold text-red-800 mb-2">⚖️ Limitação de Danos</h4>
                    <p className="text-red-700 text-sm">
                      Em nenhuma circunstância seremos responsáveis por danos diretos, indiretos, 
                      incidentais, especiais ou consequenciais resultantes do uso ou incapacidade de usar o aplicativo.
                    </p>
                  </div>
                </div>
              </div>

              {/* Seção 9 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">9</span>
                  Remoção de Conteúdo
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Se você acredita que algum conteúdo no aplicativo viola direitos autorais ou é inadequado:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">📧 Email de Contato</h4>
                      <a href="mailto:app-uca@mandara.com.br" className="text-blue-600 underline text-sm font-semibold">
                        app-uca@mandara.com.br
                      </a>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">⏱️ Tempo de Resposta</h4>
                      <p className="text-green-700 text-sm">Respondemos em até 48 horas</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-yellow-800 mb-2">🔍 Processo</h4>
                      <p className="text-yellow-700 text-sm">Analisamos todas as solicitações de remoção de conteúdo</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-800 mb-2">⚡ Ação</h4>
                      <p className="text-purple-700 text-sm">Removemos ou adaptamos conteúdo quando apropriado</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção 10 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">10</span>
                  Atualizações dos Termos
                </h3>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-blue-700 leading-relaxed text-sm">
                    Podemos atualizar estes termos periodicamente. Mudanças significativas serão comunicadas 
                    através do aplicativo ou por email (se disponível). O uso continuado do aplicativo após 
                    mudanças constitui aceitação dos novos termos.
                  </p>
                </div>
              </div>

              {/* Seção 11 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">11</span>
                  Legislação Aplicável
                </h3>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-green-700 leading-relaxed text-sm">
                    Estes termos são regidos pelas leis brasileiras. Qualquer disputa será resolvida nos 
                    tribunais brasileiros competentes.
                  </p>
                </div>
              </div>

              {/* Seção 12 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">12</span>
                  Contato
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Para dúvidas sobre estes termos ou o aplicativo:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">📧 Email</h4>
                      <a href="mailto:app-uca@mandara.com.br" className="text-blue-600 underline text-sm font-semibold">
                        app-uca@mandara.com.br
                      </a>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">🛠️ Suporte</h4>
                      <p className="text-green-700 text-sm">Disponível através do menu do aplicativo</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-800 mb-2">👥 Responsável</h4>
                      <p className="text-purple-700 text-sm">Equipe AgilMove</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compromisso com Qualidade */}
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-4">📱</span>
                  <h4 className="font-bold text-blue-800 text-lg">Compromisso com a Qualidade</h4>
                </div>
                <p className="text-blue-700 text-sm leading-relaxed">
                  Estamos comprometidos em fornecer um aplicativo seguro, educativo e apropriado 
                  para todos os usuários. Trabalhamos continuamente para melhorar a experiência 
                  e manter os mais altos padrões de qualidade e segurança.
                </p>
              </div>

              {/* Footer */}
              <div className="text-center bg-gray-100 p-6 rounded-lg">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 font-semibold">
                    📅 <strong>Última atualização:</strong> 19 de Julho de 2025
                  </p>
                  <p className="text-xs text-gray-500">
                    <strong>Versão:</strong> 1.0
                  </p>
                  <p className="text-xs text-gray-500">
                    <strong>Vigência:</strong> Estes termos entram em vigor imediatamente
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
