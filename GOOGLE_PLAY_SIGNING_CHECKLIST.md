# 🔐 Google Play App Signing - Checklist Completo

## ✅ Status Atual do Projeto

### O que JÁ ESTÁ IMPLEMENTADO:
- ✅ Keystore de produção criado (`agilmove-release.keystore`)
- ✅ Configuração de assinatura no build.gradle
- ✅ Scripts de build automático
- ✅ APK assinado funcionando
- ✅ Certificado válido por 27+ anos

### O que PRECISA SER IMPLEMENTADO:

#### 🎯 **IMPLEMENTAÇÃO 1: Android App Bundle (AAB)**
**Status**: ✅ Implementado
- ✅ Configuração bundle no build.gradle
- ✅ Script `build-bundle.bat` criado
- ✅ Comando npm `cap:bundle` adicionado

**Para usar**:
```bash
# Gerar AAB para Google Play
.\build-bundle.bat
# ou
npm run cap:bundle
```

#### 🎯 **IMPLEMENTAÇÃO 2: Play App Signing**
**Status**: ❌ Pendente - Requer acesso ao Google Play Console

**Passos necessários**:
1. Criar conta de desenvolvedor no Google Play ($25 USD)
2. Criar novo app no Play Console
3. Configurar Play App Signing:
   - Opção 1: Deixar Google gerar app signing key
   - Opção 2: Upload do keystore atual como app signing key
4. Configurar upload key separado (recomendado)

#### 🎯 **IMPLEMENTAÇÃO 3: Keystore Security**
**Status**: ❌ Pendente

**Melhorias de segurança**:
- [ ] Separar Upload Key do App Signing Key
- [ ] Criptografar keystore.properties
- [ ] Backup automático do keystore
- [ ] Rotação de keys (se necessário)

#### 🎯 **IMPLEMENTAÇÃO 4: API Registration**
**Status**: ❌ Verificar se necessário

**Se o app usar APIs que requerem certificado**:
- [ ] Google APIs (Maps, Firebase, etc.)
- [ ] Serviços de terceiros
- [ ] Android App Links

---

## 📋 **CHECKLIST GOOGLE PLAY APP SIGNING**

### Requisitos Obrigatórios:
- ✅ App assinado com certificado válido
- ✅ Keystore seguro e protegido
- ✅ Certificado válido por 25+ anos
- ❌ Play App Signing configurado (para apps novos)
- ❌ Android App Bundle (recomendado/obrigatório)

### Requisitos de Segurança:
- ✅ Keystore com senha forte
- ✅ Arquivo keystore em local seguro
- ❌ Upload key separado do app signing key
- ❌ 2FA habilitado na conta Google Play
- ❌ Backup do keystore em local seguro

### Requisitos Técnicos:
- ✅ minSdkVersion configurado (23)
- ✅ targetSdkVersion atualizado (35)
- ✅ compileSdkVersion atualizado (35)
- ✅ versionCode e versionName configurados
- ✅ applicationId único definido

---

## 🚀 **PRÓXIMAS IMPLEMENTAÇÕES**

### **IMPLEMENTAÇÃO 2: Configuração Play App Signing**

Quando você tiver acesso ao Google Play Console:

1. **Criar app no Play Console**:
   - Package name: `br.com.agilmove.uca`
   - App name: "União, Comprometimento, Ação"

2. **Configurar Play App Signing**:
   ```
   Option A: Google-generated key (Recomendado)
   - Deixar Google gerar app signing key
   - Usar keystore atual como upload key
   
   Option B: Own key
   - Upload do keystore atual como app signing key
   - Gerar novo upload key
   ```

3. **Upload do primeiro release**:
   ```bash
   # Gerar AAB
   .\build-bundle.bat
   
   # Upload: android/app/build/outputs/bundle/release/app-release.aab
   ```

### **IMPLEMENTAÇÃO 3: Separação de Keys (Recomendado)**

```bash
# 1. Gerar novo upload key
keytool -genkeypair -v -keystore upload-key.keystore -alias upload -keyalg RSA -keysize 2048 -validity 10000

# 2. Exportar certificado
keytool -export -rfc -keystore upload-key.keystore -alias upload -file upload_certificate.pem

# 3. Registrar no Play Console
```

### **IMPLEMENTAÇÃO 4: Backup e Segurança**

```bash
# Backup do keystore atual
copy android\agilmove-release.keystore backup\agilmove-release-backup.keystore

# Verificar integridade
keytool -list -v -keystore android\agilmove-release.keystore
```

---

## ⚠️ **AVISOS IMPORTANTES**

### Keystore Management:
- **NUNCA** perca o keystore de produção
- **SEMPRE** faça backup em múltiplos locais
- **JAMAIS** compartilhe senhas em repositórios públicos
- **USE** Play App Signing para segurança adicional

### Para Google Play Store:
- **AAB é obrigatório** para novos apps (desde agosto 2021)
- **Play App Signing é obrigatório** para novos apps
- **Upload key deve ser diferente** do app signing key
- **Certificado deve ser válido** por pelo menos até 2033

---

## 📞 **SUPORTE**

Se precisar de ajuda com qualquer implementação:
1. Documentação oficial: https://developer.android.com/studio/publish/app-signing
2. Play Console Help: https://support.google.com/googleplay/android-developer
3. Esta documentação será atualizada conforme implementamos cada item

---

**Data**: 19 de julho de 2025  
**Status**: Implementação 1/4 completa  
**Próximo passo**: Configurar conta Google Play Console
