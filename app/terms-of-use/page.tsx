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
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white p-4 shadow-sm flex items-center sticky top-0 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mr-4"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold">Termos de Uso</h1>
        </div>

        <div className="p-6 max-w-2xl mx-auto prose prose-sm sm:prose-base">
          <h2>Termos de Uso do Aplicativo UCA</h2>
          
          <h3>1. Aceitação dos Termos</h3>
          <p>
            Ao acessar e usar o aplicativo "UCA - Pergaminhos", você aceita e 
            concorda em estar vinculado aos termos e condições descritos neste documento. Se você 
            não concordar com qualquer parte destes termos, não deve usar este aplicativo.
          </p>

          <h3>2. Descrição do Serviço</h3>
          <p>
            O UCA é um aplicativo educacional e de desenvolvimento pessoal que oferece:
          </p>
          <ul>
            <li>Acesso a pergaminhos com conteúdo motivacional e educativo</li>
            <li>Acompanhamento de progresso de leitura</li>
            <li>Lembretes e notificações personalizadas</li>
            <li>Estatísticas de engajamento e desenvolvimento</li>
            <li>Funcionalidade offline completa</li>
          </ul>

          <h3>3. Elegibilidade e Verificação de Idade</h3>
          <p>
            <strong>IMPORTANTE:</strong> Este aplicativo é destinado a usuários com <strong>13 anos ou mais</strong>. 
            Usuários menores de 18 anos devem ter autorização de pais ou responsáveis legais para usar este serviço.
          </p>
          <ul>
            <li><strong>Menores de 13 anos:</strong> Não são permitidos usar este aplicativo</li>
            <li><strong>Entre 13 e 17 anos:</strong> Devem ter supervisão e autorização parental</li>
            <li><strong>18 anos ou mais:</strong> Podem usar o aplicativo de forma independente</li>
          </ul>
          <p>
            Ao usar este aplicativo, você confirma que atende aos requisitos de idade ou possui 
            a devida autorização parental.
          </p>

          <h3>4. Uso Aceitável</h3>
          <p>Você concorda em usar o aplicativo apenas para fins legais e de acordo com estes termos. É proibido:</p>
          <ul>
            <li>Usar o aplicativo para qualquer finalidade ilegal ou não autorizada</li>
            <li>Tentar obter acesso não autorizado a qualquer parte do aplicativo</li>
            <li>Interferir ou interromper o funcionamento do aplicativo</li>
            <li>Reproduzir, distribuir ou modificar o conteúdo sem autorização</li>
            <li>Usar o aplicativo de forma que possa prejudicar menores de idade</li>
          </ul>

          <h3>5. Conteúdo e Propriedade Intelectual</h3>
          <p>
            O conteúdo dos pergaminhos é fornecido para fins educacionais e de desenvolvimento pessoal. 
            Alguns conteúdos podem ser baseados em textos de domínio público ou fontes abertas, 
            devidamente adaptados para o contexto do aplicativo.
          </p>
          <ul>
            <li><strong>Direitos Autorais:</strong> Respeitamos todos os direitos de propriedade intelectual</li>
            <li><strong>Fontes Abertas:</strong> Alguns conteúdos podem derivar de fontes públicas</li>
            <li><strong>Adaptações:</strong> Todo conteúdo é adaptado para fins educacionais</li>
            <li><strong>Uso Pessoal:</strong> O conteúdo é destinado apenas ao uso pessoal e educativo</li>
          </ul>

          <h3>6. Proteção de Menores</h3>
          <p>
            Levamos a proteção de menores muito a sério e implementamos as seguintes medidas:
          </p>
          <ul>
            <li><strong>Conteúdo Apropriado:</strong> Todo conteúdo é revisado para ser adequado para todas as idades</li>
            <li><strong>Sem Interação Social:</strong> O aplicativo não possui recursos de chat ou interação entre usuários</li>
            <li><strong>Dados Locais:</strong> Nenhum dado pessoal é coletado ou compartilhado</li>
            <li><strong>Supervisão Parental:</strong> Encorajamos a supervisão parental para usuários menores de 18 anos</li>
            <li><strong>Controle de Acesso:</strong> Pais podem desinstalar ou restringir o acesso ao aplicativo a qualquer momento</li>
          </ul>

          <h3>7. Privacidade e Proteção de Dados</h3>
          <p>
            Sua privacidade é fundamental para nós. Este aplicativo:
          </p>
          <ul>
            <li>Não coleta dados pessoais ou identificáveis</li>
            <li>Armazena apenas dados de progresso localmente no seu dispositivo</li>
            <li>Não compartilha informações com terceiros</li>
            <li>Funciona completamente offline após a instalação</li>
          </ul>
          <p>
            Para mais detalhes, consulte nossa <a href="/privacy-policy" className="text-blue-600 underline">Política de Privacidade</a>.
          </p>

          <h3>8. Limitação de Responsabilidade</h3>
          <p>
            O aplicativo UCA é fornecido "como está" e "conforme disponível". Não garantimos que:
          </p>
          <ul>
            <li>O serviço será ininterrupto ou livre de erros</li>
            <li>Os resultados obtidos serão precisos ou confiáveis</li>
            <li>Defeitos serão corrigidos imediatamente</li>
          </ul>
          <p>
            Em nenhuma circunstância seremos responsáveis por danos diretos, indiretos, 
            incidentais, especiais ou consequenciais resultantes do uso ou incapacidade de usar o aplicativo.
          </p>

          <h3>9. Remoção de Conteúdo</h3>
          <p>
            Se você acredita que algum conteúdo no aplicativo viola direitos autorais ou é inadequado:
          </p>
          <ul>
            <li><strong>Email de Contato:</strong> <a href="mailto:app-uca@mandara.com.br">app-uca@mandara.com.br</a></li>
            <li><strong>Tempo de Resposta:</strong> Respondemos em até 48 horas</li>
            <li><strong>Processo:</strong> Analisamos todas as solicitações de remoção de conteúdo</li>
            <li><strong>Ação:</strong> Removemos ou adaptamos conteúdo quando apropriado</li>
          </ul>

          <h3>10. Atualizações dos Termos</h3>
          <p>
            Podemos atualizar estes termos periodicamente. Mudanças significativas serão comunicadas 
            através do aplicativo ou por email (se disponível). O uso continuado do aplicativo após 
            mudanças constitui aceitação dos novos termos.
          </p>

          <h3>11. Legislação Aplicável</h3>
          <p>
            Estes termos são regidos pelas leis brasileiras. Qualquer disputa será resolvida nos 
            tribunais brasileiros competentes.
          </p>

          <h3>12. Contato</h3>
          <p>
            Para dúvidas sobre estes termos ou o aplicativo:
          </p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:app-uca@mandara.com.br">app-uca@mandara.com.br</a></li>
            <li><strong>Suporte:</strong> Disponível através do menu do aplicativo</li>
            <li><strong>Responsável:</strong> Equipe AgilMove</li>
          </ul>

          <div className="bg-blue-50 p-4 rounded-lg mt-6">
            <h4 className="font-semibold text-blue-800 mb-2">📱 Compromisso com a Qualidade</h4>
            <p className="text-blue-700 text-sm">
              Estamos comprometidos em fornecer um aplicativo seguro, educativo e apropriado 
              para todos os usuários. Trabalhamos continuamente para melhorar a experiência 
              e manter os mais altos padrões de qualidade e segurança.
            </p>
          </div>

          <p className="text-xs text-gray-500 mt-8">
            <strong>Última atualização:</strong> 19 de Julho de 2025<br/>
            <strong>Versão:</strong> 1.0<br/>
            <strong>Vigência:</strong> Estes termos entram em vigor imediatamente
          </p>
        </div>
      </div>
    </div>
  )
}
