# 📱 UCA - Pergaminhos

![Status](https://img.shields.io/badge/Status-Produção%20Ready-brightgreen)
![PWA](https://img.shields.io/badge/PWA-✓-blue)
![Android](https://img.shields.io/badge/Android-Ready-green)
![Security](https://img.shields.io/badge/Security-High-red)

**UCA - Pergaminhos** é uma **Progressive Web App (PWA)** completa e segura, desenvolvida para auxiliar usuários a manterem uma rotina de leitura e desenvolvimento pessoal baseada em "pergaminhos" motivacionais. O aplicativo oferece rastreamento de progresso, feedback motivacional, notificações inteligentes e está pronto para distribuição em app stores.

---

## 🚀 **Quick Start - Guia para Novos Desenvolvedores**

### **1. 📥 Clone e Configuração Inicial**

```bash
# 1. Clone o repositório
git clone https://github.com/engdigital/agilmove-uca-app.git
cd agilmove-uca-app

# 2. Instale as dependências
npm install --legacy-peer-deps

# 3. Configure ícones PWA e Android
npm run icons:setup

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

**🌐 Acesse:** `http://localhost:3000`

### **2. 🛠️ Pré-requisitos do Sistema**

Para desenvolvimento e build completo:

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **npm** v9+ (incluído com Node.js)
- **Android Studio** ([Download](https://developer.android.com/studio)) - Para builds Android
- **Java JDK** v11+ - Requerido pelo Android Studio

### **3. 📱 Gerando APK de Desenvolvimento**

```bash
# Método 1: Script automatizado (Recomendado)
.\build-apk.bat

# Método 2: Comandos manuais
npm run build
npm run cap:sync
npm run cap:android  # Abre Android Studio
```

**No Android Studio:**
1. Aguarde o Gradle sincronizar (primeira vez demora ~5-10 min)
2. **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
3. APK estará em: `android\app\build\outputs\apk\debug\`

### **4. 🏭 Gerando APK de Produção**

```bash
# 1. Configure o keystore (primeira vez apenas)
.\setup-keystore.bat

# 2. Gere o APK de produção assinado
.\build-production.bat
```

**🔐 O APK assinado estará em:** `android\app\build\outputs\apk\release\`

---

## � **Status do Projeto - 100% Implementado**

### ✅ **Fase 1 - PWA Completa** 
- **✅ PWA Manifest**: Configuração profissional para instalação
- **✅ Service Worker**: Cache offline inteligente e notificações push
- **✅ Ícones**: 8 tamanhos (72x72 até 512x512) + favicon + apple-touch
- **✅ Página Offline**: Interface amigável quando sem internet
- **✅ Meta Tags**: SEO e mobile otimizados para app stores

### ✅ **Fase 2 - Build Android** 
- **✅ Capacitor**: Integração completa (v7.4.2)
- **✅ Android Project**: Configurado e funcional
- **✅ Keystore**: Produção configurado com certificado válido até 2052
- **✅ Scripts Build**: Automatização completa (debug + release)
- **✅ Google Play**: App Bundle (AAB) configurado

### ✅ **Fase 3 - Hooks Seguros** 
- **✅ useSecureStorage**: Armazenamento com validação e criptografia
- **✅ useSecureNotifications**: Notificações sanitizadas e controladas
- **✅ SecureInput**: Componente com validação avançada e rate limiting
- **✅ SecurityProvider**: Medidas gerais de segurança
- **✅ Demo Interface**: `/secure-hooks` para testes
- **📋 Documentação**: [SECURE_HOOKS.md](./SECURE_HOOKS.md)

### ✅ **Fase 4 - Monitoramento** 
- **✅ SecurityDashboard**: Interface completa `/security-dashboard`
- **✅ Scripts Automáticos**: Verificação contínua de segurança
- **✅ Headers Check**: Validação de CSP, HSTS, XSS, etc.
- **✅ Performance Monitor**: Métricas em tempo real
- **✅ Store Readiness**: Verificação automática para app stores
- **📋 Documentação**: [MONITORING.md](./MONITORING.md)

### ✅ **Extras Implementados**
- **✅ Compliance**: Verificação de idade e termos obrigatórios
- **✅ Google Play Signing**: 100% configurado para publicação
- **✅ Security Headers**: CSP, HSTS, X-Frame-Options implementados
- **✅ Ícone Profissional**: Punho da revolução como marca
- **✅ Backup System**: Scripts para backup de keystores

---

## 🎯 **Manual Detalhado de Desenvolvimento**

### **📁 Estrutura do Projeto**

```
agilmove-uca-app/
├── 📱 app/                      # Next.js App Router
│   ├── layout.tsx               # Layout principal com PWA meta tags
│   ├── page.tsx                 # Página inicial da aplicação
│   ├── globals.css              # Estilos globais + Tailwind
│   ├── home/                    # Tela inicial do app
│   ├── launch/                  # Tela de boas-vindas
│   ├── details/                 # Detalhes dos pergaminhos
│   ├── reading/                 # Interface de leitura
│   ├── analytics/               # Dashboard de progresso
│   ├── secure-hooks/            # Demo dos hooks seguros
│   ├── security-dashboard/      # Painel de monitoramento
│   ├── privacy-policy/          # Política de privacidade
│   └── terms-of-use/           # Termos de uso
├── 🧩 components/               # Componentes React
│   ├── ui/                      # shadcn/ui components
│   ├── security-provider.tsx    # Provider de segurança
│   ├── secure-input.tsx         # Input com validação
│   ├── security-dashboard.tsx   # Dashboard de segurança
│   ├── age-verification.tsx     # Verificação de idade
│   ├── pwa-installer.tsx        # Instalador PWA
│   └── error-boundary.tsx       # Tratamento de erros
├── 🔧 hooks/                    # Custom hooks
│   ├── use-mobile.tsx           # Detecção mobile
│   └── use-toast.ts             # Sistema de toasts
├── 📚 lib/                      # Bibliotecas e utilitários
│   ├── db.ts                    # Dados dos pergaminhos
│   ├── scrolls.ts               # Lógica dos pergaminhos
│   ├── utils.ts                 # Utilitários gerais
│   └── app-utils.ts             # Utilitários do app
├── 🌐 public/                   # Assets estáticos
│   ├── manifest.json            # PWA manifest
│   ├── service-worker.js        # Service worker
│   ├── offline.html             # Página offline
│   ├── icon-*.png               # Ícones PWA (8 tamanhos)
│   ├── favicon.png              # Favicon
│   ├── apple-touch-icon.png     # Ícone iOS
│   └── images/                  # Imagens da aplicação
├── 🤖 android/                  # Projeto Android (Capacitor)
│   ├── app/                     # Código Android
│   ├── build.gradle             # Configuração do build
│   ├── agilmove-release.keystore # Keystore de produção
│   ├── upload-key.keystore      # Upload key (Google Play)
│   └── keystore.properties      # Configurações de assinatura
├── 📜 scripts/                  # Scripts de automação
│   ├── generate-icons.js        # Geração de ícones PWA
│   ├── security-check.js        # Verificação de segurança
│   ├── check-headers.js         # Verificação de headers
│   └── monitoring/              # Scripts de monitoramento
├── 🔨 Build Scripts (.bat)      # Scripts Windows
│   ├── build-apk.bat            # Build APK debug
│   ├── build-production.bat     # Build APK release
│   ├── build-bundle.bat         # Build AAB (Google Play)
│   ├── setup-keystore.bat       # Configurar keystore
│   └── validate-*.bat           # Scripts de validação
└── 📋 Documentação (.md)        # Documentação técnica
    ├── README.md                # Este arquivo
    ├── SECURE_HOOKS.md          # Hooks seguros
    ├── MONITORING.md            # Sistema de monitoramento
    ├── KEYSTORE_PRODUCTION.md   # Keystore de produção
    └── GOOGLE_PLAY_*.md         # Documentação Google Play
```

### **⚙️ Scripts Disponíveis**

#### **🌐 Desenvolvimento Web**
```bash
npm run dev          # Servidor de desenvolvimento (http://localhost:3000)
npm run build        # Build de produção Next.js
npm run start        # Servidor de produção
npm run lint         # ESLint checker
```

#### **📱 PWA e Ícones**
```bash
npm run pwa:setup      # Configuração PWA básica (apenas ícones PWA)
npm run pwa:build      # Build PWA otimizado
npm run pwa:validate   # Validar configurações PWA

# 🎨 Configuração Completa de Ícones (RECOMENDADO)
npm run icons:setup    # PWA + Android (configuração completa)
npm run icons:generate # Gerar apenas ícones PWA
npm run icons:android  # Configurar ícones Android (resolve problema de ícone padrão)
npm run icons:check    # Verificar status de todos os ícones
npm run icons:verify   # Verificar apenas ícones PWA

# 📱 Script de Automação
.\setup-icons-complete.bat  # Configuração automatizada completa (Windows)
```

#### **🤖 Android e Mobile**
```bash
npm run cap:sync     # Sincronizar com Capacitor
npm run cap:android  # Abrir Android Studio
npm run cap:build    # Build + sync
npm run cap:dev      # Build + sync + abrir Android Studio
npm run cap:bundle   # Gerar Android App Bundle (AAB)
npm run cap:apk      # Gerar APK release
```

#### **🔒 Segurança e Validação**
```bash
npm run security:check    # Verificação geral de segurança
npm run signing:upload-key # Configurar upload key
node scripts/check-headers.js # Verificar headers HTTP
node scripts/monitoring/auto-monitor.js # Monitoramento automático
```

### **🔧 Comandos de Build por Etapas**

#### **1. Primeira Configuração (Setup Inicial)**
```bash
# 1. Clone e instale
git clone [repo-url]
cd agilmove-uca-app
npm install --legacy-peer-deps

# 2. Configure ícones PWA + Android (IMPORTANTE)
npm run icons:setup

# 3. Teste local
npm run dev
```

#### **2. Build para Desenvolvimento (Debug APK)**
```bash
# Método Automático
.\build-apk.bat debug

# Método Manual
npm run build
npm run cap:sync
npm run cap:android
# No Android Studio: Build > Build APK(s)
```

#### **3. Build para Produção (Release APK)**
```bash
# 1. Configure keystore (primeira vez)
.\setup-keystore.bat

# 2. Build automático
.\build-production.bat

# 3. Verificar assinatura
cd android
keytool -list -v -keystore agilmove-release.keystore
```

#### **4. Build para Google Play (AAB)**
```bash
# 1. Configure upload key separado
.\setup-upload-key.bat

# 2. Gere Android App Bundle
.\build-bundle.bat

# 3. Validar compliance
.\validate-google-play-signing.bat
```

### **🛠️ Ferramentas de Desenvolvimento**

#### **Debug e Monitoramento**
- **Security Dashboard**: `http://localhost:3000/security-dashboard`
- **Secure Hooks Demo**: `http://localhost:3000/secure-hooks`
- **PWA Manifest**: `http://localhost:3000/manifest.json`
- **Service Worker**: Dev Tools > Application > Service Workers

#### **Scripts de Verificação**
```bash
# Verificação completa de segurança
node security-check.js

# Verificação de headers HTTP
node scripts/check-headers.js

# Verificação para app stores
node scripts/store-readiness-check.js

# Monitoramento contínuo
node scripts/monitoring/continuous-monitor.js
```

#### **Validação de Compliance**
```bash
# Verificação crítica de compliance
.\validate-compliance-critical.bat

# Verificação específica Google Play
.\validate-google-play-signing.bat
```


---

## 🔒 **Recursos de Segurança Implementados**

### **1. Headers HTTP de Segurança**
```javascript
// next.config.mjs - Headers configurados
Content-Security-Policy: "default-src 'self'; script-src 'self' 'unsafe-inline'"
X-Content-Type-Options: "nosniff"
X-Frame-Options: "DENY"
X-XSS-Protection: "1; mode=block"
Strict-Transport-Security: "max-age=31536000; includeSubDomains"
Referrer-Policy: "strict-origin-when-cross-origin"
```

### **2. Hooks Seguros (Fase 3)**
- **`useSecureStorage`**: Armazenamento com validação, sanitização e criptografia
- **`useSecureNotifications`**: Notificações controladas com sanitização
- **`useSecureInput`**: Input com rate limiting e validação avançada
- **`SecurityProvider`**: Context global de segurança

### **3. Componentes de Segurança**
- **`SecureInput`**: Validação em tempo real, indicador de força de senha
- **`AgeVerification`**: Verificação obrigatória de idade (compliance)
- **`ErrorBoundary`**: Tratamento robusto de erros React
- **`SecurityDashboard`**: Interface de monitoramento completa

### **4. Sistema de Monitoramento (Fase 4)**
- **Verificação Contínua**: Scripts automáticos de segurança
- **Performance Monitor**: Métricas de sistema em tempo real  
- **Headers Validation**: Verificação automática de headers HTTP
- **Store Readiness**: Validação automática para app stores

---

## 🛡️ **Compliance e Validação**

### **Verificação de Compliance Crítico**
O aplicativo atende aos requisitos obrigatórios:

✅ **Verificação de Idade**: Componente obrigatório implementado  
✅ **Termos de Uso**: Página completa com scroll obrigatório  
✅ **Política de Privacidade**: Página detalhada e acessível  
✅ **Headers de Segurança**: CSP, HSTS, X-Frame-Options configurados  
✅ **HTTPS Ready**: Configurado para produção segura  

```bash
# Verificar compliance automaticamente
.\validate-compliance-critical.bat
```

### **Google Play Store Ready**
O projeto está 100% preparado para publicação:

✅ **App Signing**: Keystore de produção configurado (válido até 2052)  
✅ **Upload Key**: Key separado para maior segurança  
✅ **Android App Bundle**: AAB configurado e testado  
✅ **Package ID**: `br.com.agilmove.uca` (único)  
✅ **Versioning**: Sistema de versionamento implementado  
✅ **Permissions**: Mínimas e necessárias apenas  

```bash
# Verificar prontidão para Google Play
.\validate-google-play-signing.bat
```

---

## 💻 **Tecnologias e Stack**

### **Frontend**
- **Next.js 14** (App Router) - Framework React
- **React 18** - Biblioteca de interface  
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utility-first
- **shadcn/ui** - Componentes de interface
- **Lucide React** - Ícones SVG

### **Mobile**
- **Capacitor 7.4.2** - Bridge para native
- **Android Studio** - IDE para builds Android
- **Gradle** - Sistema de build Android

### **PWA**
- **Service Worker** - Cache offline e notificações
- **Web App Manifest** - Configuração PWA
- **Workbox** (implícito) - Estratégias de cache

### **Segurança**
- **Zod** - Validação de schemas
- **CSP Headers** - Content Security Policy
- **Rate Limiting** - Controle de requisições
- **Input Sanitization** - Sanitização de entrada

### **Build e Deploy**
- **npm/pnpm** - Gerenciador de pacotes
- **Windows Batch** - Scripts de automação
- **Node.js Scripts** - Verificações automáticas

---

## 📱 **Como Funciona o APP**

### **Conceito Principal**
O UCA - Pergaminhos é baseado no conceito de **"pergaminhos diários"** - textos motivacionais que devem ser lidos três vezes por dia durante 30 dias consecutivos. O aplicativo:

1. **Apresenta 10 pergaminhos** com mensagens de União, Comprometimento e Ação
2. **Rastreia o progresso** diário do usuário
3. **Oferece feedback motivacional** baseado na consistência
4. **Permite configuração de lembretes** para manter a rotina
5. **Funciona offline** através do service worker

### **Fluxo de Usuário**
```
Launch Screen → Home Screen → Details → Reading → Analytics
     ↓              ↓           ↓         ↓         ↓
  Boas-vindas   Lista de     Detalhes   Leitura   Progresso
  e instruções  pergaminhos  do scroll  diária    e métricas
```

### **Funcionalidades Principais**

#### **🏠 Tela Home**
- Lista dos 10 pergaminhos
- Indicador visual de progresso (lido/não lido)
- Estatísticas rápidas (dias consecutivos, total lido)
- Acesso às configurações

#### **📖 Tela de Leitura**  
- Apresentação do texto completo do pergaminho
- Timer de leitura (tempo mínimo sugerido)
- Botão de confirmação de leitura
- Feedback motivacional após confirmação

#### **📊 Analytics**
- Gráfico de progresso diário
- Estatísticas de consistência  
- Medalhas e conquistas
- Histórico completo de leituras

#### **⚙️ Configurações**
- Horário preferido para lembretes
- Configuração de notificações
- Reset de progresso
- Termos de uso e privacidade

---

## 🎨 **Configuração de Ícones Android**

### **❌ Problema: Ícone padrão aparece no Android**
Se o ícone do punho não aparece quando o app é instalado no Android, execute:

```bash
# Método 1: Automático (RECOMENDADO)
.\setup-icons-complete.bat

# Método 2: npm script
npm run icons:setup

# Método 3: Manual
npm run icons:android
npm run build
npx cap sync
```

### **✅ Verificar se ícones estão configurados**
```bash
npm run icons:check
# Deve mostrar: "🎉 Configuração de ícones COMPLETA!"
```

### **📱 Testar no Android Studio**
1. `npx cap open android`
2. `Build` → `Clean Project`
3. `Build` → `Rebuild Project`
4. `Build` → `Build APK(s)`
5. Instalar APK e verificar ícone

---

## 🚨 **Resolução de Problemas Comuns**

### **Erro: "Sharp não encontrado"**
```bash
# Instalar Sharp (opcional, apenas para otimização de imagens)
npm install sharp --save-dev --legacy-peer-deps

# Ou usar placeholders (funciona sem Sharp)
npm run pwa:setup  # Cria ícones placeholder automaticamente
```

### **Erro: "Android Studio não encontrado"**
1. Instale o Android Studio: https://developer.android.com/studio
2. Configure o PATH do sistema para incluir o Android Studio
3. Execute: `npm run cap:android` para testar

### **Erro: "Gradle sync failed"**
```bash
# Limpar cache do Gradle
cd android
./gradlew clean

# Regenerar projeto
cd ..
npm run cap:sync
```

### **APK não instalando no Android**
1. Verifique se "Fontes desconhecidas" está habilitado
2. Para APK debug: aceite instalação de apps não-Play Store
3. Para APK release: verifique se está assinado corretamente

### **Ícone padrão aparece no Android (em vez do punho)**
```bash
# Solução rápida
npm run icons:setup

# Ou script automático
.\setup-icons-complete.bat

# Verificar se resolveu
npm run icons:check
```

### **Service Worker não funcionando**
1. Verifique HTTPS (required para SW)
2. Chrome Dev Tools > Application > Service Workers
3. Force refresh ou clear storage

### **Problemas de Performance**
```bash
# Verificar métricas
node scripts/monitoring/performance-monitor.js

# Analisar bundle
npm run build
# Verifique o tamanho em .next/static/
```

---

## 📋 **Checklists de Desenvolvimento**

### **✅ Checklist - Primeiro Setup**
- [ ] Node.js 18+ instalado
- [ ] Android Studio instalado (para builds móveis)
- [ ] Repositório clonado
- [ ] `npm install --legacy-peer-deps` executado
- [ ] `npm run icons:setup` executado (PWA + Android)
- [ ] `npm run icons:check` mostra "Configuração COMPLETA"
- [ ] `npm run dev` funcionando em http://localhost:3000
- [ ] Testado em dispositivo móvel ou emulador
- [ ] `npm run dev` funcionando em http://localhost:3000
- [ ] Testado em dispositivo móvel ou emulador

### **✅ Checklist - APK de Desenvolvimento**
### **✅ Checklist - APK de Desenvolvimento**
- [ ] `npm run icons:setup` executado com sucesso
- [ ] `npm run icons:check` mostra "Configuração COMPLETA"
- [ ] `npm run build` sem erros
- [ ] `npm run cap:sync` sem erros
- [ ] Android Studio abre o projeto corretamente
- [ ] Gradle sync completa sem erros
- [ ] APK debug gerado em `android/app/build/outputs/apk/debug/`
- [ ] APK instalado e funcionando no dispositivo
- [ ] Ícone do punho aparece corretamente (não ícone padrão)

### **✅ Checklist - APK de Produção**
- [ ] Keystore configurado (`.\setup-keystore.bat`)
- [ ] `.\build-production.bat` executado sem erros
- [ ] APK release assinado gerado
- [ ] Verificação de assinatura com keytool
- [ ] Teste de instalação em dispositivo limpo
- [ ] Verificação de compliance (`.\validate-compliance-critical.bat`)

### **✅ Checklist - Google Play Store**
- [ ] Upload key configurado (`.\setup-upload-key.bat`)
- [ ] Android App Bundle gerado (`.\build-bundle.bat`)
- [ ] Validação Google Play (`.\validate-google-play-signing.bat`)
- [ ] Screenshots preparados
- [ ] Metadata da store definido
- [ ] Política de privacidade acessível online

---

## 📚 **Documentação Adicional**

### **Arquivos de Documentação Específica**
- **[ANDROID_ICONS_FIXED.md](./ANDROID_ICONS_FIXED.md)** - ✨ **NOVO** - Resolução do problema de ícones Android
- **[SECURE_HOOKS.md](./SECURE_HOOKS.md)** - Detalhes dos hooks seguros implementados
- **[MONITORING.md](./MONITORING.md)** - Sistema de monitoramento e segurança
- **[KEYSTORE_PRODUCTION.md](./KEYSTORE_PRODUCTION.md)** - Configuração de keystores
- **[GOOGLE_PLAY_SIGNING_FINAL_REPORT.md](./GOOGLE_PLAY_SIGNING_FINAL_REPORT.md)** - Relatório completo Google Play
- **[COMPLIANCE_CRITICAL_VALIDATION_REPORT.md](./COMPLIANCE_CRITICAL_VALIDATION_REPORT.md)** - Validação de compliance
- **[ICON_CONFIGURATION.md](./ICON_CONFIGURATION.md)** - Configuração de ícones
- **[BUILD_ANDROID.md](./BUILD_ANDROID.md)** - Guia detalhado de build Android

### **Scripts de Referência**
- **Scripts .bat** - Automação Windows para builds
- **Scripts .js** - Verificações e validações automáticas
- **Monitoring/** - Sistema completo de monitoramento

---

## 🤝 **Contribuição**

### **Para Desenvolvedores da Equipe**
1. **Clone** o repositório
2. **Siga o Quick Start** acima
3. **Crie uma branch** para sua feature: `git checkout -b feature/nova-funcionalidade`
4. **Teste completamente** usando os checklists
5. **Execute verificações**: `npm run security:check`
6. **Faça commit** e **push**
7. **Abra Pull Request**

### **Padrões de Desenvolvimento**
- **TypeScript** obrigatório para todo código novo
- **Componentes React** modulares e reutilizáveis
- **Hooks customizados** para lógica complexa
- **Testes de segurança** antes de cada commit
- **Documentação** atualizada para novas features

---

## 📞 **Suporte e Contato**

Para dúvidas específicas, consulte:
1. **Issues do GitHub** - Para bugs e melhorias
2. **Documentação específica** - Arquivos .md na raiz
3. **Scripts de validação** - Para verificar configurações
4. **Security Dashboard** - `/security-dashboard` para status geral

---

**🎉 UCA - Pergaminhos - Transformando desenvolvimento pessoal em ação!**

*União • Comprometimento • Ação*
