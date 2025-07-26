"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAndroidBackHandler } from "@/hooks/use-android-back-handler"

export default function PrivacyPolicyPage() {
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
          <h1 className="text-xl font-bold">Política de Privacidade</h1>
        </div>

        <div className="p-6 max-w-2xl mx-auto">
          <div className="space-y-8">
            <div className="text-center bg-blue-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">
                Política de Privacidade do Aplicativo "UCA - Pergaminhos" - Pergaminhos
              </h2>
              <p className="text-blue-700 leading-relaxed">
                Esta Política de Privacidade descreve como o aplicativo "UCA - Pergaminhos" coleta, usa e
                protege suas informações. Ao usar nosso aplicativo, você concorda com os termos desta política.
              </p>
            </div>

            <div className="space-y-6">
              {/* Seção 1 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
                  Coleta e Armazenamento de Dados
                </h3>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    O aplicativo "UCA - Pergaminhos" foi projetado para funcionar completamente offline e <strong>não coleta nem armazena seus dados
                    pessoais em servidores externos</strong>. Todas as informações relacionadas ao seu progresso de leitura,
                    configurações de notificação e histórico de leituras são armazenadas <strong>exclusivamente no seu dispositivo
                    local</strong> (utilizando o IndexedDB do navegador e localStorage para configurações).
                  </p>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">📱 Dados Armazenados Localmente (Local Storage/IndexedDB):</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        Seu progresso de leitura dos pergaminhos (dias completos, último dia de leitura).
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        Suas configurações de notificação (horários preferidos).
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        Registros de leitura (qual pergaminho foi lido, em qual período e data).
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        Preferências do aplicativo (tema, configurações de interface).
                      </li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-3">🍪 Cookies e Armazenamento Local:</h4>
                    <p className="text-yellow-700 text-sm">
                      O aplicativo utiliza apenas cookies técnicos essenciais e storage local (localStorage/IndexedDB) para funcionar corretamente. 
                      Não utilizamos cookies de rastreamento ou publicidade.
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-3">🔒 Nenhuma Coleta de Dados Pessoais:</h4>
                    <p className="text-green-700 text-sm">
                      Não coletamos seu nome, e-mail, localização ou qualquer outra informação de identificação pessoal.
                    </p>
                  </div>
                </div>
              </div>

              {/* Seção 2 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">2</span>
                  Uso dos Dados
                </h3>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    Os dados armazenados localmente são utilizados apenas para a funcionalidade do aplicativo, permitindo que você:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">📈 Progresso</h4>
                      <p className="text-blue-700 text-sm">Acompanhe seu progresso nos pergaminhos.</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">🔔 Lembretes</h4>
                      <p className="text-purple-700 text-sm">Receba lembretes de leitura (se as notificações forem ativadas).</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">📊 Histórico</h4>
                      <p className="text-green-700 text-sm">Visualize seu histórico e estatísticas de leitura.</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-orange-800 mb-2">⚙️ Configurações</h4>
                      <p className="text-orange-700 text-sm">Mantenha suas preferências personalizadas.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção 3 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">3</span>
                  Compartilhamento de Dados
                </h3>
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">🛡️</span>
                    <h4 className="font-bold text-green-800 text-lg">Garantia de Privacidade</h4>
                  </div>
                  <p className="text-green-700 leading-relaxed">
                    Como não coletamos seus dados em nossos servidores, <strong>não há compartilhamento de suas informações com
                    terceiros</strong>. Seus dados permanecem seguros e privados no seu dispositivo.
                  </p>
                </div>
              </div>

              {/* Seção 4 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">4</span>
                  Notificações Push (Funcionalidade Futura/Opcional)
                </h3>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    O aplicativo pode, no futuro, oferecer a opção de ativar notificações push para lembrá-lo de suas leituras.
                    Se você optar por ativar esta funcionalidade, seu navegador gerará uma "assinatura de push" que será enviada
                    a um servidor para permitir o envio das notificações.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        Esta assinatura não contém informações pessoais identificáveis
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        É usada apenas para o propósito de entregar as notificações
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        Você poderá desativar as notificações a qualquer momento
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Seção 5 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">5</span>
                  Cookies e Tecnologias de Storage
                </h3>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    O aplicativo "UCA - Pergaminhos" utiliza tecnologias de armazenamento local para garantir seu funcionamento adequado:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-yellow-800 mb-2">🍪 Cookies Técnicos</h4>
                      <p className="text-yellow-700 text-sm">
                        Apenas cookies essenciais para funcionamento, como preferências de interface e configurações de sessão.
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-800 mb-2">💾 Local Storage</h4>
                      <p className="text-purple-700 text-sm">
                        Configurações do usuário e preferências no localStorage do navegador.
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">🗃️ IndexedDB</h4>
                      <p className="text-green-700 text-sm">
                        Banco de dados local para progresso e histórico de leitura.
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">⚡ Service Worker Cache</h4>
                      <p className="text-blue-700 text-sm">
                        Cache local para funcionamento offline do aplicativo.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-bold text-red-800 mb-2">⚠️ Importante:</h4>
                    <p className="text-red-700 text-sm">
                      Não utilizamos cookies de rastreamento, publicidade ou análise de comportamento. 
                      Todos os dados permanecem exclusivamente no seu dispositivo e você pode limpá-los a qualquer momento através 
                      das configurações do seu navegador.
                    </p>
                  </div>
                </div>
              </div>

              {/* Seção 6 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">6</span>
                  Proteção de Menores e Verificação de Idade
                </h3>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h4 className="font-bold text-orange-800 mb-2">🔞 Requisito de Idade</h4>
                    <p className="text-orange-700">
                      Este aplicativo é destinado a usuários com <strong>13 anos ou mais</strong>. 
                      Implementamos um sistema de verificação de idade obrigatório para garantir conformidade com as regulamentações 
                      de proteção de menores.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <h4 className="font-semibold text-red-800 mb-2">🚫 Menores de 13 anos</h4>
                      <p className="text-red-700 text-sm">Não são permitidos usar este aplicativo sob nenhuma circunstância</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-yellow-800 mb-2">👨‍👩‍👧‍👦 Entre 13 e 17 anos</h4>
                      <p className="text-yellow-700 text-sm">É recomendável supervisão e autorização parental</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">✅ Conteúdo Apropriado</h4>
                      <p className="text-green-700 text-sm">Todo conteúdo é revisado para ser adequado e educativo</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">🔒 Sem Interação Social</h4>
                      <p className="text-blue-700 text-sm">O aplicativo não possui recursos de chat ou comunicação entre usuários</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-bold text-blue-800 mb-2">👨‍👩‍👧‍👦 Para Pais e Responsáveis:</h4>
                    <p className="text-blue-700 text-sm">
                      Encorajamos a supervisão parental. Pais podem desinstalar 
                      ou restringir o acesso ao aplicativo através das configurações do dispositivo a qualquer momento.
                    </p>
                  </div>
                </div>
              </div>

              {/* Seção 7 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">7</span>
                  Seus Direitos
                </h3>
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">⚖️</span>
                    <h4 className="font-bold text-green-800 text-lg">Controle Total dos Seus Dados</h4>
                  </div>
                  <p className="text-green-700 leading-relaxed">
                    Como seus dados são armazenados localmente, você tem controle total sobre eles. Você pode limpar os dados do
                    aplicativo a qualquer momento através das configurações do seu navegador (geralmente em "Configurações do
                    Site" ou "Dados do Site"), o que removerá todas as suas informações de progresso e configurações.
                  </p>
                </div>
              </div>

              {/* Seção 8 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">8</span>
                  Conteúdo de Fontes Abertas e Propriedade Intelectual
                </h3>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-bold text-blue-800 mb-2">🔍 Transparência sobre Conteúdo:</h4>
                    <p className="text-blue-700 text-sm">
                      O aplicativo "UCA - Pergaminhos" pode incluir conteúdo baseado em textos 
                      de domínio público, fontes abertas ou materiais educacionais amplamente disponíveis, todos devidamente 
                      adaptados para fins educacionais e de desenvolvimento pessoal.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">📚 Fontes Abertas</h4>
                      <p className="text-green-700 text-sm">Alguns pergaminhos podem derivar de textos em domínio público</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">🎓 Adaptação Educacional</h4>
                      <p className="text-purple-700 text-sm">Todo conteúdo é revisado e adaptado para contexto educativo</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-yellow-800 mb-2">⚖️ Respeito aos Direitos</h4>
                      <p className="text-yellow-700 text-sm">Respeitamos todos os direitos de propriedade intelectual</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-800 mb-2">🗑️ Remoção de Conteúdo</h4>
                      <p className="text-red-700 text-sm">Removemos rapidamente qualquer conteúdo controverso quando notificados</p>
                    </div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h4 className="font-bold text-orange-800 mb-2">📧 Solicitação de Remoção:</h4>
                    <p className="text-orange-700 text-sm mb-2">
                      Se você acredita que algum conteúdo viola direitos autorais ou 
                      é inadequado, entre em contato conosco em <a href="mailto:app-uca@mandara.com.br" className="underline font-semibold">app-uca@mandara.com.br</a>.
                    </p>
                    <p className="text-orange-700 text-sm">
                      Analisamos todas as solicitações em até 48 horas e tomamos as medidas apropriadas.
                    </p>
                  </div>
                </div>
              </div>

              {/* Seção 9 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">9</span>
                  Alterações e Atualizações desta Política de Privacidade
                </h3>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-yellow-700 leading-relaxed">
                    Podemos atualizar nossa Política de Privacidade periodicamente para refletir mudanças em nossas práticas ou
                    por motivos legais e regulamentares. Quando modificamos esta política, atualizamos a data de "Última atualização"
                    no final desta página. A versão mais recente estará sempre disponível dentro do aplicativo. 
                    Recomendamos que você revise esta política regularmente para se manter informado sobre quaisquer
                    alterações que possam afetar seus direitos de privacidade.
                  </p>
                </div>
              </div>

              {/* Seção 10 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">10</span>
                  Contato e Suporte
                </h3>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    Se você tiver alguma dúvida sobre esta Política de Privacidade, precisar de esclarecimentos sobre como
                    seus dados são tratados, ou desejar exercer seus direitos de privacidade, entre em contato conosco através
                    dos seguintes canais:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">📧 E-mail</h4>
                      <a href="mailto:app-uca@mandara.com.br" className="text-blue-600 underline text-sm font-semibold">
                        app-uca@mandara.com.br
                      </a>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">🛠️ Suporte Técnico</h4>
                      <p className="text-green-700 text-sm">Disponível através do menu do aplicativo</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">⏱️ Tempo de Resposta</h4>
                      <p className="text-purple-700 text-sm">Respondemos a todas as solicitações em até 48 horas úteis</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-orange-800 mb-2">🗑️ Remoção de Conteúdo</h4>
                      <p className="text-orange-700 text-sm">Solicitações de remoção são processadas prioritariamente</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção 11 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">11</span>
                  Conformidade e Transparência
                </h3>
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">✅</span>
                    <h4 className="font-bold text-green-800 text-lg">Nosso Compromisso</h4>
                  </div>
                  <p className="text-green-700 leading-relaxed">
                    Esta política de privacidade está em conformidade com as melhores práticas de proteção de dados e 
                    transparência. Comprometemo-nos a manter você informado sobre como seus dados são tratados e a 
                    respeitar sua privacidade em todas as interações com o aplicativo "UCA - Pergaminhos".
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center bg-gray-100 p-6 rounded-lg">
                <p className="text-sm text-gray-600 font-semibold">
                  📅 Última atualização: 18 de Julho de 2025
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Versão 1.0 • Vigência imediata
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
