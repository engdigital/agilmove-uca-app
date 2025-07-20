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
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white p-4 shadow-sm flex items-center sticky top-0 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()} // Volta para a página anterior
            className="mr-4"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold">Política de Privacidade</h1>
        </div>

        <div className="p-6 max-w-2xl mx-auto prose prose-sm sm:prose-base">
          <h2>Política de Privacidade do Aplicativo UCA</h2>
          <p>
            Esta Política de Privacidade descreve como o aplicativo "UCA - Pergaminhos" coleta, usa e
            protege suas informações. Ao usar nosso aplicativo, você concorda com os termos desta política.
          </p>

          <h3>1. Coleta e Armazenamento de Dados</h3>
          <p>
            O aplicativo UCA foi projetado para funcionar completamente offline e **não coleta nem armazena seus dados
            pessoais em servidores externos**. Todas as informações relacionadas ao seu progresso de leitura,
            configurações de notificação e histórico de leituras são armazenadas **exclusivamente no seu dispositivo
            local** (utilizando o IndexedDB do navegador e localStorage para configurações).
          </p>
          <ul>
            <li>
              <strong>Dados Armazenados Localmente (Local Storage/IndexedDB):</strong>
              <ul>
                <li>Seu progresso de leitura dos pergaminhos (dias completos, último dia de leitura).</li>
                <li>Suas configurações de notificação (horários preferidos).</li>
                <li>Registros de leitura (qual pergaminho foi lido, em qual período e data).</li>
                <li>Preferências do aplicativo (tema, configurações de interface).</li>
              </ul>
            </li>
            <li>
              <strong>Cookies e Armazenamento Local:</strong> O aplicativo utiliza apenas cookies técnicos essenciais e storage local (localStorage/IndexedDB) para funcionar corretamente. Não utilizamos cookies de rastreamento ou publicidade.
            </li>
            <li>
              <strong>Nenhuma Coleta de Dados Pessoais:</strong> Não coletamos seu nome, e-mail, localização ou qualquer
              outra informação de identificação pessoal.
            </li>
          </ul>

          <h3>2. Uso dos Dados</h3>
          <p>
            Os dados armazenados localmente são utilizados apenas para a funcionalidade do aplicativo, permitindo que
            você:
          </p>
          <ul>
            <li>Acompanhe seu progresso nos pergaminhos.</li>
            <li>Receba lembretes de leitura (se as notificações forem ativadas).</li>
            <li>Visualize seu histórico e estatísticas de leitura.</li>
          </ul>

          <h3>3. Compartilhamento de Dados</h3>
          <p>
            Como não coletamos seus dados em nossos servidores, **não há compartilhamento de suas informações com
            terceiros**. Seus dados permanecem seguros e privados no seu dispositivo.
          </p>

          <h3>4. Notificações Push (Funcionalidade Futura/Opcional)</h3>
          <p>
            O aplicativo pode, no futuro, oferecer a opção de ativar notificações push para lembrá-lo de suas leituras.
            Se você optar por ativar esta funcionalidade, seu navegador gerará uma "assinatura de push" que será enviada
            a um servidor para permitir o envio das notificações. Esta assinatura não contém informações pessoais
            identificáveis e é usada apenas para o propósito de entregar as notificações. Você poderá desativar as
            notificações a qualquer momento nas configurações do seu dispositivo ou do aplicativo.
          </p>

          <h3>5. Cookies e Tecnologias de Storage</h3>
          <p>
            O aplicativo UCA utiliza tecnologias de armazenamento local para garantir seu funcionamento adequado:
          </p>
          <ul>
            <li><strong>Cookies Técnicos:</strong> Utilizamos apenas cookies essenciais para o funcionamento do aplicativo, como preferências de interface e configurações de sessão.</li>
            <li><strong>Local Storage:</strong> Armazenamos configurações do usuário e preferências no localStorage do navegador.</li>
            <li><strong>IndexedDB:</strong> Banco de dados local onde são armazenados seus progressos e histórico de leitura.</li>
            <li><strong>Service Worker Cache:</strong> Cache local para permitir funcionamento offline do aplicativo.</li>
          </ul>
          <p>
            <strong>Importante:</strong> Não utilizamos cookies de rastreamento, publicidade ou análise de comportamento. 
            Todos os dados permanecem exclusivamente no seu dispositivo e você pode limpá-los a qualquer momento através 
            das configurações do seu navegador.
          </p>

          <h3>6. Proteção de Menores e Verificação de Idade</h3>
          <p>
            <strong>Requisito de Idade:</strong> Este aplicativo é destinado a usuários com <strong>13 anos ou mais</strong>. 
            Implementamos um sistema de verificação de idade obrigatório para garantir conformidade com as regulamentações 
            de proteção de menores.
          </p>
          <ul>
            <li><strong>Verificação Obrigatória:</strong> Todos os usuários devem verificar sua idade antes de acessar o aplicativo</li>
            <li><strong>Menores de 13 anos:</strong> Não são permitidos usar este aplicativo sob nenhuma circunstância</li>
            <li><strong>Entre 13 e 17 anos:</strong> É recomendável supervisão e autorização parental</li>
            <li><strong>Conteúdo Apropriado:</strong> Todo conteúdo é revisado para ser adequado e educativo</li>
            <li><strong>Sem Interação Social:</strong> O aplicativo não possui recursos de chat ou comunicação entre usuários</li>
            <li><strong>Dados de Menores:</strong> Não coletamos dados pessoais de usuários menores de idade</li>
          </ul>
          <p>
            <strong>Para Pais e Responsáveis:</strong> Encorajamos a supervisão parental. Pais podem desinstalar 
            ou restringir o acesso ao aplicativo através das configurações do dispositivo a qualquer momento.
          </p>

          <h3>7. Seus Direitos</h3>
          <p>
            Como seus dados são armazenados localmente, você tem controle total sobre eles. Você pode limpar os dados do
            aplicativo a qualquer momento através das configurações do seu navegador (geralmente em "Configurações do
            Site" ou "Dados do Site"), o que removerá todas as suas informações de progresso e configurações.
          </p>

          <h3>7. Seus Direitos</h3>
          <p>
            Como seus dados são armazenados localmente, você tem controle total sobre eles. Você pode limpar os dados do
            aplicativo a qualquer momento através das configurações do seu navegador (geralmente em "Configurações do
            Site" ou "Dados do Site"), o que removerá todas as suas informações de progresso e configurações.
          </p>

          <h3>8. Conteúdo de Fontes Abertas e Propriedade Intelectual</h3>
          <p>
            <strong>Transparência sobre Conteúdo:</strong> O aplicativo UCA pode incluir conteúdo baseado em textos 
            de domínio público, fontes abertas ou materiais educacionais amplamente disponíveis, todos devidamente 
            adaptados para fins educacionais e de desenvolvimento pessoal.
          </p>
          <ul>
            <li><strong>Fontes Abertas:</strong> Alguns pergaminhos podem derivar de textos em domínio público</li>
            <li><strong>Adaptação Educacional:</strong> Todo conteúdo é revisado e adaptado para contexto educativo</li>
            <li><strong>Respeito aos Direitos:</strong> Respeitamos todos os direitos de propriedade intelectual</li>
            <li><strong>Remoção de Conteúdo:</strong> Removemos rapidamente qualquer conteúdo controverso quando notificados</li>
          </ul>
          <p>
            <strong>Solicitação de Remoção:</strong> Se você acredita que algum conteúdo viola direitos autorais ou 
            é inadequado, entre em contato conosco em <a href="mailto:app-uca@mandara.com.br">app-uca@mandara.com.br</a>. 
            Analisamos todas as solicitações em até 48 horas e tomamos as medidas apropriadas.
          </p>

          <h3>9. Alterações e Atualizações desta Política de Privacidade</h3>
          <p>
            Podemos atualizar nossa Política de Privacidade periodicamente para refletir mudanças em nossas práticas ou
            por motivos legais e regulamentares. Quando modificamos esta política, atualizamos a data de "Última atualização"
            no final desta página. A versão mais recente estará sempre disponível dentro do aplicativo. 
            Recomendamos que você revise esta política regularmente para se manter informado sobre quaisquer
            alterações que possam afetar seus direitos de privacidade.
          </p>

          <h3>9. Alterações e Atualizações desta Política de Privacidade</h3>
          <p>
            Podemos atualizar nossa Política de Privacidade periodicamente para refletir mudanças em nossas práticas ou
            por motivos legais e regulamentares. Quando modificamos esta política, atualizamos a data de "Última atualização"
            no final desta página. A versão mais recente estará sempre disponível dentro do aplicativo. 
            Recomendamos que você revise esta política regularmente para se manter informado sobre quaisquer
            alterações que possam afetar seus direitos de privacidade.
          </p>

          <h3>10. Contato e Suporte</h3>
          <p>
            Se você tiver alguma dúvida sobre esta Política de Privacidade, precisar de esclarecimentos sobre como
            seus dados são tratados, ou desejar exercer seus direitos de privacidade, entre em contato conosco através
            dos seguintes canais:
          </p>
          <ul>
            <li><strong>E-mail:</strong> <a href="mailto:app-uca@mandara.com.br">app-uca@mandara.com.br</a></li>
            <li><strong>Suporte Técnico:</strong> Disponível através do menu do aplicativo</li>
            <li><strong>Tempo de Resposta:</strong> Respondemos a todas as solicitações em até 48 horas úteis</li>
          </ul>
          
          <h3>10. Contato e Suporte</h3>
          <p>
            Se você tiver alguma dúvida sobre esta Política de Privacidade, precisar de esclarecimentos sobre como
            seus dados são tratados, ou desejar exercer seus direitos de privacidade, entre em contato conosco através
            dos seguintes canais:
          </p>
          <ul>
            <li><strong>E-mail:</strong> <a href="mailto:app-uca@mandara.com.br">app-uca@mandara.com.br</a></li>
            <li><strong>Suporte Técnico:</strong> Disponível através do menu do aplicativo</li>
            <li><strong>Tempo de Resposta:</strong> Respondemos a todas as solicitações em até 48 horas úteis</li>
            <li><strong>Remoção de Conteúdo:</strong> Solicitações de remoção são processadas prioritariamente</li>
          </ul>
          
          <h3>11. Conformidade e Transparência</h3>
          <p>
            Esta política de privacidade está em conformidade com as melhores práticas de proteção de dados e 
            transparência. Comprometemo-nos a manter você informado sobre como seus dados são tratados e a 
            respeitar sua privacidade em todas as interações com o aplicativo UCA.
          </p>
          <p className="text-xs text-gray-500 mt-8">Última atualização: 18 de Julho de 2025</p>
        </div>
      </div>
    </div>
  )
}
