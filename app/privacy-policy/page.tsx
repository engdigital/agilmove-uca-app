"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function PrivacyPolicyPage() {
  const router = useRouter()

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
            Esta Política de Privacidade descreve como o aplicativo "UCA" (União, Comprometimento, Ação) coleta, usa e
            protege suas informações. Ao usar nosso aplicativo, você concorda com os termos desta política.
          </p>

          <h3>1. Coleta e Armazenamento de Dados</h3>
          <p>
            O aplicativo UCA foi projetado para funcionar completamente offline e **não coleta nem armazena seus dados
            pessoais em servidores externos**. Todas as informações relacionadas ao seu progresso de leitura,
            configurações de notificação e histórico de leituras são armazenadas **exclusivamente no seu dispositivo
            local** (utilizando o IndexedDB do navegador).
          </p>
          <ul>
            <li>
              <strong>Dados Armazenados Localmente:</strong>
              <ul>
                <li>Seu progresso de leitura dos pergaminhos (dias completos, último dia de leitura).</li>
                <li>Suas configurações de notificação (horários preferidos).</li>
                <li>Registros de leitura (qual pergaminho foi lido, em qual período e data).</li>
              </ul>
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

          <h3>5. Seus Direitos</h3>
          <p>
            Como seus dados são armazenados localmente, você tem controle total sobre eles. Você pode limpar os dados do
            aplicativo a qualquer momento através das configurações do seu navegador (geralmente em "Configurações do
            Site" ou "Dados do Site"), o que removerá todas as suas informações de progresso e configurações.
          </p>

          <h3>6. Alterações nesta Política de Privacidade</h3>
          <p>
            Podemos atualizar nossa Política de Privacidade periodicamente. A versão mais recente estará sempre
            disponível dentro do aplicativo. Recomendamos que você revise esta política regularmente para quaisquer
            alterações.
          </p>

          <h3>7. Contato</h3>
          <p>
            Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco através do e-mail:{" "}
            <a href="mailto:app-uca@mandara.com.br">app-uca@mandara.com.br</a>.
          </p>
          <p className="text-xs text-gray-500 mt-8">Última atualização: 14 de Julho de 2025</p>
        </div>
      </div>
    </div>
  )
}
