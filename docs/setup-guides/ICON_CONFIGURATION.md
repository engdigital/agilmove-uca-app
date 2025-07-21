# 🎨 Configuração de Ícones - AgilMove UCA

## ✅ Status da Configuração

A imagem do punho foi configurada como ícone principal do aplicativo para **todos os dispositivos e tamanhos**.

### 📱 Plataformas Suportadas

- ✅ **PWA (Progressive Web App)** - Todos os tamanhos
- ✅ **Android** - Todas as densidades (ldpi, mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi)
- ✅ **iOS** - Apple Touch Icon
- ✅ **Web** - Favicon

### 🗂️ Estrutura de Ícones

```
public/
├── app-icon.png          # Ícone principal (840x840)
├── app-icon.svg          # Versão vetorial
├── favicon.png           # Favicon (32x32)
├── apple-touch-icon.png  # iOS (180x180)
├── icon-72x72.png        # PWA/Android
├── icon-96x96.png        # PWA/Android
├── icon-128x128.png      # PWA/Android
├── icon-144x144.png      # PWA/Android
├── icon-152x152.png      # PWA/Android
├── icon-192x192.png      # PWA/Android
├── icon-384x384.png      # PWA/Android
├── icon-512x512.png      # PWA/Android
└── manifest.json         # Configuração PWA

android/app/src/main/res/
├── mipmap-ldpi/ic_launcher.png     # 36x36
├── mipmap-mdpi/ic_launcher.png     # 48x48
├── mipmap-hdpi/ic_launcher.png     # 72x72
├── mipmap-xhdpi/ic_launcher.png    # 96x96
├── mipmap-xxhdpi/ic_launcher.png   # 144x144
└── mipmap-xxxhdpi/ic_launcher.png  # 192x192
```

## 🔧 Como Regenerar os Ícones

### 1. Substitua o Ícone Principal
```bash
# Substitua o arquivo public/app-icon.png pela nova imagem
# Tamanho recomendado: 512x512 ou maior
```

### 2. Execute o Script de Configuração
```bash
cd scripts
node setup-app-icons.js
```

### 3. Faça o Build Completo
```bash
# Usando o script automático
build-complete.bat

# Ou manualmente:
npm run build
npx cap sync
cd android && gradlew assembleDebug
```

## 📋 Configurações Aplicadas

### PWA (manifest.json)
- ✅ 9 tamanhos de ícone (72x72 até 512x512)
- ✅ Suporte a "maskable" icons
- ✅ Favicon configurado

### Android (Capacitor)
- ✅ Ícones para todas as densidades
- ✅ Ícones redondos e quadrados
- ✅ Ícones foreground configurados

### iOS (Apple Touch Icon)
- ✅ Ícone 180x180 para iOS
- ✅ Configurado no HTML meta tag

## 🧪 Como Testar

### 1. Testar PWA
```bash
npm run dev
# Acesse: http://localhost:3000/icon-test
# Instale o PWA no navegador
```

### 2. Testar APK Android
```bash
# Instale o APK gerado:
android/app/build/outputs/apk/debug/app-debug.apk
```

### 3. Página de Teste
- **URL**: `/icon-test`
- **Funcionalidade**: Visualiza todos os ícones gerados
- **Instruções**: Como instalar o PWA

## 🚨 Problemas Conhecidos

### APK de Produção
O build de release requer configuração do keystore:
```bash
# Configure o keystore em:
android/app/keystore.properties
```

### Tamanhos Personalizados
Para adicionar novos tamanhos, edite:
```bash
scripts/generate-icons.js
```

## 📝 Arquivos de Configuração

- `capacitor.config.ts` - Configuração do Capacitor
- `public/manifest.json` - Configuração PWA
- `scripts/setup-app-icons.js` - Script de configuração
- `scripts/generate-icons.js` - Geração de ícones

## 🎯 Resultado Final

O aplicativo agora possui:
- 🎨 **Ícone do punho** em todos os dispositivos
- 📱 **PWA** instalável com ícone personalizado
- 🤖 **APK Android** com ícone nas configurações
- 🍎 **Suporte iOS** via Apple Touch Icon
- 🌐 **Favicon** personalizado no navegador

---

*Última atualização: 15 de julho de 2025*
