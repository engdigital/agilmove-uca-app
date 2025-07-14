## APP UCA União Comprometimento Ação

O "APP UCA União Comprometimento Ação" é uma aplicação web desenvolvida com foco em dispositivos móveis, projetada para auxiliar usuários a manterem uma rotina de leitura e desenvolvimento pessoal, baseada em "pergaminhos" com textos motivacionais. O aplicativo rastreia o progresso de leitura, oferece feedback motivacional e permite a configuração de lembretes.

### 1. Estrutura de Arquivos

O projeto segue a convenção do **Next.js App Router**, organizando os arquivos de forma modular e escalável:

- **`app/`**: Contém as rotas e layouts principais da aplicação.

- **`page.tsx`**: O arquivo principal da aplicação. Ele gerencia o estado global da interface (qual tela está ativa), a lógica de persistência de dados no `localStorage`, e a renderização condicional das diferentes telas (`LaunchScreen`, `HomeScreen`, `DetailsScreen`, `ReadingScreen`).



- **`public/images/`**: Armazena todos os ativos de imagem utilizados na aplicação, como a foto da equipe e as imagens de cada pergaminho.
- **`components/ui/`**: Contém os componentes de UI reutilizáveis do [shadcn/ui](https://ui.shadcn.com/). Estes componentes são importados e utilizados diretamente, sem a necessidade de reescrevê-los. Exemplos incluem `Button`, `Card`, `Progress`, `Badge`, `Tabs`, `Checkbox`, `Toaster`.

- **`toast.tsx`**: O componente `Toast` do shadcn/ui, modificado para remover o botão de fechar, permitindo que os toasts desapareçam automaticamente.
- **`use-toast.ts`**: O hook para gerenciar e exibir os toasts.
- **`toaster.tsx`**: O provedor para os toasts.



- **`lib/utils.ts`**: Contém funções utilitárias, como a função `cn` para concatenar classes CSS condicionalmente.
- **`app/globals.css`**: O arquivo de estilos globais, onde o Tailwind CSS é importado e quaisquer estilos base ou personalizados são definidos.
- **`tailwind.config.ts`**: O arquivo de configuração do Tailwind CSS, onde cores, fontes e outras configurações de design podem ser personalizadas.


### 2. Tecnologias Utilizadas

- **Next.js (App Router)**: Framework React para construção de aplicações web. O App Router é utilizado para a organização baseada em arquivos e para o suporte a Server Components (embora a maior parte da lógica de UI aqui seja Client Component devido à interatividade e `localStorage`).
- **React**: Biblioteca JavaScript para construção de interfaces de usuário interativas. Utilizado para a criação de componentes, gerenciamento de estado e ciclo de vida.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática. Essencial para garantir a robustez do código, prevenir erros em tempo de desenvolvimento e melhorar a manutenibilidade. Interfaces como `ReadingEntry`, `ScrollUserData` e `UserAppData` são exemplos claros de seu uso.
- **Tailwind CSS**: Framework CSS utility-first para estilização rápida e responsiva. Permite a construção de designs complexos diretamente no JSX, sem a necessidade de escrever CSS personalizado na maioria dos casos.
- **shadcn/ui**: Coleção de componentes de UI construídos com Radix UI e estilizados com Tailwind CSS. Oferece componentes acessíveis e personalizáveis, acelerando o desenvolvimento da interface.
- **Lucide React**: Biblioteca de ícones que fornece ícones SVG leves e personalizáveis, utilizados para elementos visuais como `Calendar`, `Bell`, `ArrowLeft`, `Check`, `X`, `Sun`, `Moon`, `RotateCcw`, `Award`.
- **Local Storage**: Mecanismo de armazenamento de dados no navegador do cliente. Utilizado para persistir o estado do usuário (`userAppData`), incluindo o progresso de leitura e as configurações de notificação, garantindo que os dados não sejam perdidos ao fechar o navegador.


### 3. Boas Práticas Implementadas

- **Design Mobile-First e Responsivo**: A aplicação é construída com uma abordagem mobile-first, utilizando classes utilitárias do Tailwind CSS para garantir que a interface se adapte bem a diferentes tamanhos de tela.
- **Modularização e Reusabilidade**: O código é dividido em componentes React (`LaunchScreen`, `HomeScreen`, `DetailsScreen`, `ReadingScreen`) e funções utilitárias (`formatDateToKey`, `getPeriod`, `calculateCompletedDays`, etc.), promovendo a reusabilidade e facilitando a manutenção.
- **Gerenciamento de Estado Centralizado**: O estado principal da aplicação (`userAppData`) é gerenciado em `app/page.tsx` e passado para os componentes filhos conforme necessário. A persistência desse estado é feita de forma eficiente com `useEffect` e `localStorage`.
- **Imutabilidade no Estado**: As atualizações de estado são realizadas criando novas cópias dos objetos (`{ ...prevData }`), em vez de modificar diretamente o estado anterior. Isso evita efeitos colaterais indesejados e facilita o rastreamento de mudanças.
- **Tipagem Estática com TypeScript**: O uso extensivo de TypeScript garante a segurança do tipo, captura erros em tempo de desenvolvimento e melhora a clareza e a colaboração no código.
- **Acessibilidade (A11y)**:

- Uso de atributos `aria-label` para botões com ícones, fornecendo contexto para leitores de tela.
- Implementação de `aria-describedby` e `sr-only` para elementos como o checkbox de termos, melhorando a experiência para usuários com deficiência visual.
- Utilização de `aria-live="polite"` em mensagens de feedback (toasts e mensagens de erro na tela de leitura) para garantir que as atualizações dinâmicas sejam anunciadas pelos leitores de tela.



- **Feedback ao Usuário com Toasts**: Em vez de `alert()` intrusivos, são utilizados toasts (notificações não-bloqueantes) para informar o usuário sobre ações concluídas (leitura confirmada, configurações salvas, etc.). Os toasts são configurados para desaparecer automaticamente, melhorando a experiência do usuário.
- **Otimização de Performance (Client-side)**: O uso de `useCallback` para funções como `confirmReading`, `handleNotificationSave` e `handleResetApp` ajuda a memoizar essas funções, evitando recriações desnecessárias e otimizando o desempenho em re-renderizações de componentes.
- **Internacionalização (Parcial)**: A formatação de datas (`toLocaleDateString("pt-BR", options)`) e a tradução de termos como "manhã", "tarde", "noite" na lógica de período demonstram uma consideração inicial para a internacionalização.
- **Transições Suaves**: A adição de classes CSS de transição (`transition-all duration-300 ease-in-out`) no contêiner principal proporciona uma experiência de navegação mais fluida e agradável entre as telas.


### 4. Limitações e Próximos Passos (Mencionados anteriormente)

- **Push Notifications Reais**: A funcionalidade atual salva as preferências de notificação, mas não envia push notifications reais para o dispositivo do usuário. Isso exigiria a implementação de um Service Worker e, possivelmente, um backend para gerenciar os serviços de push do navegador.
- **Gerenciamento de Erros**: Embora os toasts forneçam feedback, um sistema mais robusto de tratamento de erros (e.g., para falhas de `localStorage` ou outras exceções) poderia ser implementado.
- **Escalabilidade de Dados**: Para um volume muito grande de dados de leitura ou usuários, o `localStorage` pode não ser a solução mais adequada, e uma integração com um banco de dados (como Supabase, Neon, etc.) seria necessária.


---
