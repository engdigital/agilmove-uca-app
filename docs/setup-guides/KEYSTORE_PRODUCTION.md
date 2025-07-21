# 🔐 Keystore e Build de Produção - AgilMove UCA

## ✅ Status Final

O keystore foi configurado com sucesso e o APK de produção foi gerado!

### 📁 Arquivos Criados

```
android/
├── agilmove-release.keystore     # Keystore de produção
├── keystore.properties           # Configuração do keystore
└── app/build/outputs/apk/release/
    └── app-release.apk           # APK de produção assinado (22MB)
```

### 🔐 Credenciais do Keystore

**⚠️ IMPORTANTE: Guarde estas informações em local seguro!**

- **Store Password**: `AgilMove2025!@#`
- **Key Password**: `AgilMove2025!@#`
- **Alias**: `agilmove-release`
- **Localização**: `android/agilmove-release.keystore`

### 📋 Certificado Digital

```
Proprietário: CN=AgilMove Team, OU=Development, O=AgilMove, L=São Paulo, ST=SP, C=BR
Emissor: CN=AgilMove Team, OU=Development, O=AgilMove, L=São Paulo, ST=SP, C=BR
Válido de: 15 de julho de 2025
Válido até: 30 de novembro de 2052
Algoritmo: RSA 2048 bits
SHA256: E7:FB:1F:BF:60:39:4C:BB:D9:E8:F6:58:0D:6A:E3:0F:BD:AA:C5:3E:A4:D7:F4:7C:A5:3F:E9:15:A7:40:4F:DE
```

## 🚀 Scripts Disponíveis

### 1. `setup-keystore.bat`
- **Uso**: Configuração inicial do keystore
- **Funcionalidade**: Cria keystore, configura propriedades e gera primeiro APK
- **Quando usar**: Apenas na primeira vez ou para recriar o keystore

### 2. `build-production.bat`
- **Uso**: Builds regulares de produção
- **Funcionalidade**: Build Next.js + Capacitor sync + APK assinado
- **Quando usar**: Para todas as atualizações do app

### 3. `build-complete.bat`
- **Uso**: Build completo com configuração de ícones
- **Funcionalidade**: Ícones + Build + APK debug
- **Quando usar**: Para builds completos de desenvolvimento

## 📱 APK de Produção

### Informações do APK
- **Nome**: `app-release.apk`
- **Tamanho**: ~22MB
- **Assinado**: ✅ Sim
- **Localização**: `android/app/build/outputs/apk/release/`
- **Pronto para**: Distribuição e Google Play Store

### Características
- ✅ Assinado com certificado de produção
- ✅ Otimizado para performance
- ✅ Minificado e ofuscado
- ✅ Ícones personalizados (imagem do punho)
- ✅ Todas as funcionalidades do PWA

## 🔄 Processo de Build

### Build Automático
```bash
# Para builds regulares
build-production.bat

# Para primeira configuração
setup-keystore.bat
```

### Build Manual
```bash
# 1. Build Next.js
npm run build

# 2. Sync Capacitor
npx cap sync

# 3. Build APK
cd android
gradlew.bat assembleRelease
```

## 🎯 Próximos Passos

### Para Distribuição
1. ✅ APK pronto para instalação
2. ✅ Teste em dispositivos Android
3. ✅ Upload para Google Play Store
4. ✅ Distribuição direta via APK

### Para Atualizações
1. Faça as modificações no código
2. Execute `build-production.bat`
3. Teste o novo APK
4. Distribua a atualização

## ⚠️ Avisos Importantes

### Keystore
- **NUNCA** perca o arquivo `agilmove-release.keystore`
- **NUNCA** esqueça as senhas do keystore
- **SEMPRE** faça backup do keystore
- **SEM** o keystore, não é possível atualizar o app na Play Store

### Senhas
- Store Password: `AgilMove2025!@#`
- Key Password: `AgilMove2025!@#`
- Alias: `agilmove-release`

### Backup
```bash
# Faça backup destes arquivos:
android/agilmove-release.keystore
android/keystore.properties
```

## 🆘 Resolução de Problemas

### Erro: "Keystore not found"
- Verifique se `agilmove-release.keystore` está em `android/`
- Verifique se `keystore.properties` aponta para `../agilmove-release.keystore`

### Erro: "Wrong password"
- Verifique as senhas no `keystore.properties`
- Use sempre: `AgilMove2025!@#`

### Erro: "Build failed"
- Execute `npm run build` primeiro
- Execute `npx cap sync` depois
- Verifique se o keystore existe

### Para Recriar Keystore
```bash
# ATENÇÃO: Isso impedirá atualizações de APKs já distribuídos!
setup-keystore.bat
```

---

**Data de Criação**: 15 de julho de 2025  
**Última Atualização**: 15 de julho de 2025  
**Status**: ✅ Keystore configurado e APK gerado com sucesso!
