# Capacitor + Android - Configuração Completa

## ✅ Status da Implementação

### Implementado
- [x] Capacitor CLI instalado (v7.4.2)
- [x] Plataforma Android adicionada
- [x] Configuração do Capacitor (`capacitor.config.ts`)
- [x] Build estático funcional (Next.js export)
- [x] Sincronização bem-sucedida
- [x] Páginas estáticas para todos os scrolls (1-10)
- [x] Scripts npm para Capacitor

### Estrutura do Projeto
```
├── android/                    # Projeto Android nativo
├── capacitor.config.ts         # Configuração do Capacitor
├── out/                        # Build estático (webDir)
└── app/reading/
    ├── 1/page.tsx              # Páginas estáticas
    ├── 2/page.tsx
    ├── ...
    └── 10/page.tsx
```

## 🔧 Comandos Disponíveis

### Build e Sincronização
```bash
npm run build              # Build do Next.js com export estático
npm run cap:sync          # Sincronizar com Capacitor
npm run cap:build         # Build + sync em um comando
```

### Desenvolvimento Android
```bash
npm run cap:android       # Abrir projeto no Android Studio
npm run cap:dev          # Build + sync + abrir Android Studio
```

### Capacitor Direto
```bash
npx cap sync              # Sincronizar mudanças
npx cap open android      # Abrir projeto Android
npx cap build android     # Build do projeto Android
```

## 📱 Gerar APK

### No Android Studio
1. Executar `npm run cap:android`
2. Aguardar sincronização do Gradle
3. Build > Build Bundle(s) / APK(s) > Build APK(s)
4. APK gerado em: `android/app/build/outputs/apk/debug/`

### Via Command Line
```bash
cd android
./gradlew assembleDebug
```

## 🔧 Configuração Atual

### capacitor.config.ts
```typescript
{
  appId: 'br.com.agilmove.uca',
  appName: 'União, Comprometimento, Ação',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    appendUserAgent: 'AgilMoveUCA',
    backgroundColor: '#ffffff'
  }
}
```

### next.config.mjs
```javascript
{
  output: 'export',           // Exportação estática para Capacitor
  trailingSlash: true,        // URLs com trailing slash
  images: { unoptimized: true }
}
```

## 🎯 Próximos Passos

1. **Testar APK**: Gerar e testar APK em dispositivo físico
2. **Ícones**: Configurar ícones específicos para Android
3. **Splash Screen**: Configurar tela de splash
4. **Plugins**: Adicionar plugins necessários (push notifications, etc.)
5. **Produção**: Configurar keystore para builds de produção

## 📋 Resolução de Problemas

### Rotas Dinâmicas
- ❌ Problema: `Page "/reading/[scrollId]" missing generateStaticParams()`
- ✅ Solução: Criadas páginas estáticas `/reading/1` até `/reading/10`

### Build Export
- ❌ Problema: Headers não funcionam com export
- ✅ Solução: Headers ignorados em builds estáticos (normal)

### WebDir
- ❌ Problema: `.next` não tem index.html
- ✅ Solução: Usar `out` com `output: 'export'`

## 🔍 Verificações

Para verificar se tudo está funcionando:

```bash
# 1. Build deve ser bem-sucedido
npm run build

# 2. Pasta out deve ter index.html
ls out/index.html

# 3. Sync deve funcionar
npm run cap:sync

# 4. Android Studio deve abrir
npm run cap:android
```

## 📚 Links Úteis

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Capacitor Android Guide](https://capacitorjs.com/docs/android)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
